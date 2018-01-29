<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class TableService {
    public function getData($tableName, $post) {
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
                ->where('tb_settings', '=', 'Yes')
                ->get();
            foreach ($selected_filters as $sf) {
                $datas = DB::table($tableName)
                    ->select($sf->field." as value", "true as checked")
                    ->distinct()->first();
                $respFilters[] = [
                    'key' => $sf->field,
                    'name' => $sf->name,
                    'val' => $datas ? $datas : [],
                    'checkAll' => true
                ];
            }
/*------------------------------------------------------*/
            $sql = "
            SELECT ts.field, di.option 
            FROM tb 
            INNER JOIN `tb_settings` as ts ON tb.id = ts.tb_id 
            INNER JOIN ddl_items as di ON ts.ddl_id = di.list_id 
            WHERE di.option IS NOT NULL AND tb.db_tb = '".$tableName."'";
            $ddl = $conn->query($sql);

            while($row = $ddl->fetch_assoc()) {
                $respDDLs[$row['field']][] = $row['option'];
            }
        }

        $responseArray["data"] = array();
        $responseArray["key"] = array();
        $responseArray["key_settings"] = array();
        $responseArray["filters"] = $respFilters;
        $responseArray["ddls"] = $respDDLs;
        $responseArray["rows"] = $rowsCount->fetch_assoc()['rows'];
        if ($result->num_rows > 0) {
            // output data of each row
            while($row = $result->fetch_assoc()) {
                if(sizeof($responseArray["key"]) == 0) {
                    $responseArray["key"] = array_keys($row);
                    $key_settings = $conn->query("SELECT ts.* FROM tb_settings as ts INNER JOIN tb ON tb.id = ts.tb_id WHERE tb.db_tb = '".$tableName."'");
                    while($setting = $key_settings->fetch_assoc()) {
                        $responseArray["key_settings"][$setting['field']] = $setting;
                    }
                }
                array_push($responseArray["data"],$row);
            }
        } else {
            $data = $conn->query("SELECT * FROM ". $tableName . " LIMIT 1");
            $row = $data->fetch_assoc();
            foreach ($row as $key => $val) {
                $row[$key] = null;
            }
            array_push($responseArray["data"],$row);
            $responseArray["error"] = TRUE;
            $responseArray["msg"] = "No Data";
        }

        return $responseArray;
    }
}