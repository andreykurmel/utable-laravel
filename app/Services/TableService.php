<?php

namespace Vanguard\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TableService {
    public function getData($post) {
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

        $fields_for_select = [];
        if (Auth::user()) {
            if (
                //not admin
                Auth::user()->role_id != 1
                &&
                //not owner
                !DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $tableName)->where('owner', '=', Auth::user()->id)->first()
            ) {
                $tmp_fields_set = DB::connection('mysql_data')
                    ->table('tb')
                    ->join('rights as r', 'tb.id', '=', 'r.table_id')
                    ->join('rights_fields as rf', 'r.id', '=', 'rf.rights_id')
                    ->where('r.user_id', '=', Auth::user()->id)
                    ->where('tb.db_tb', '=', $tableName)
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
        }

        $forFiltersQuery = "SELECT * FROM $tableName WHERE";
        $sql = DB::connection('mysql_data')->table($tableName);

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
        if ($fields_for_select && $fields_for_select !== 1) {
            $select_cls = [];
            foreach ($fields_for_select as $key => $fld) {
                $select_cls[] = $key;
            }
            $sql->select($select_cls);
        }
        $result = $sql->get();

        //filters data
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
                    $selected_filters = DB::connection('mysql_data')->table('tb_settings_display')
                        ->join('tb', 'tb.id', '=', 'tb_settings_display.tb_id')
                        ->select('tb_settings_display.field as field', 'tb_settings_display.name as name')
                        ->where('tb.db_tb', '=', $tableName)
                        ->where('tb_settings_display.filter', '=', 'Yes')
                        ->select('tb_settings_display.field as key', 'tb_settings_display.name')
                        ->get();
                }

                foreach ($selected_filters as $sf) {
                    //get values for each filter
                    $filter_vals = DB::connection('mysql_data')->table($tableName)
                        ->select($sf->key." as value")
                        ->distinct();
                    $data_items = (clone $resultSQL)
                        ->select($sf->key." as value")
                        ->distinct();
                    //if user switched off some filters -> then display it in the result data
                    if ($filter_vals->count() == $data_items->count()) {
                        $filter_vals = DB::connection('mysql_data')->table($tableName)
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
                        $filter_vals = DB::connection('mysql_data')->select("
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


            $ddls = DB::connection('mysql_data')->table('tb')
                ->join('tb_settings_display as ts', 'tb.id', '=', 'ts.tb_id')
                ->join('ddl_items as di', 'di.list_id', '=', 'ts.ddl_id')
                ->select('ts.field', 'di.option')
                ->where('tb.db_tb', '=', $tableName)
                ->whereNotNull('di.option')
                ->get();

            foreach ($ddls as $row) {
                $respDDLs[$row->field][] = $row->option;
            }

            $blet = [];
            if ($post->tableSelected) {
                $blet = DB::connection('mysql_data')->table('ddl')
                    ->join('tb', 'tb.id', '=', 'ddl.tb_id')
                    ->where('tb.db_tb', '=', $post->tableSelected)
                    ->select('ddl.*')
                    ->get();
            } else {
                if ($tableName == 'tb_settings_display')
                $blet = DB::connection('mysql_data')->table('ddl')->get();
            }
            $respDDLs['ddl_id'] = [];
            foreach ($blet as $item) {
                $respDDLs['ddl_id'][$item->id] = $item->name;
            }
        }

        $header_data = DB::connection('mysql_data')
            ->table('tb')
            ->join('tb_settings_display as tsd', 'tsd.tb_id', '=', 'tb.id')
            ->where('db_tb', '=', $tableName)
            ->select('tsd.*')
            ->get();

        $headers = [];
        foreach ($header_data as $hdr) {
            if ($fields_for_select) {
                if ($fields_for_select === 1) {
                    $headers[$hdr->field] = $hdr;
                    $headers[$hdr->field]->can_edit = 1;
                } else {
                    if (isset($fields_for_select[$hdr->field])) {
                        $headers[$hdr->field] = $hdr;
                        $headers[$hdr->field]->can_edit = $fields_for_select[$hdr->field];
                    }
                }
            } else {
                $headers[$hdr->field] = $hdr;
            }
        }

        $responseArray["data"] = array();
        $responseArray["filters"] = $respFilters;
        $responseArray["ddls"] = $respDDLs;
        $responseArray["rows"] = $rowsCount;
        $responseArray["headers"] = $headers;
        if (count($result)) {
            $responseArray["data"] = $result;
            /*if ($query['opt'] == 'settings') {
                $responseArray["ddl_names_for_settings"] = array();
                foreach ($responseArray["data"] as $item) {
                    if (!empty($item->ddl_id)) {
                        $ddl_name = DB::connection('mysql_data')->table('ddl')->where('id', '=', $item->ddl_id)->first();
                        $responseArray["ddl_names_for_settings"][$ddl_name->id] = $ddl_name->name;
                    }
                }
            }*/
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
        $header_data = DB::connection('mysql_data')
            ->table('tb')
            ->join('tb_settings_display as tsd', 'tsd.tb_id', '=', 'tb.id')
            ->where('db_tb', '=', $tableName)
            ->select('tsd.*')
            ->get();

        $tb = (array)DB::connection('mysql_data')->table($tableName)->first();
        $headers = [];
        foreach ($header_data as $hdr) {
            $headers[$hdr->field] = $hdr;
        }
        return $headers;
    }
}