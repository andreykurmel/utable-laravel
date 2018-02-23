<?php

namespace Vanguard\Services;

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
        $result = $sql->get();

        //filters data
        $respFilters = [];
        $respDDLs = [];
        if (isset($post->getfilters)) {

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
        }

        $header_data = DB::connection('mysql_data')
            ->table('tb')
            ->join('tb_settings_display as tsd', 'tsd.tb_id', '=', 'tb.id')
            ->where('db_tb', '=', $tableName)
            ->select('tsd.*')
            ->get();

        $tb = (array)DB::connection('mysql_data')->table($tableName)->first();
        $headers = [];
        foreach ($tb as $key => $val) {
            $headers[$key] = $header_data->where('field', '=', $key)->first();
        }

        $responseArray["data"] = array();
        $responseArray["filters"] = $respFilters;
        $responseArray["ddls"] = $respDDLs;
        $responseArray["rows"] = $rowsCount;
        $responseArray["headers"] = $headers;
        if (count($result)) {
            $responseArray["data"] = $result;
            if ($query['opt'] == 'settings') {
                $responseArray["ddl_names_for_settings"] = array();
                foreach ($responseArray["data"] as $item) {
                    if (!empty($item->ddl_id)) {
                        $ddl_name = DB::connection('mysql_data')->table('ddl')->where('id', '=', $item->ddl_id)->first();
                        $responseArray["ddl_names_for_settings"][$ddl_name->id] = $ddl_name->name;
                    }
                }
            }
        } else {
            $data = (array) DB::connection('mysql_data')->table($tableName)->first();
            $data = array_fill_keys(array_keys($data), null);
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
        foreach ($tb as $key => $val) {
            $headers[$key] = $header_data->where('field', '=', $key)->first();
        }
        return $headers;
    }
}