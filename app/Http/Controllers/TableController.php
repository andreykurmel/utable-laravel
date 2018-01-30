<?php

namespace App\Http\Controllers;

use App\Services\TableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    private $tableService;

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
    }

    public function getUTable() {
        $tb = DB::table('tb')->get();
        $tb_settings = DB::table('tb_settings')->get();
        $ddl = DB::table('tb')
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
        return $this->tableService->getData($request->tableName, $request);
    }

    public function addTableRow(Request $request) {
        $tableName= $request->tableName;

        $params = $request->except(['id', 'tableName']);

        $id = DB::table($tableName)->insert($params);

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

        $res = DB::table($tableName)->where('id', '=', $id)->update($params);

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

        $res = DB::table($tableName)->where('id', '=', $id)->delete();

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
