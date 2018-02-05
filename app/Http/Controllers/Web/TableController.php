<?php

namespace Vanguard\Http\Controllers\Web;

use Vanguard\Http\Controllers\Controller;
use Vanguard\Services\TableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    private $tableService;

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
    }

    public function getUTable() {
        /*$post = [
            'tableName' => 'st',
            'c' => 10,
            'changedFilter' => '{"name":"site_name","val":"Ozark","status":false}',
            'fields' => '{"id":1,"site_name":"Phenix City","site_id":"AL-01","site_div":null,"street":null,"city":null,"county":"Russell","state":"AL","zipcode":"n/a","lat_dec":"32","lat_dms":null,"lat_deg":null,"lat_min":null,"lat_sec":null,"long_dec":"-85.002222","long_dms":null,"long_deg":null,"long_min":null,"long_sec":null,"first_name":null,"last_name":null,"phone":null,"email":null,"str_type":null,"str_id":null,"twr_type":null,"elev_grd":"340","height":null,"agl":"479","amsl":"819","bta_nbr":null,"bta_name":null,"mta_nbr":null,"mta_name":null,"fcc_nbr":"1037006","faa_nbr":"1994-ASO-2485-OE","fa_nbr":null,"status":null,"createdBy":null,"createdOn":"2017-12-15 09:23:56","modifiedBy":null,"modifiedOn":"2017-12-15 09:23:56"}',
            'filterData' => '[{"key":"site_name","name":"Name","val":[{"value":"Phenix City","checked":1,"$$hashKey":"object:4229"},{"value":"Ozark","checked":false,"$$hashKey":"object:4230"},{"value":"Frost","checked":1,"$$hashKey":"object:4231"},{"value":"Titus","checked":1,"$$hashKey":"object:4232"},{"value":"Montgomery","checked":1,"$$hashKey":"object:4233"},{"value":"Waterloo SE","checked":1,"$$hashKey":"object:4234"},{"value":"Ethelsville","checked":1,"$$hashKey":"object:4235"},{"value":"Phenix City 1","checked":1,"$$hashKey":"object:4236"},{"value":"Phenix City 2 ","checked":1,"$$hashKey":"object:4237"},{"value":"Pine Apple","checked":1,"$$hashKey":"object:4238"}],"checkAll":false,"$$hashKey":"object:273"},{"key":"site_id","name":"ID","val":[{"value":"AL-01","checked":1,"$$hashKey":"object:4249"},{"value":"AL-02","checked":1,"$$hashKey":"object:4250"},{"value":"AL-03","checked":1,"$$hashKey":"object:4251"},{"value":"AL-04","checked":1,"$$hashKey":"object:4252"},{"value":"AL-05","checked":1,"$$hashKey":"object:4253"},{"value":"AL-06","checked":1,"$$hashKey":"object:4254"},{"value":"AL-07","checked":1,"$$hashKey":"object:4255"},{"value":"AL-08","checked":1,"$$hashKey":"object:4256"},{"value":"AL-09","checked":1,"$$hashKey":"object:4257"},{"value":"AL-10","checked":1,"$$hashKey":"object:4258"}],"checkAll":true,"$$hashKey":"object:274"}]',
            'getfilters' => true,
            'p' => 0,
            'q' => '{"opt":"lat","lat_dec":"","long_dec":"","distance":""}'
        ];
        $this->tableService->getData((object)$post);*/
        
        $tb = DB::connection('mysql_data')->table('tb')->get();
        $tb_settings = DB::connection('mysql_data')->table('tb_settings')->get();
        $ddl = DB::connection('mysql_data')->table('tb')
            ->join('tb_settings as ts', 'tb.id', '=', 'ts.tb_id')
            ->join('ddl_items as di', 'ts.ddl_id', '=', 'di.list_id')
            ->select('ts.field', 'di.option')
            ->whereNotNull('di.option')
            ->where('tb.db_tb', '=', 'tb_settings')
            ->get();

        if ($tb && $tb_settings) {
            $responseArray["utables"] = $tb;
            $responseArray["utablesettings"] = $tb_settings;
            $responseArray["ddls"] = array();
            foreach($ddl as $row) {
                $responseArray["ddls"][$row->field][] = $row->option;
            }
        } else {
            $responseArray["error"] = TRUE;
            $responseArray["msg"] = "No Data";
        }

        return $responseArray;
    }

    public function getSelectedTable(Request $request) {
        return $this->tableService->getData($request);
    }

    public function addTableRow(Request $request) {
        $tableName= $request->tableName;

        $params = $request->except(['id', 'tableName']);
        foreach ($params as $key => $par) {
            if (strpos('/', $key) !== false) {
                unset($params[$key]);
            }
        }

        $id = DB::connection('mysql_data')->table($tableName)->insert($params);

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['last_id'] = $id;
            $responseArray['msg'] = "Data Inserted Successfully";

        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function updateTableRow(Request $request) {
        $id = $request->id;
        $tableName= $request->tableName;

        $params = $request->except(['id', 'tableName']);
        foreach ($params as $key => $par) {
            if (strpos('/', $key) !== false) {
                unset($params[$key]);
            }
        }

        $res = DB::connection('mysql_data')->table($tableName)->where('id', '=', $id)->update($params);

        if ($res) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = "Data Updated Successfully";

        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function deleteTableRow(Request $request) {
        $id = $request->id;
        $tableName= $request->tableName;

        $res = DB::connection('mysql_data')->table($tableName)->where('id', '=', $id)->delete();

        if ($res) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = 'Deleted Successfully';

        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }
}
