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

        $sql = DB::table($tableName);
        if ($query['opt'] == 'address') {
            foreach ($query as $key => $val) {
                if (!in_array($key, ['opt', 'searchKeyword']) && $val) {
                    $sql->where($key, '=', $val);
                }
            }
        } elseif ($query['opt'] == 'lat' && $query['lat_dec'] && $query['long_dec']) {
            $dist_lat = $query['distance']/(111/1.6);
            $dist_long = $query['distance']/(85/1.6);
            $sql->where('lat_dec', '>', ($query['lat_dec'] - $dist_lat));
            $sql->where('lat_dec', '<', ($query['lat_dec'] + $dist_lat));
            $sql->where('long_dec', '>', ($query['long_dec'] - $dist_long));
            $sql->where('long_dec', '<', ($query['long_dec'] + $dist_long));
        }

        if (!empty($query['searchKeyword']) && $fields) {
            $sql->where(function ($q) use ($fields, $query) {
                foreach ($fields as $field => $val) {
                    $q->orWhere($field, 'LIKE', "%".$query['searchKeyword']."%");
                }
            });
        }

        if (!empty($filterData)) {
            if ($changedFilter && $changedFilter->status) {
                //if "all" -> then disable filters and show all records
                //else :
                if ($changedFilter->val != "all") {
                    foreach ($filterData as $filterElem) {
                        if (!$filterElem->checkAll) {
                            $includedVals = [];
                            foreach ($filterElem->val as $item) {
                                if (!$item->checked) {
                                    $includedVals[] = $item->value;
                                }
                            }
                            $sql->orWhereIn($filterElem->key, $includedVals);
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
                        $sql->whereNotIn($filterElem->key, $excludedVals);
                    }
                }
            }
        }
        $resultSQL = clone $sql;

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
            $selected_filters = DB::table('tb_settings')
                ->join('tb', 'tb.id', '=', 'tb_settings.tb_id')
                ->select('tb_settings.field as field', 'tb_settings.name as name')
                ->where('tb.db_tb', '=', $tableName)
                ->where('tb_settings.filter', '=', 'Yes')
                ->get();

            foreach ($selected_filters as $sf) {
                //get values for each filter
                $filter_vals = DB::table($tableName)
                    ->select($sf->field." as value")
                    ->selectRaw("true as checked")
                    ->distinct()->get();
                $data_items = (clone $resultSQL)->select($sf->field." as value")->distinct()->get();
                //if user switched off some filters -> then display it in the result data
                if ($filter_vals->count() == $data_items->count()) {
                    $filterObj = [
                        'key' => $sf->field,
                        'name' => $sf->name,
                        'val' => $filter_vals ? $filter_vals : [],
                        'checkAll' => true
                    ];
                } else {
                    for ($i = 0; $i < $filter_vals->count(); $i++) {
                        if (!$data_items->where('value', $filter_vals[$i]->value)->all()) {
                            $filter_vals[$i]->checked = false;
                        }
                    }
                    $filterObj = [
                        'key' => $sf->field,
                        'name' => $sf->name,
                        'val' => $filter_vals ? $filter_vals : [],
                        'checkAll' => false
                    ];
                }
                $respFilters[] = $filterObj;
            }

            $ddls = DB::table('tb')
                ->join('tb_settings as ts', 'tb.id', '=', 'ts.tb_id')
                ->join('ddl_items as di', 'di.list_id', '=', 'ts.ddl_id')
                ->select('ts.field', 'di.option')
                ->where('tb.db_tb', '=', $tableName)
                ->whereNotNull('di.option')
                ->get();

            foreach ($ddls as $row) {
                $respDDLs[$row->field][] = $row->option;
            }
        }

        $responseArray["data"] = array();
        $responseArray["key"] = array();
        $responseArray["key_settings"] = array();
        $responseArray["filters"] = $respFilters;
        $responseArray["ddls"] = $respDDLs;
        $responseArray["rows"] = $rowsCount;
        if (count($result)) {
            $responseArray["data"] = $result;
            // output data of each row
            if(sizeof($responseArray["key"]) == 0) {
                $responseArray["key"] = array_keys((array)$result[0]);

                $key_settings = DB::table('tb_settings as ts')
                    ->join('tb', 'tb.id', '=', 'ts.tb_id')
                    ->select('ts.*')
                    ->where('tb.db_tb', '=', $tableName)
                    ->get();
                foreach ($key_settings as $setting) {
                    $responseArray["key_settings"][$setting->field] = $setting;
                }
            }
        } else {
            $data = (array) DB::table($tableName)->first();
            $data = array_fill_keys(array_keys($data), null);
            array_push($responseArray["data"],$data);
            $responseArray["error"] = TRUE;
            $responseArray["msg"] = "No Data";
        }

        return $responseArray;
    }
}