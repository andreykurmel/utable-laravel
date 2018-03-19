<?php

namespace Vanguard\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TableService {
    public function getData($post) {
        $fromMainData = isset($post->from_main_data) ? 1 : 0;
        $tableName = $post->tableName;
        $responseArray = array();
        $page = isset($post->p) ? (int)$post->p : 0;
        $count = isset($post->c) ? (int)$post->c : 0;
        $query = isset($post->q) && !empty((array)json_decode($post->q)) ? (array)json_decode($post->q) : ['opt' => ''];
        $fields = isset($post->fields) ? (array)json_decode($post->fields) : [];
        $filterData = isset($post->filterData) ? (array)json_decode($post->filterData) : [];
        $changedFilter = isset($post->changedFilter) && $post->changedFilter ? json_decode($post->changedFilter) : false;
        if (!isset($query['opt'])) {
            $query['opt'] = "";
        }

        if(empty($tableName)) {
            $responseArray["error"] = TRUE;
            $responseArray["msg"] = "TableName Not Found!";
            return $responseArray;
        }

        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        $mysql_conn = $table_meta->is_system ? 'mysql_sys' : 'mysql_data';

        $fields_for_select = [];
        if (Auth::user()) {
            if (
                //not admin
                Auth::user()->role_id != 1
                &&
                //not owner
                $table_meta->owner != Auth::user()->id
            ) {
                $tmp_fields_set = DB::connection('mysql_sys')
                    ->table('rights as r')
                    ->join('rights_fields as rf', 'r.id', '=', 'rf.rights_id')
                    ->where('r.user_id', '=', Auth::user()->id)
                    ->where('r.table_id', '=', $table_meta->id)
                    ->select('rf.*')
                    ->get();
                foreach ($tmp_fields_set as $fld) {
                    if ($fld->view) {
                        $fields_for_select[$fld->field] = $fld->edit;
                    }
                }
                $fields_for_select['id'] = 0;
            } else {
                $fields_for_select = 1;
            }

            //if user don`t have correct order in 'orders.sql' for current table -> repair
            $this->RepairColOrderForUser($table_meta);
        }

        $sql = DB::connection($mysql_conn)->table($tableName);

        if ($query['opt'] == 'address') {
            foreach ($query as $key => $val) {
                if (!in_array($key, ['opt', 'searchKeyword', 'changedKeyword']) && $val) {
                    $sql->where($tableName.'.'.$key, '=', $val);
                }
            }
        } elseif ($query['opt'] == 'lat' && $query['lat_dec'] && $query['long_dec']) {
            $dist_lat = $query['distance']/(111/1.6);
            $dist_long = $query['distance']/(85/1.6);
            $sql->where($tableName.'.'.'lat_dec', '>', ($query['lat_dec'] - $dist_lat));
            $sql->where($tableName.'.'.'lat_dec', '<', ($query['lat_dec'] + $dist_lat));
            $sql->where($tableName.'.'.'long_dec', '>', ($query['long_dec'] - $dist_long));
            $sql->where($tableName.'.'.'long_dec', '<', ($query['long_dec'] + $dist_long));
        } elseif ($query['opt'] == 'settings' && $query['tb_id']) {
            $sql->where($tableName.'.'.'tb_id', '=', $query['tb_id']);
        }

        if (!empty($query['searchKeyword']) && $fields) {
            $sql->where(function ($q) use ($fields, $query, $tableName) {
                foreach ($fields as $field => $val) {
                    $q->orWhere($tableName.'.'.$field, 'LIKE', "%".$query['searchKeyword']."%");
                }
            });
        }

        if (!empty($filterData) && empty($query['changedKeyword'])) {
            if ($changedFilter && $changedFilter->status) {
                //if "all" -> then disable filters and show all records
                //else :
                if ($changedFilter->val != "all") {
                    foreach ($filterData as $filterElem) {
                        if ($filterElem->key == $changedFilter->name) {
                            $includedVals = [];
                            foreach ($filterElem->val as $item) {
                                if ($item->checked) {
                                    $includedVals[] = $item->value;
                                }
                            }
                            $sql->WhereIn($tableName.'.'.$filterElem->key, $includedVals);
                        }
                    }
                }
            } else {
                foreach ($filterData as $filterElem) {
                    if (!$filterElem->checkAll) {
                        $excludedVals = [];
                        foreach ($filterElem->val as $item) {
                            if (!$item->checked) {
                                $excludedVals[] = $item->value;
                            }
                        }
                        $sql->whereNotIn($tableName.'.'.$filterElem->key, $excludedVals);
                    }
                }
            }
        }
        $resultSQL = clone $sql;
        $rawResultSQL = $resultSQL->toSql();
        foreach($resultSQL->getBindings() as $binding) {
            $value = is_numeric($binding) ? $binding : "'".$binding."'";
            $rawResultSQL = preg_replace('/\?/', $value, $rawResultSQL, 1);
        }

        $rowsCount = $sql->count();
        if ($count) {
            $sql->offset($page*$count)->limit($count);
        }

        //join favourite table for main data
        if($fromMainData) {
            $sql->leftJoin('favorite as f', function ($q) use ($tableName, $table_meta) {
                $q->whereRaw($tableName.'.id = f.row_id');
                $q->where('f.user_id', '=', (Auth::user() ? Auth::user()->id : 0));
                $q->where('f.table_id', '=', $table_meta->id);
            });
        }

        //if user isn`t admin or owner -> then select only accessible fields
        if ($fields_for_select && $fields_for_select !== 1) {
            $select_cls = [];
            foreach ($fields_for_select as $key => $fld) {
                $select_cls[] = $tableName.".".$key;
            }
            if($fromMainData) {
                $select_cls[] = 'f.id as is_favorited';
            }
            $sql->select($select_cls);
        } else {
            if($fromMainData) {
                $sql->select($tableName.'.*', 'f.id as is_favorited');
            }
        }

        if ($tableName == 'tb_settings_display' && !$fromMainData) {
            $sql->orderBy($tableName.'.rows_ord');
        }
        $sql->orderBy($tableName.'.id');
        $result = $sql->get();


        //----------------------------------------filters data -----------------------------------------------
        $respFilters = [];
        $respDDLs = [];
        if (isset($post->getfilters) || $query['opt'] == 'settings') {

            if ($query['opt'] != 'settings') {
                //get columns for which filters are enabled
                if (
                    !empty($filterData)
                    &&
                    (!empty($query['changedKeyword']) || !empty($changedFilter))
                ) {
                    $selected_filters = $filterData;
                } else {
                    $selected_filters = DB::connection('mysql_sys')->table('tb_settings_display')
                        ->where('tb_id', '=', $table_meta->id)
                        ->where('filter', '=', 'Yes')
                        ->select('field as key', 'name')
                        ->get();
                }

                //if in loaded data was no changes, only next page -> then return current filters
                if (!empty($filterData) && empty($query['changedKeyword']) && empty($changedFilter)) {
                    $respFilters = $filterData;
                } else {
                    //get filters if data was changed or it is first load
                    foreach ($selected_filters as $sf) {
                        //get values for each filter
                        $filter_vals = DB::connection($mysql_conn)->table($tableName)
                            ->select($sf->key." as value")
                            ->distinct();
                        $data_items = (clone $resultSQL)
                            ->select($sf->key." as value")
                            ->distinct();
                        //if user switched off some filters -> then display it in the result data
                        if ($filter_vals->count() == $data_items->count()) {
                            $filter_vals = DB::connection($mysql_conn)->table($tableName)
                                ->select($sf->key." as value")
                                ->selectRaw("true as checked")
                                ->distinct()->get();
                            $filterObj = [
                                'key' => $sf->key,
                                'name' => $sf->name,
                                'val' => $filter_vals ? $filter_vals : [],
                                'checkAll' => true
                            ];
                        } else {
                            $filter_vals = DB::connection($mysql_conn)->select("
                                SELECT DISTINCT `$tableName`.`".$sf->key."` as value, IF(SUM(t2.id) is null, false, true) as checked
                                FROM `$tableName` LEFT JOIN ( ".$rawResultSQL." ) as t2 on t2.id = `$tableName`.id
                                GROUP BY `$tableName`.`".$sf->key."`
                            ");
                            $filterObj = [
                                'key' => $sf->key,
                                'name' => $sf->name,
                                'val' => $filter_vals ? $filter_vals : [],
                                'checkAll' => false
                            ];
                        }
                        $respFilters[] = $filterObj;
                    }
                }
            }


            $ddls = DB::connection('mysql_sys')->table('tb_settings_display as ts')
                ->join('ddl_items as di', 'di.list_id', '=', 'ts.ddl_id')
                ->select('ts.field', 'di.option')
                ->where('ts.tb_id', '=', $table_meta->id)
                ->whereNotNull('di.option')
                ->get();

            foreach ($ddls as $row) {
                $respDDLs[$row->field][] = $row->option;
            }

            $blet = [];
            if ($post->tableSelected) {
                $blet = DB::connection('mysql_sys')->table('ddl')
                    ->join('tb', 'tb.id', '=', 'ddl.tb_id')
                    ->where('tb.db_tb', '=', $post->tableSelected)
                    ->select('ddl.*')
                    ->get();
            } else {
                if ($tableName == 'tb_settings_display')
                $blet = DB::connection('mysql_sys')->table('ddl')->get();
            }
            $respDDLs['ddl_id'] = [];
            foreach ($blet as $item) {
                $respDDLs['ddl_id'][$item->id] = $item->name;
            }
        }

        //--------------------------------------------------- get headers --------------------------------------------
        if (Auth::user()) {
            $header_data = DB::connection('mysql_sys')
                ->select("
                    SELECT tsd.*, IF(o.order IS NOT NULL, o.order, tsd.dfot_odr) as calc_odr, IF(sh.showhide IS NULL, 1, sh.showhide) as is_showed
                    FROM `tb_settings_display` as tsd 
                    LEFT JOIN `orders` as o ON (o.user_id = ".Auth::user()->id." AND o.table_id = ".$table_meta->id." AND tsd.field = o.column_key)
                    LEFT JOIN `showhide` as sh ON (sh.user_id = ".Auth::user()->id." AND sh.table_id = ".$table_meta->id." AND tsd.field = sh.column_key)
                    WHERE tsd.tb_id = ".$table_meta->id."
                    ORDER BY calc_odr, tsd.id
                ");
        } else {
            $header_data = DB::connection('mysql_sys')
                ->table('tb_settings_display as tsd')
                ->where('tsd.tb_id', '=', $table_meta->id)
                ->selectRaw('tsd.*, tsd.dfot_odr as calc_odr, 1 as is_showed')
                ->orderBy('tsd.dfot_odr')
                ->orderBy('tsd.id')
                ->get();
        }

        $headers = [];
        foreach ($header_data as $idx => $hdr) {
            if ($fields_for_select) {
                if ($fields_for_select === 1) {
                    $headers[$idx] = $hdr;
                    $headers[$idx]->can_edit = 1;
                } else {
                    if (isset($fields_for_select[$hdr->field])) {
                        $headers[$idx] = $hdr;
                        $headers[$idx]->can_edit = $fields_for_select[$hdr->field];
                    }
                }
            } else {
                $headers[$idx] = $hdr;
            }
        }

        $responseArray["data"] = array();
        $responseArray["filters"] = $respFilters;
        $responseArray["ddls"] = $respDDLs;
        $responseArray["rows"] = $rowsCount;
        $responseArray["headers"] = $headers;
        if (count($result)) {
            $responseArray["data"] = $result;
        } else {
            $data = [];
            foreach ($headers as $hdr) {
                $data[$hdr->field] = '';
            }
            array_push($responseArray["data"],$data);
            $responseArray["error"] = TRUE;
            $responseArray["msg"] = "No Data";
        }

        return $responseArray;
    }

    public function getHeaders($tableName) {
        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        if (Auth::user()) {
            $header_data = DB::connection('mysql_sys')
                ->select("
                    SELECT tsd.*, IF(o.order IS NOT NULL, o.order, tsd.dfot_odr) as calc_odr 
                    FROM `tb_settings_display` as tsd 
                    LEFT JOIN `orders` as o ON (o.user_id = ".Auth::user()->id." AND o.table_id = ".$table_meta->id." AND tsd.field = o.column_key)
                    WHERE tsd.tb_id = ".$table_meta->id."
                    ORDER BY calc_odr, tsd.id
                ");
        } else {
            $header_data = DB::connection('mysql_sys')
                ->table('tb_settings_display as tsd')
                ->where('tsd.tb_id', '=', $table_meta->id)
                ->select('tsd.*', 'tsd.dfot_odr as calc_odr')
                ->orderBy('tsd.dfot_odr')
                ->orderBy('tsd.id')
                ->get();
        }

        /*$headers = [];
        foreach ($header_data as $hdr) {
            $headers[$hdr->field] = $hdr;
        }*/
        return $header_data;
    }

    public function RepairColOrderForUser($table_meta) {
        //if user don`t have correct order in 'orders.sql' for current table -> repair
        $columnsCnt = DB::connection('mysql_sys')
            ->table('orders')
            ->where('user_id', '=', Auth::user()->id)
            ->where('table_id', '=', $table_meta->id)
            ->groupBy('order')
            ->get();

        $settingsCnt = DB::connection('mysql_sys')
            ->table('tb_settings_display')
            ->where('tb_id', '=', $table_meta->id)
            ->orderBy('dfot_odr')
            ->orderBy('id');

        if (count($columnsCnt) != $settingsCnt->count()) {
            DB::connection('mysql_sys')->table('orders')->where('user_id', '=', Auth::user()->id)->where('table_id', '=', $table_meta->id)->delete();
            $settingsCnt = $settingsCnt->get();
            for ($i = 0; $i < count($settingsCnt); $i++) {
                DB::connection('mysql_sys')->table('orders')->insert([
                    'user_id' => Auth::user()->id,
                    'table_id' => $table_meta->id,
                    'column_key' => $settingsCnt[$i]->field,
                    'order' => ($i+1),
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            }
        }
    }
}