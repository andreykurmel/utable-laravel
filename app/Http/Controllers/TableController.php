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
}
