<?php

namespace Vanguard\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class TableService {
    private $subdomain = "";

    public function __construct() {
        if( preg_match('/^www\.?(.+)\.tabledataplace\.com$/i', $_SERVER['HTTP_HOST']/*'www.sub.tabledataplace.com'*/, $subdomain) ) {
            $this->subdomain = $subdomain[1];
        }
    }

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
        if ($table_meta->source == 'remote') {
            $this->setRemoteConnection($table_meta->conn_id);
        }
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
                $tmp_fields_set = $this->getPermissionsFields(Auth::user()->id, $table_meta->id);
                if (!$tmp_fields_set) {
                    $tmp_fields_set = $this->getPermissionsFields(0, $table_meta->id);
                }
                foreach ($tmp_fields_set as $fld) {
                    if ($fld->view) {
                        $fields_for_select[$fld->field] = $fld->edit;
                    }
                }
                $fields_for_select['id'] = 0;
            } else {
                $fields_for_select = 1;
            }
        } else {
            $tmp_fields_set = $this->getPermissionsFields(0, $table_meta->id);
            foreach ($tmp_fields_set as $fld) {
                if ($fld->view) {
                    $fields_for_select[$fld->field] = $fld->edit;
                }
            }
            $fields_for_select['id'] = 0;
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
            $sql->where($tableName.'.'.'user_id', '=', Auth::user() ? Auth::user()->id : $table_meta->owner);
        }

        if (!empty($query['searchKeyword']) && $fields) {
            $sql->where(function ($q) use ($fields, $query, $tableName) {
                foreach ($fields as $field) {
                    $q->orWhere($tableName.'.'.$field->field, 'LIKE', "%".$query['searchKeyword']."%");
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
                            $includedVals[] = $changedFilter->val;
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
        if($fromMainData && $table_meta->source != 'remote' && $table_meta->is_system == 0) {
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
            if($fromMainData && $table_meta->source != 'remote' && $table_meta->is_system == 0) {
                $select_cls[] = 'f.id as is_favorited';
            }
            $sql->select($select_cls);
        } else {
            if($fromMainData && $table_meta->source != 'remote' && $table_meta->is_system == 0) {
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
                        ->where('user_id', '=', Auth::user() ? Auth::user()->id : $table_meta->owner)
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

            //get regular ddls
            $ddls = DB::connection('mysql_sys')->table('tb_settings_display as ts')
                ->join('ddl_items as di', function ($q) {
                    $q->whereRaw('di.list_id = ts.ddl_id OR di.list_id = ts.unit_ddl');
                })
                ->join('ddl as d', 'di.list_id', '=', 'd.id')
                ->select('ts.field', 'di.option')
                ->where('ts.user_id', '=', Auth::user() ? Auth::user()->id : $table_meta->owner)
                ->where('ts.tb_id', '=', $table_meta->id)
                ->where('d.type', '=', 'regular')
                ->whereNotNull('di.option')
                ->get();

            foreach ($ddls as $row) {
                $respDDLs[$row->field][] = $row->option;
            }

            //get referencing ddls
            $ddls_ref = DB::connection('mysql_sys')->table('tb_settings_display as ts')
                ->join('ddl as d', function ($q) {
                    $q->whereRaw('d.id = ts.ddl_id OR d.id = ts.unit_ddl');
                })
                ->join('cdtns as cd', 'cd.ddl_id', '=', 'd.id')
                ->select('cd.*', 'ts.field')
                ->where('ts.user_id', '=', Auth::user() ? Auth::user()->id : $table_meta->owner)
                ->where('ts.tb_id', '=', $table_meta->id)
                ->where('d.type', '=', 'referencing')
                ->get();

            foreach ($ddls_ref as $row) {
                $options = DB::connection('mysql_data')->table($row->ref_tb);
                if ($row->sampleing == 'Distinctive') {
                    $options->distinct();
                }
                if ($row->comp_field) {
                    $options->join($table_meta->db_tb, $table_meta->db_tb.'.'.$row->comp_field, '=', $row->ref_tb.'.'.$row->ref_tb_field);
                }
                $options = $options->select($row->ref_tb.'.'.$row->ref_tb_field)->get();
                foreach ($options as $opt) {
                    $opt = (array)$opt;
                    $respDDLs[$row->field][] = $opt[$row->ref_tb_field];
                }
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
        $headers = $this->getHeaders($tableName, $fields_for_select);

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

    public function addRight($tableName, $fields) {
        $result = 'undefined';

        //insert rights for all table
        if ($tableName == 'permissions') {

            $present = DB::connection('mysql_sys')->table('permissions')
                ->where('user_id', '=', $fields['user_id'])
                ->where('table_id', '=', $fields['table_id'])
                ->first();

            if ($present) {
                $result = [
                    'status' => 'present',
                    'id' => $present->id
                ];
            } else {
                DB::connection('mysql_sys')->table('permissions')->insert([
                    'user_id' => $fields['user_id'],
                    'table_id' => $fields['table_id'],
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);

                $id = DB::connection('mysql_sys')->getPdo()->lastInsertId();
                $table_meta = DB::connection('mysql_sys')->table('tb')->where('id', '=', $fields['table_id'])->first();

                $rights_fields = DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->where('user_id', '=', $table_meta->owner)
                    ->where('tb_id', '=', $fields['table_id'])
                    ->get();

                foreach ($rights_fields as $rf) {
                    DB::connection('mysql_sys')->table('permissions_fields')->insert([
                        'permissions_id' => $id,
                        'field' => $rf->field,
                        'view' => 0,
                        'edit' => 0,
                        'notes' => '',
                        'createdBy' => Auth::user()->id,
                        'createdOn' => now(),
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
                }
                $result = [
                    'status' => 'inserted',
                    'id' => $id
                ];
            }

        //insert right only for one field
        } elseif ($tableName == 'permissions_fields') {

            $present = DB::connection('mysql_sys')->table('permissions_fields')
                ->where('permissions_id', '=', $fields['permissions_id'])
                ->where('field', '=', $fields['field'])
                ->first();

            if ($present) {
                $result = [
                    'status' => 'present',
                    'id' => $present->id
                ];
            } else {
                DB::connection('mysql_sys')->table('permissions_fields')->insert([
                    'permissions_id' => $fields['permissions_id'],
                    'field' => $fields['field'],
                    'view' => $fields['view'],
                    'edit' => $fields['edit'],
                    'notes' => $fields['notes'],
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
                $result = [
                    'status' => 'inserted',
                    'id' => DB::connection('mysql_sys')->getPdo()->lastInsertId()
                ];
            }

        }
        return $result;
    }

    public function setRemoteConnection($connId, $connName = 'mysql_data') {
        $conn = DB::connection('mysql_sys')->table('conn')->where('id', '=', $connId)->first();
        Config::set('database.connections.'.$connName.'.host', $conn->server);
        Config::set('database.connections.'.$connName.'.username', $conn->user);
        Config::set('database.connections.'.$connName.'.password', $conn->pwd);
        Config::set('database.connections.'.$connName.'.database', $conn->db);
    }

    public function getHeaders($tableName, $fields_for_select = []) {
        if ($fields_for_select && is_array($fields_for_select)) {
            $fields_for_select['tb_id'] = 1;
        }
        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();

        if (Auth::user()) {
            $header_data = $this->selectHeaders($table_meta, Auth::user()->id);

            if ($header_data->count() == 0) {
                $this->CopySettingsForUser($table_meta);
                $header_data = $this->selectHeaders($table_meta, Auth::user()->id);
            }

        } else {
            $header_data = $this->selectHeaders($table_meta, 0);
        }

        $headers = [];
        if ($fields_for_select) {
            foreach ($header_data as $idx => $hdr) {
                if ($fields_for_select === 1) {
                    $headers[$idx] = $hdr;
                    $headers[$idx]->can_edit = 1;
                } else {
                    if (isset($fields_for_select[$hdr->field])) {
                        $headers[$idx] = $hdr;
                        $headers[$idx]->can_edit = $fields_for_select[$hdr->field];
                    }
                }
            }
        } else {
            $headers = $header_data;
        }
        return $headers;
    }

    public function getImportHeaders($tableName, $target_tb_id = 0) {
        if ($target_tb_id == 0) {
            $importHeadersMeta = $tableName
                ?
                DB::connection('mysql_schema')
                    ->table('COLUMNS')
                    ->where('TABLE_SCHEMA', '=', env('DB_DATABASE_DATA', 'utable'))
                    ->where('TABLE_NAME', '=', $tableName)
                    ->get()
                :
                [];
            $importHeaders = $tableName ? $this->getHeaders($tableName) : $this->emptyTBHeaders();

            foreach ($importHeaders as &$imp) {
                if (in_array($imp->field, ['id','createdBy','createdOn','modifiedBy','modifiedOn'])) {
                    $imp->auto = 1;
                    $imp->type = ($imp->field == 'createdOn' || $imp->field == 'modifiedOn' ? 'Date' : 'Integer');
                    $imp->default = 'auto';
                    $imp->required = 1;
                    $imp->maxlen = '';
                } else {
                    $curval = [];
                    foreach ($importHeadersMeta as $imeta) {
                        if ($imeta->COLUMN_NAME == $imp->field) {
                            $curval = $imeta;
                            break;
                        }
                    }
                    $imp->auto = 0;
                    $imp->type = ($curval && $curval->NUMERIC_PRECISION ? 'Integer' : ($curval && $curval->DATETIME_PRECISION ? 'Date' : 'String'));
                    $imp->default = ($curval && $curval->COLUMN_DEFAULT ? $curval->COLUMN_DEFAULT : '');
                    $imp->required = ($curval && $curval->IS_NULLABLE != 'YES' ? 1 : 0);
                    $imp->maxlen = ($curval && $curval->CHARACTER_MAXIMUM_LENGTH ? $curval->CHARACTER_MAXIMUM_LENGTH : '');
                }
            }
        } else {
            $importHeaders = $tableName
                ?
                DB::connection('mysql_sys')
                    ->table('tb_rfcn')
                    ->join('tb', 'tb.id', '=', 'tb_rfcn.tb_id')
                    ->where('tb.db_tb', '=', $tableName)
                    ->groupBy('tb_rfcn.ref_tb')
                    ->select('tb_rfcn.*')
                    ->get()
                :
                [];

            if ($importHeaders) {
                foreach ($importHeaders as &$imp) {
                    $imp->items = [];
                    $t_arr = DB::connection('mysql_sys')
                        ->table('tb_rfcn')
                        ->where('tb_id', '=', $imp->tb_id)
                        ->where('ref_tb', '=', $imp->ref_tb)
                        ->get();
                    foreach ($t_arr as $t) {
                        $imp->items[$t->field] = $t->ref_field;
                    }
                }
            }
        }

        return $importHeaders;
    }

    private function emptyTBHeaders() {
        return [
            (object) ['field' => 'id', 'name' => 'ID', 'type' => 'int'],
            (object) ['field' => 'createdBy', 'name' => 'Created By', 'type' => 'int'],
            (object) ['field' => 'createdOn', 'name' => 'Created On', 'type' => 'data'],
            (object) ['field' => 'modifiedBy', 'name' => 'Modified By', 'type' => 'int'],
            (object) ['field' => 'modifiedOn', 'name' => 'Modified On', 'type' => 'data']
        ];
    }

    private function selectHeaders($table_meta, $user_id) {
        return DB::connection('mysql_sys')->table('tb_settings_display as tsd')
            ->where('tsd.user_id', '=', $user_id ? $user_id : $table_meta->owner)
            ->where('tsd.tb_id', '=', $table_meta->id)
            ->selectRaw('tsd.*, '.($user_id ? 'tsd.showhide as is_showed' : '1 as is_showed'))
            ->orderBy('tsd.order')
            ->orderBy('tsd.id')
            ->get();
    }

    private function CopySettingsForUser($table_meta) {
        $header_data = $this->selectHeaders($table_meta, 0);

        for ($i = 0; $i < count($header_data); $i++) {
            unset($header_data[$i]->id);
            unset($header_data[$i]->is_showed);
            $header_data[$i]->user_id = Auth::user()->id;
            $header_data[$i]->web = $header_data[$i]->field == 'id' ? 'No' : $header_data[$i]->field;
            DB::connection('mysql_sys')->table('tb_settings_display')->insert((array)$header_data[$i]);
        }

        $res = $this->addRight('permissions', [
            'user_id' => Auth::user()->id,
            'table_id' => 2
        ]);

        DB::connection('mysql_sys')->table('permissions_fields')
            ->where('permissions_id', '=', $res['id'])
            ->whereIn('field', ['name','web','filter','sum','min_wth','max_wth','order','showhide','notes'])
            ->update([
                'view' => 1
            ]);
    }

    private function getPermissionsFields($user_id, $table_id) {
        return DB::connection('mysql_sys')
            ->table('permissions as r')
            ->join('permissions_fields as rf', 'r.id', '=', 'rf.permissions_id')
            ->where('r.user_id', '=', $user_id)
            ->where('r.table_id', '=', $table_id)
            ->select('rf.*')
            ->get();
    }
}