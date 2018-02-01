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
            $sql->where(function ($query, $fields) {
                foreach ($fields as $field => $val) {
                    $query->orWhere($field, 'LIKE', "%".$query['searchKeyword']."%");
                }
            });
        }

        if (!empty($filterData)) {
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

        $rowsCount = $sql->count();
        if ($count) {
            $sql->offset($page*$count)->limit($count);
        }
        $result = $sql->get();

        //filters data
        $respFilters = [];
        $respDDLs = [];
        if (isset($post->getfilters)) {
            $selected_filters = DB::table('tb_settings')
                ->join('tb', 'tb.id', '=', 'tb_settings.tb_id')
                ->select('tb_settings.field as field', 'tb_settings.name as name')
                ->where('tb.db_tb', '=', $tableName)
                ->where('tb_settings.filter', '=', 'Yes')
                ->get();
            foreach ($selected_filters as $sf) {
                $datas = DB::table($tableName)
                    ->select($sf->field." as value")
                    ->selectRaw("true as checked")
                    ->distinct()->first();
                $respFilters[] = [
                    'key' => $sf->field,
                    'name' => $sf->name,
                    'val' => $datas ? $datas : [],
                    'checkAll' => true
                ];
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
        if ($result) {
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