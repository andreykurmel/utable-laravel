<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Vanguard\Http\Controllers\Controller;
use Vanguard\Services\TableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    private $tableService;
    private $system_fields;

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
        $this->system_fields = ['id','refer_tb_id','createdBy','createdOn','modifiedBy','modifiedOn'];
    }

    public function getUTable(Request $request) {
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

        $tb_settings_display = DB::connection('mysql_sys')->table('tb_settings_display')->get();

        $ddl = DB::connection('mysql_sys')->table('tb')
            ->join('tb_settings_display as ts', 'tb.id', '=', 'ts.tb_id')
            ->join('ddl_items as di', 'ts.ddl_id', '=', 'di.list_id')
            ->select('ts.field', 'di.option')
            ->whereNotNull('di.option')
            ->where('tb.db_tb', '=', 'tb_settings_display')
            ->get();

        if (/*$tb && */$tb_settings_display) {
            //$responseArray["utables"] = $tb;
            $responseArray["utablesettings"] = $tb_settings_display;
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
            if (strpos($key,'/') !== false) {
                unset($params[$key]);
            }
        }
        $params['createdBy'] = Auth::user()->id;
        $params['createdOn'] = now();
        $params['modifiedBy'] = Auth::user()->id;
        $params['modifiedOn'] = now();

        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        $mysql_conn = $table_meta->is_system ? 'mysql_sys' : 'mysql_data';
        if ($table_meta->source == 'remote') {
            $this->tableService->setRemoteConnection($table_meta->conn_id);
        }
        $id = DB::connection($mysql_conn)->table($tableName)->insert($params);

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['last_id'] = DB::connection($mysql_conn)->getPdo()->lastInsertId();
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
            if (strpos($key, '/') !== false || $par == 'null') {
                unset($params[$key]);
            }
        }
        $params['modifiedBy'] = Auth::user()->id;
        $params['modifiedOn'] = now();

        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        $mysql_conn = $table_meta->is_system ? 'mysql_sys' : 'mysql_data';
        if ($table_meta->source == 'remote') {
            $this->tableService->setRemoteConnection($table_meta->conn_id);
        }
        $res = DB::connection($mysql_conn)->table($tableName)->where('id', '=', $id)->update($params);

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

        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        $mysql_conn = $table_meta->is_system ? 'mysql_sys' : 'mysql_data';
        if ($table_meta->source == 'remote') {
            $this->tableService->setRemoteConnection($table_meta->conn_id);
        }
        $res = DB::connection($mysql_conn)->table($tableName)->where('id', '=', $id)->delete();

        if ($res) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = 'Deleted Successfully';

        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function loadFilter(Request $request) {
        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();
        $mysql_conn = $table_meta->is_system ? 'mysql_sys' : 'mysql_data';
        if ($table_meta->source == 'remote') {
            $this->tableService->setRemoteConnection($table_meta->conn_id);
        }
        $filter_vals = DB::connection($mysql_conn)->table($request->tableName)
            ->select($request->field." as value")
            ->selectRaw("true as checked")
            ->distinct()->get();

        return [
            'key' => $request->field,
            'name' => $request->name,
            'val' => $filter_vals ? $filter_vals : [],
            'checkAll' => true
        ];
    }

    public function favoriteToggleTable(Request $request) {
        if (Auth::user()) {
            $table_id = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->select('id')->first();
            //if need to activate favourite -> then add row into 'favorite' table
            if ($request->status == "Active") {
                DB::connection('mysql_sys')
                    ->table('menutree_2_tb')
                    ->insert([
                        'user_id' => Auth::user()->id,
                        'tb_id' => $table_id->id,
                        'menutree_id' => 0,
                        'type' => 'link',
                        'structure' => 'favorite',
                        'createdBy' => Auth::user()->id,
                        'createdOn' => now(),
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
            //if need to inactive favourite -> then delete from 'favorite' table
            } else {
                DB::connection('mysql_sys')
                    ->table('favorite_tables')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_id->id)
                    ->where('menutree_id', '=', 0)
                    ->where('structure', '=', 'favorite')
                    ->delete();
            }
        }
    }

    public function favoriteToggleRow(Request $request) {
        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();
        if (Auth::user() && $table_meta->source != 'remote') {
            //if need to activate favourite -> then add row into 'favorite' table
            if ($request->status == "Active") {
                //add row only if it doesn`t exist
                if (!DB::connection('mysql_data')
                    ->table('favorite')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_meta->id)
                    ->where('row_id', '=', $request->row_id)
                    ->count()
                ) {
                    DB::connection('mysql_data')
                        ->table('favorite')
                        ->insert([
                            'user_id' => Auth::user()->id,
                            'table_id' => $table_meta->id,
                            'row_id' => $request->row_id,
                            'createdBy' => Auth::user()->id,
                            'createdOn' => now(),
                            'modifiedBy' => Auth::user()->id,
                            'modifiedOn' => now()
                        ]);
                }
            //if need to inactive favourite -> then delete from 'favorite' table
            } else {
                DB::connection('mysql_data')
                    ->table('favorite')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_meta->id)
                    ->where('row_id', '=', $request->row_id)
                    ->delete();
            }
        }
    }

    public function showHideColumnToggle(Request $request) {
        if (Auth::user()) {
            $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            if (!DB::connection('mysql_sys')
                ->table('tb_settings_display')
                ->where('user_id', '=', Auth::user()->id)
                ->where('tb_id', '=', $table_meta->id)
                ->where('field', '=', $request->col_key)
                ->count()
            ) {
                DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->insert([
                        'user_id' => Auth::user()->id,
                        'tb_id' => $table_meta->id,
                        'field' => $request->col_key,
                        'showhide' => $request->status == "Show" ? 1 : 0,
                        'createdBy' => Auth::user()->id,
                        'createdOn' => now(),
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
            } else {
                DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('tb_id', '=', $table_meta->id)
                    ->where('field', '=', $request->col_key)
                    ->update([
                        'showhide' => $request->status == "Show" ? 1 : 0,
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
            }
        }
    }

    public function getDDLdatas(Request $request)
    {
        $DDLdatas = [];
        if (Auth::user()) {
            $DDLdatas['DDL_hdr'] = $this->tableService->getHeaders('ddl');
            $DDLdatas['DDL_items_hdr'] = $this->tableService->getHeaders('ddl_items');
            $DDLdatas['table_meta'] = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $DDLdatas['data'] = DB::connection('mysql_sys')
                ->table('ddl')
                ->join('tb', 'tb.id', '=', 'ddl.tb_id')
                ->where('tb.db_tb', '=', $request->tableName)
                ->select('ddl.*')
                ->get();

            $DDLdatas['cdtns_headers'] = $this->tableService->getHeaders('cdtns');

            foreach ($DDLdatas['data'] as &$DDL) {
                $DDL->items = DB::connection('mysql_sys')
                    ->table('ddl_items')
                    ->where('list_id', '=', $DDL->id)
                    ->whereNotNull('option')
                    ->get();

                $DDL->referencing = DB::connection('mysql_sys')
                    ->table('cdtns')
                    ->where('ddl_id', '=', $DDL->id)
                    ->get();
            }
        }
        return $DDLdatas;
    }

    public function getRightsDatas(Request $request)
    {
        $Rightsdatas = [];
        if (Auth::user()) {
            $Rightsdatas['Rights_hdr'] = $this->tableService->getHeaders('permissions');
            $Rightsdatas['Rights_Fields_hdr'] = $this->tableService->getHeaders('permissions_fields');
            $Rightsdatas['table_meta'] = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $usrs = DB::table('users')->get();
            foreach ($usrs as $usr) {
                $Rightsdatas['users_names'][$usr->id] = $usr->first_name ? $usr->first_name." ".$usr->last_name : $usr->username;
            }

            $Rightsdatas['data'] = DB::connection('mysql_sys')
                ->table('permissions')
                ->join('tb', 'tb.id', '=', 'permissions.table_id')
                ->where('tb.db_tb', '=', $request->tableName)
                ->select('permissions.*')
                ->get();

            foreach ($Rightsdatas['data'] as &$Rights) {
                $Rights->fields = DB::connection('mysql_sys')
                    ->table('permissions_fields')
                    ->where('permissions_id', '=', $Rights->id)
                    ->get();
            }
        }
        return $Rightsdatas;
    }

    public function updateRightsDatas(Request $request) {
        if (Auth::user()) {
            $id = $request->id;

            $params[$request->fieldname] = $request->val;
            $params['modifiedBy'] = Auth::user()->id;
            $params['modifiedOn'] = now();

            $res = DB::connection('mysql_sys')->table('permissions_fields')->where('id', '=', $id)->update($params);

            if ($res) {
                $responseArray['error'] = FALSE;
                $responseArray['msg'] = "Data Updated Successfully";

            } else {
                $responseArray['error'] = TRUE;
                $responseArray['msg'] =  "Server Error";
            }
            return $responseArray;
        }
    }

    public function addRightsDatas(Request $request)
    {
        if (Auth::user()) {
            $tableName= $request->tableName;

            $res = $this->tableService->addRight($request->tableName, [
                'user_id' => $request->user_id,
                'table_id' => $request->table_id,
                'permissions_id' => $request->permissions_id,
                'field' => $request->field,
                'view' => $request->view,
                'edit' => $request->edit,
                'notes' => $request->notes,
            ]);

            if ($res['status'] != 'present') {
                $responseArray['error'] = FALSE;
                $responseArray['last_id'] = $res['id'];
                $responseArray['msg'] = "Data Inserted Successfully";

            } else {
                $responseArray['error'] = TRUE;
                $responseArray['msg'] =  "Data Already Present";
            }
            return $responseArray;
        }
        return [];
    }

    public function deleteRightsDatas(Request $request)
    {
        if (Auth::user()) {
            $id = $request->id;
            $tableName= $request->tableName;

            if ($request->tableName == 'permissions') {
                $res = DB::connection('mysql_sys')->table('permissions')->where('id', '=', $id)->delete();
                $res = DB::connection('mysql_sys')->table('permissions_fields')->where('permissions_id', '=', $id)->delete();
            }
            if ($request->tableName == 'permissions_fields') {
                $res = DB::connection('mysql_sys')->table('permissions_fields')->where('id', '=', $id)->delete();
            }

            if ($res) {
                $responseArray['error'] = FALSE;
                $responseArray['msg'] = 'Deleted Successfully';

            } else {
                $responseArray['error'] = TRUE;
                $responseArray['msg'] =  "Server Error";
            }
            return $responseArray;
        }
        return [];
    }

    public function toggleAllrights(Request $request)
    {
        if (Auth::user()) {
            $arr = [];
            if ($request->type == 'all' || $request->type == 'view') {
                $arr['view'] = $request->r_status;
            }
            if ($request->type == 'all' || $request->type == 'edit') {
                $arr['edit'] = $request->r_status;
            }

            $res = DB::connection('mysql_sys')->table('permissions_fields')->where('permissions_id', '=', $request->permissions_id)->update($arr);

            if ($res) {
                $responseArray['error'] = FALSE;
                $responseArray['msg'] = 'Updated Successfully';

            } else {
                $responseArray['error'] = TRUE;
                $responseArray['msg'] =  "Server Error";
            }
            return $responseArray;
        }
        return [];
    }

    public function ajaxSearchUser(Request $request)
    {
        $users = DB::table('users')
            ->where('username', 'LIKE', $request->q.'%')
            ->orWhere('email', 'LIKE', $request->q.'%')
            ->orWhere('first_name', 'LIKE', $request->q.'%')
            ->orWhere('last_name', 'LIKE', $request->q.'%')
            ->limit(5)->get();
        $res = [];
        foreach ($users as $usr) {
            $res[] = [
                'id' => $usr->id,
                'text' => $usr->first_name ? $usr->first_name." ".$usr->last_name : $usr->username
            ];
        }
        return ['results' => $res];
    }

    public function getFavoritesForTable(Request $request)
    {
        $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();
        if (Auth::user() && $table_meta->source != 'remote') {
            $page = isset($request->p) ? (int)$request->p : 0;
            $count = isset($request->c) ? (int)$request->c : 0;

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
                        ->table('permissions as r')
                        ->join('permissions_fields as rf', 'r.id', '=', 'rf.permissions_id')
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
            }

            $headers = $this->tableService->getHeaders($request->tableName, $fields_for_select);

            $rows = DB::connection('mysql_data')
                ->table($request->tableName.' as mt')
                ->join('favorite as f', 'mt.id', '=', 'f.row_id')
                ->where('f.user_id', '=', Auth::user()->id)
                ->where('f.table_id', '=', $table_meta->id);

            //if user isn`t admin or owner -> then select only accessible fields
            if ($fields_for_select && $fields_for_select !== 1) {
                $select_cls = [];
                foreach ($fields_for_select as $key => $fld) {
                    $select_cls[] = "mt.".$key;
                }
                $rows->select($select_cls);
            } else {
                $rows->select('mt.*');
            }

            $rowsCount = $rows->count();
            if ($count) {
                $rows->offset($page*$count)->limit($count);
            }
            $rows = $rows->get();

            return [
                'rows' => $rowsCount,
                'data' => $rows,
                'headers' => $headers
            ];
        } else {
            return [
                'headers' => $this->tableService->getHeaders($request->tableName)
            ];
        }
    }

    public function changeOrder(Request $request)
    {
        if (Auth::user()) {
            $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $orders = DB::connection('mysql_sys')
                ->table('tb_settings_display')
                ->where('user_id', '=', Auth::user()->id)
                ->where('tb_id', '=', $table_meta->id)
                ->orderBy('order')
                ->orderBy('id')
                ->get();

            //set selected column before target column
            $reoderedArr = [];
            for ($i = 0; $i < count($orders); $i++) {
                if ($i == $request->target) {
                    $reoderedArr[] = ($orders[$request->select]);
                    $reoderedArr[] = ($orders[$i]);
                } else
                    if ($i != $request->select) {
                        $reoderedArr[] = ($orders[$i]);
                    }
            }
            $orders = $reoderedArr;

            for ($i = 0; $i < count($orders); $i++) {
                DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->where('id', '=', $orders[$i]->id)
                    ->update([ 'order' => $i+1 ]);
            }

            return ['status' => 'success'];
        } else {
            return [];
        }
    }

    public function changeSettingsRowOrder(Request $request)
    {
        if (Auth::user()) {
            $table_meta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            //if user don`t have correct order in 'tb_settings_display.sql' for current table -> repair
            $columnsCnt = DB::connection('mysql_sys')
                ->table('tb_settings_display')
                ->where('user_id', '=', Auth::user()->id)
                ->where('tb_id', '=', $table_meta->id)
                ->groupBy('rows_ord')
                ->get();

            $settingsCnt = DB::connection('mysql_sys')
                ->table('tb_settings_display')
                ->where('user_id', '=', Auth::user()->id)
                ->where('tb_id', '=', $table_meta->id)
                ->orderBy('rows_ord')
                ->orderBy('id');

            if (count($columnsCnt) != $settingsCnt->count()) {
                $settingsCnt = $settingsCnt->get();
                for ($i = 0; $i < count($settingsCnt); $i++) {
                    DB::connection('mysql_sys')->table('tb_settings_display')->where('id', '=', $settingsCnt[$i]->id)->update([
                        'rows_ord' => $i,
                    ]);
                }
            }

            $rows = DB::connection('mysql_sys')
                ->table('tb_settings_display')
                ->where('user_id', '=', Auth::user()->id)
                ->where('tb_id', '=', $table_meta->id)
                ->orderBy('rows_ord')
                ->orderBy('id')
                ->get();

            //set selected column before target column
            $reoderedArr = [];
            for ($i = 0; $i < count($rows); $i++) {
                if ($i == $request->target) {
                    $reoderedArr[] = ($rows[$request->select]);
                    $reoderedArr[] = ($rows[$i]);
                } else
                    if ($i != $request->select) {
                        $reoderedArr[] = ($rows[$i]);
                    }
            }
            $rows = $reoderedArr;

            for ($i = 0; $i < count($rows); $i++) {
                DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('id', '=', $rows[$i]->id)
                    ->update([ 'rows_ord' => $i+1 ]);
            }

            return ['status' => 'success'];
        } else {
            return [];
        }
    }

    public function createTableFromMenu(Request $request)
    {
        $columns = [
            ['field' => 'id', 'header' => 'ID', 'size' => 0],
            ['field' => 'createdBy', 'header' => 'Created By', 'size' => 0],
            ['field' => 'createdOn', 'header' => 'Created On', 'size' => 0],
            ['field' => 'modifiedBy', 'header' => 'Modified By', 'size' => 0],
            ['field' => 'modifiedOn', 'header' => 'Modified On', 'size' => 0]
        ];

        return $this->createTableColumns($request, $request->db_tb, $columns);
    }

    public function createTable(Request $request)
    {
        $columns = $request->columns;
        $filename = $request->table_db_tb;

        $this->createTableColumns($request, $filename, $columns);

        $tableMeta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $filename)->first();

        //import data
        if (($request->data_csv || $request->import_host) && $tableMeta->source != 'remote') {
            $this->importDataToTable($request, $filename, $columns);
        }

        return redirect()->to( "/data/".$filename );
    }

    public function replaceTable(Request $request) {
        if ($request->table_name) {
            $this->deleteAllTable($request->table_name);
        }
        return $this->createTable($request);
    }

    public function modifyTable(Request $request)
    {
        $columns = $request->columns;
        $filename = $request->table_db_tb;

        $tableMeta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $filename)->first();

        $this->modifyTableColumns($request, $tableMeta, $columns);

        //import data
        if (($request->data_csv || $request->import_host) && $tableMeta->source != 'remote') {
            $this->importDataToTable($request, $filename, $columns);
        }

        return redirect($_SERVER['HTTP_REFERER']);
    }

    public function remoteTable(Request $request) {
        $columns = $request->columns;
        $table_db = $request->import_table;
        $exist = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $table_db)->first();

        if (!$exist) {
            $this->createTableColumns($request, $table_db, $columns);
        } else {
            $this->modifyTableColumns($request, $exist, $columns);
        }

        return redirect()->to( "/data/".$table_db );
    }

    public function refTable(Request $request) {
        $tb_rfcn = json_decode($request->import_tb_rfcn);
        $columns = $request->columns;
        $table_db = $request->table_db_tb;
        $exist = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $table_db)->first();

        if ($exist && $exist->source != 'ref') {
            $this->deleteAllTable($table_db);
            $exist = false;
        }

        if (!$exist) {
            $this->createTableColumns($request, $table_db, $columns);

            $exist = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $table_db)->first();

            //add info into the 'tb_rfcn'
            foreach ($tb_rfcn as $tb) {
                foreach ($tb->items as $key => $item) {
                    if ($item && $tb->ref_tb) {
                        DB::connection('mysql_sys')->table('tb_rfcn')->insert([
                            'tb_id' => $exist->id,
                            'field' => $key,
                            'ref_tb' => $tb->ref_tb,
                            'ref_field' => $item,
                            'createdBy' => Auth::user()->id,
                            'createdOn' => now(),
                            'modifiedBy' => Auth::user()->id,
                            'modifiedOn' => now()
                        ]);
                    }
                }
            }
        } else {
            $this->modifyTableColumns($request, $exist, $columns);

            //modify info in the 'tb_rfcn'
            DB::connection('mysql_sys')->table('tb_rfcn')->where('tb_id', '=', $exist->id)->delete();
            foreach ($tb_rfcn as $tb) {
                foreach ($tb->items as $key => $item) {
                    if ($item && $tb->ref_tb) {
                        DB::connection('mysql_sys')->table('tb_rfcn')->insert([
                            'tb_id' => $exist->id,
                            'field' => $key,
                            'ref_tb' => $tb->ref_tb,
                            'ref_field' => $item,
                            'createdBy' => Auth::user()->id,
                            'createdOn' => now(),
                            'modifiedBy' => Auth::user()->id,
                            'modifiedOn' => now()
                        ]);
                    }
                }
            }
        }

        $this->importDataToTable($request, $table_db, $columns);

        return ($request->import_target_db ? 'Success!' : redirect()->to( "/data/".$table_db ) );
    }

    public function deleteTable(Request $request) {
        return $this->deleteAllTable($request->table_name);
    }

    private function deleteAllTable($table_name)
    {
        $tableMeta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $table_name)->first();

        if (!$tableMeta) {
            return "not found";
        }

        //delete table
        if ($tableMeta->source != 'remote') {
            Schema::connection('mysql_data')->table($table_name, function (Blueprint $table) {
                $table->drop();
            });
        }

        //delete record from the 'tb'
        DB::connection('mysql_sys')->table('tb')->where('id', '=', $tableMeta->id)->delete();

        //delete record from the 'tb_settings_display'
        DB::connection('mysql_sys')->table('tb_settings_display')->where('tb_id', '=', $tableMeta->id)->delete();

        //delete record from the 'ddl'
        DB::connection('mysql_sys')->table('ddl')->where('tb_id', '=', $tableMeta->id)->delete();

        //delete record from the folders and favorites ('menutree_2_tb')
        DB::connection('mysql_sys')->table('menutree_2_tb')->where('tb_id', '=', $tableMeta->id)->delete();

        //delete record from the 'permissions'
        DB::connection('mysql_sys')->table('permissions')->where('table_id', '=', $tableMeta->id)->delete();

        return "success";
    }

    private function importDataToTable($request, $filename, $columns) {
        if ($request->data_csv) {
            //CSV IMPORT
            $fileHandle = fopen(storage_path("app/csv/".$request->data_csv), 'r');
            $start = $end = $cur = 0;
            if ($request->csv_first_headers) { $start = 2; }
            if ($request->csv_second_fields) { $start = 3; }
            if ($request->csv_third_type) { $start = 4; }
            if ($request->csv_fourth_size) { $start = 5; }
            if ($request->csv_fifth_default) { $start = 6; }
            if ($request->csv_sixth_required) { $start = 7; }
            if ($request->csv_start_data) { $start = $request->csv_start_data > $start ? $request->csv_start_data : $start; }
            if ($request->csv_end_data) { $end = $request->csv_end_data; }
            while (($data = fgetcsv($fileHandle)) !== FALSE) {
                $cur++;
                if ($cur < $start || ($end && $cur > $end)) {
                    continue;
                }

                $insert = [];
                //fill only those data columns which numbers are setted in 'table columns settings'
                foreach ($columns as $idx => $col) {
                    if (!empty($col['col']) && !in_array($col['field'], $this->system_fields)) {
                        $insert[ $col['field'] ] = $data[ $col['col']-1 ];
                    }
                }
                $insert['createdBy'] = Auth::user()->id;
                $insert['createdOn'] = now();
                $insert['modifiedBy'] = Auth::user()->id;
                $insert['modifiedOn'] = now();
                DB::connection('mysql_data')->table($filename)->insert($insert);
            }
        } elseif ($request->import_host) {
            //MYSQL IMPORT
            Config::set('database.connections.mysql_import2.host', $request->import_host);
            Config::set('database.connections.mysql_import2.username', $request->import_lgn);
            Config::set('database.connections.mysql_import2.password', $request->import_pwd);
            Config::set('database.connections.mysql_import2.database', $request->import_db);

            try {
                $all_rows = DB::connection('mysql_import2')->table($request->import_table)->get();

                foreach ($all_rows as $row) {
                    $row = (array)$row;
                    $insert = [];

                    foreach ($columns as $col) {
                        if (!empty($col['col']) && !in_array($col['field'], $this->system_fields)) {
                            $insert[ $col['field'] ] = !empty($row[ $columns[ $col['col'] ]['field'] ]) ? $row[ $columns[ $col['col'] ]['field'] ] : null;
                        }
                    }

                    $insert['createdBy'] = Auth::user()->id;
                    $insert['createdOn'] = now();
                    $insert['modifiedBy'] = Auth::user()->id;
                    $insert['modifiedOn'] = now();
                    DB::connection('mysql_data')->table($filename)->insert($insert);
                }
            } catch (\Exception $e) {
                return false;
            }
        } elseif ($request->type_import == 'ref') {
            //REFERENCE IMPORT
            $tb_rfcn = json_decode($request->import_tb_rfcn);
            $tables_dbs = [];

            if ($request->import_target_db) {
                foreach ($tb_rfcn as $tb) {
                    if ($tb->ref_tb == $request->import_target_db) {
                        $tables_dbs = [$tb];
                    }
                }
            } else {
                $tables_dbs = $tb_rfcn;
            }

            foreach ($tables_dbs as $t_db) {
                $refer_tb_id = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $t_db->ref_tb)->first();

                /*$corresp_fields = [];
                foreach ($columns as $col) {
                    if ($col['ref_tb'] == $t_db->ref_tb && !in_array($col['field'], $this->system_fields)) {
                        $corresp_fields[ $col['field'] ] = $col['ref_field'];
                    }
                }*/

                //delete already present rows before import
                DB::connection('mysql_data')->table($filename)->where('refer_tb_id', '=', $refer_tb_id->id)->delete();

                if (!$request->import_target_db_should_del) {
                    //import rows from each referenced tables
                    $all_rows = DB::connection('mysql_data')->table($t_db->ref_tb)->get();
                    foreach ($all_rows as $row) {
                        $row = (array)$row;
                        $insert = [];

                        foreach ($t_db->items as $cur => $ref) {
                            $insert[ $cur ] = $row[ $ref ];
                        }

                        $insert['refer_tb_id'] = $refer_tb_id->id;
                        $insert['createdBy'] = Auth::user()->id;
                        $insert['createdOn'] = now();
                        $insert['modifiedBy'] = Auth::user()->id;
                        $insert['modifiedOn'] = now();
                        DB::connection('mysql_data')->table($filename)->insert($insert);
                    }
                }
            }
        }
        return true;
    }

    private function createTableColumns($request, $table_db, $columns) {
        if ($request->type_import == 'remote') {
            //add record to 'conn'
            DB::connection('mysql_sys')->table('conn')->insert([
                'user_id' => 0,
                'name' => $table_db,
                'server' => $request->import_host,
                'user' => $request->import_lgn,
                'pwd' => $request->import_pwd,
                'db' => $request->import_db,
                'table' => $request->import_table,
                'createdBy' => Auth::user()->id,
                'createdOn' => now(),
                'modifiedBy' => Auth::user()->id,
                'modifiedOn' => now()
            ]);
            $conn_id = DB::connection('mysql_sys')->getPdo()->lastInsertId();
        } else {
            //create table
            try {
                Schema::connection('mysql_data')->create($table_db, function (Blueprint $table) use ($columns, $request) {
                    $table->increments('id');
                    if ($request->type_import == 'ref') {
                        $table->integer('refer_tb_id')->default(0);
                    }

                    $presentCols = [];
                    foreach ($columns as &$col) {
                        if (empty($col['size'])) $col['size'] = 0;
                        $col_size = $col['size'] > 0 ? explode('.', $col['size']) : [];
                        if (!isset($col_size[0])) $col_size[0] = 9;
                        if (!isset($col_size[1])) $col_size[1] = 2;
                        if ($col['field'] && !in_array($col['field'], $this->system_fields)) {
                            //prevent error if we have two the same names for columns
                            if (in_array($col['field'], $presentCols)) {
                                continue;
                            }
                            $presentCols[] = $col['field'];

                            //add column
                            if ($col['type'] == 'String') {
                                $t = $table->string($col['field'], $col['size'] > 0 ? $col['size'] : 255);
                            } elseif ($col['type'] == 'Date') {
                                $t = $table->date($col['field']);
                            } elseif ($col['type'] == 'Date Time') {
                                $t = $table->dateTime($col['field']);
                            } elseif (in_array($col['type'], ['Decimal','Currency','Percentage'])) {
                                $t = $table->decimal($col['field'], $col_size[0], $col_size[1]);
                            } else {
                                $t = $table->integer($col['field'], $col['type'] == 'Auto Number' ? true : false);
                            }

                            if (empty($col['required'])) {
                                $t->nullable();
                            }

                            if (!empty($col['default'])) {
                                $t->default($col['default']);
                            }
                        }
                    }

                    $table->integer('createdBy')->nullable();
                    $table->dateTime('createdOn')->nullable();
                    $table->integer('modifiedBy')->nullable();
                    $table->dateTime('modifiedOn')->nullable();
                });
            } catch (\Exception $e) {dd($e);
                return [
                    'error' => true,
                    'msg' => "Seems that table with provided db_tb is exists!<br>".$e->getMessage()
                ];
            }
        }

        //add record to 'tb'
        DB::connection('mysql_sys')->table('tb')->insert([
            'name' => $request->type_import == 'remote' ? $request->table_name : $table_db,
            'owner' => Auth::user()->id,
            'nbr_entry_listing' => $request->nbr_entry_listing ? $request->nbr_entry_listing : 0,
            'notes' => $request->notes,
            'source' => $request->type_import ? $request->type_import : 'scratch',
            'conn_id' => isset($conn_id) ? $conn_id : 0,
            'db_tb' => $table_db,
            'createdBy' => Auth::user()->id,
            'createdOn' => now(),
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);
        $tb_id = DB::connection('mysql_sys')->getPdo()->lastInsertId();

        //add settings to 'tb_settings_display'
        foreach ($columns as $col) {
            if ($col['field']) {
                DB::connection('mysql_sys')->table('tb_settings_display')->insert([
                    'user_id' => Auth::user()->id,
                    'tb_id' => $tb_id,
                    'field' => $col['field'],
                    'name' => (!empty($col['header']) ? $col['header'] : $col['field']),
                    'web' => (in_array($col['field'], $this->system_fields) ? 'No' : 'Yes'),
                    'filter' => 'No',
                    'sum' => 'No',
                    'input_type' => 'Input',
                    'min_wth' => 0,
                    'max_wth' => 0,
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            }
        }

        //add table to  folder if defined ('menutree_2_tb')
        if ($request->menutree_id) {
            DB::connection('mysql_sys')->table('menutree_2_tb')->insert([
                'user_id' => Auth::user()->id,
                'tb_id' => $tb_id,
                'menutree_id' => $request->menutree_id,
                'type' => 'table',
                'structure' => 'private',
                'createdBy' => Auth::user()->id,
                'createdOn' => now(),
                'modifiedBy' => Auth::user()->id,
                'modifiedOn' => now()
            ]);
        }

        if ($request->type_import == 'remote') {
            //test that all needed for app working columns are exist $this->system_fields
            $this->tableService->setRemoteConnection($conn_id);
            try {
                Schema::connection('mysql_data')->table($table_db, function (Blueprint $table) { $table->increments('id'); });
            } catch (\Exception $e) {}
            try {
                Schema::connection('mysql_data')->table($table_db, function (Blueprint $table) { $table->integer('createdBy')->nullable(); });
            } catch (\Exception $e) {}
            try {
                Schema::connection('mysql_data')->table($table_db, function (Blueprint $table) { $table->dateTime('createdOn')->nullable(); });
            } catch (\Exception $e) {}
            try {
                Schema::connection('mysql_data')->table($table_db, function (Blueprint $table) { $table->integer('modifiedBy')->nullable(); });
            } catch (\Exception $e) {}
            try {
                Schema::connection('mysql_data')->table($table_db, function (Blueprint $table) { $table->dateTime('modifiedOn')->nullable(); });
            } catch (\Exception $e) {}
        }

        return [
            'error' => false,
            'msg' => config('app.url')."/data/".$table_db
        ];
    }

    private function modifyTableColumns($request, $table_meta, $columns) {
        if ($table_meta->source == 'remote') {
            $this->tableService->setRemoteConnection($table_meta->conn_id);
        }
        //modify table
        try {
            Schema::connection('mysql_data')->table($table_meta->db_tb, function (Blueprint $table) use ($columns) {
                foreach ($columns as $col) {
                    if (empty($col['size'])) $col['size'] = 0;
                    $col_size = $col['size'] > 0 ? explode('.', $col['size']) : [];
                    if (!isset($col_size[0])) $col_size[0] = 9;
                    if (!isset($col_size[1])) $col_size[1] = 2;

                    //for deleting columns
                    if ($col['stat'] == 'del' && $col['field'] && !in_array($col['field'], $this->system_fields)) {
                        //del column
                        $table->dropColumn($col['field']);
                    }

                    //for changing columns
                    if (($col['stat'] == '') && $col['field'] && $col['old_field'] && !in_array($col['field'], $this->system_fields)) {
                        //edit column
                        if ($col['field'] != $col['old_field']) {
                            $table->renameColumn($col['old_field'], $col['field'])->change();
                        } else {
                            if ($col['type'] == 'String') {
                                $t = $table->string($col['field'], $col['size'] > 0 ? $col['size'] : 255);
                            } elseif ($col['type'] == 'Date') {
                                $t = $table->date($col['field']);
                            } elseif ($col['type'] == 'Date Time') {
                                $t = $table->dateTime($col['field']);
                            } elseif (in_array($col['type'], ['Decimal','Currency','Percentage'])) {
                                $t = $table->decimal($col['field'], $col_size[0], $col_size[1]);
                            } else {
                                $t = $table->integer($col['field'], $col['type'] == 'Auto Number' ? true : false);
                            }

                            if (empty($col['required'])) {
                                $t->nullable();
                            }

                            if (!empty($col['default'])) {
                                $t->default($col['default']);
                            }
                            $t->change();
                        }
                    }

                    //for adding columns
                    if ($col['stat'] == 'add' && $col['field'] && !in_array($col['field'], $this->system_fields)) {
                        //add column
                        if ($col['type'] == 'String') {
                            $t = $table->string($col['field'], $col['size'] > 0 ? $col['size'] : 255);
                        } elseif ($col['type'] == 'Date') {
                            $t = $table->date($col['field']);
                        } elseif ($col['type'] == 'Date Time') {
                            $t = $table->dateTime($col['field']);
                        } elseif (in_array($col['type'], ['Decimal','Currency','Percentage'])) {
                            $t = $table->decimal($col['field'], $col_size[0], $col_size[1]);
                        } else {
                            $t = $table->integer($col['field'], $col['type'] == 'Auto Number' ? true : false);
                        }

                        if (empty($col['required'])) {
                            $t->nullable();
                        }

                        if (!empty($col['default'])) {
                            $t->default($col['default']);
                        }
                    }
                }
            });
        } catch (\Exception $e) {
            $error = "Seems that your table schema is incorrect!<br>".$e->getMessage();
        }

        //modify record in the 'tb'
        DB::connection('mysql_sys')->table('tb')->where('id', '=', $table_meta->id)->update([
            'name' => $request->table_name,
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);

        //add settings to 'tb_settings_display'
        foreach ($columns as $col) {
            //for deleting columns
            if ($col['stat'] == 'del' && $col['field'] && !in_array($col['field'], $this->system_fields)) {
                //del column
                DB::connection('mysql_sys')->table('tb_settings_display')
                    ->where('tb_id', '=', $table_meta->id)
                    ->where('field', '=', $col['field'])
                    ->delete();
            }
            //for editing columns
            if (($col['stat'] == '') && $col['field'] && $col['old_field'] && !in_array($col['field'], $this->system_fields)) {
                //edit column
                DB::connection('mysql_sys')->table('tb_settings_display')
                    ->where('tb_id', '=', $table_meta->id)
                    ->where('field', '=', $col['old_field'])
                    ->update([
                    'field' => $col['field'],
                    'name' => $col['header'],
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            }
            //for adding columns
            if ($col['stat'] == 'add' && $col['field'] && !in_array($col['field'], $this->system_fields)) {
                //add column
                if (!DB::connection('mysql_sys')->table('tb_settings_display')->where('tb_id','=',$table_meta->id)->where('field','=',$col['field'])->first()) {
                    DB::connection('mysql_sys')->table('tb_settings_display')->insert([
                        'user_id' => Auth::user()->id,
                        'tb_id' => $table_meta->id,
                        'field' => $col['field'],
                        'name' => $col['header'],
                        'web' => (in_array($col['field'], $this->system_fields) ? 'No' : 'Yes'),
                        'filter' => 'No',
                        'sum' => 'No',
                        'input_type' => 'Input',
                        'min_wth' => 0,
                        'max_wth' => 0,
                        'createdBy' => Auth::user()->id,
                        'createdOn' => now(),
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
                }
            }
        }

        return 'done';
    }

    public function menutree_addfolder(Request $request) {
        $id = DB::connection('mysql_sys')->table('menutree')->insert([
            'parent_id' => $request->parent_id,
            'title' => $request->text,
            'structure' => $request->from_tab,
            'user_id' => Auth::user()->id,
            'createdBy' => Auth::user()->id,
            'createdOn' => now(),
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['last_id'] = DB::connection('mysql_sys')->getPdo()->lastInsertId();
            $responseArray['msg'] = "Data Inserted Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function menutree_renamefolder(Request $request) {
        $id = DB::connection('mysql_sys')->table('menutree')->where('id', '=', $request->folder_id)->update([
            'title' => $request->text,
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = "Data Updated Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function menutree_deletefolder(Request $request) {
        $id = DB::connection('mysql_sys')->table('menutree')->where('id', '=', $request->folder_id)->delete();

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = "Data Deleted Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function menutree_movenode(Request $request) {
        if ($request->type == 'folder') {
            $id = DB::connection('mysql_sys')->table('menutree')->where('id', '=', $request->m2t_id)->update([
                'parent_id' => $request->menutree_id,
                'modifiedBy' => Auth::user()->id,
                'modifiedOn' => now()
            ]);
        } else {
            if ($request->m2t_id) {
                $id = DB::connection('mysql_sys')->table('menutree_2_tb')->where('id', '=', $request->m2t_id)->update([
                    'menutree_id' => $request->menutree_id,
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            } else {
                $id = DB::connection('mysql_sys')->table('menutree_2_tb')->insert([
                    'tb_id' => $request->tb_id,
                    'menutree_id' => $request->menutree_id,
                    'structure' => $request->tab,
                    'type' => $request->type,
                    'user_id' => Auth::user()->id,
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            }
        }

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = "Node Moved Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function menutree_createlink(Request $request) {
        $id = DB::connection('mysql_sys')->table('menutree_2_tb')->insert([
            'tb_id' => $request->tb_id,
            'menutree_id' => $request->menutree_id,
            'structure' => $request->tab,
            'type' => 'link',
            'user_id' => Auth::user()->id,
            'createdBy' => Auth::user()->id,
            'createdOn' => now(),
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);

        //add 'visitor' for table which was sent to the tab 'public'
        if ($request->tab == 'public') {
            $this->tableService->addRight('permissions', [
                'user_id' => 0,
                'table_id' => $request->tb_id
            ]);
        }

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['last_id'] = DB::connection('mysql_sys')->getPdo()->lastInsertId();
            $responseArray['msg'] = "Link Created Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function menutree_removelink(Request $request) {
        $id = DB::connection('mysql_sys')->table('menutree_2_tb')->where('id', '=', $request->m2t_id)->delete();

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['msg'] = "Data Deleted Successfully";
        } else {
            $responseArray['error'] = TRUE;
            $responseArray['msg'] =  "Server Error";
        }
        return $responseArray;
    }

    public function getRefDDL(Request $request) {
        $row = (array)json_decode($request->row);
        $req = json_decode($request->req);

        $refTb = $req[0]->ref_tb;
        $refField = $req[0]->ref_tb_field;
        $dictinct = $req[0]->sampleing == 'Distinctive' ? true : false;

        $data = DB::connection('mysql_data')->table($refTb);
        foreach ($req as $one_r) {
            $compare_val = ($one_r->compare_ref_val ? $one_r->compare_ref_val : $row[ $one_r->comp_tar_field ]);
            if ($one_r->logic_opr == 'OR') {
                $data->orWhere($one_r->comp_ref_field, ($one_r->compare ? $one_r->compare : '='), $compare_val);
            } else {
                $data->where($one_r->comp_ref_field, ($one_r->compare ? $one_r->compare : '='), $compare_val);
            }
        }
        if ($dictinct) {
            $data->distinct();
        }

        $data = $data->get([$refField]);
        $data_return = [];
        foreach ($data as $d) {
            $data_return[] = $d->$refField;
        }
        return $data_return;
    }

    public function getDistinctData(Request $request) {
        $field = $request->field;
        $data = DB::connection('mysql_data')->table($request->table)->distinct()->get([$field]);
        $data_return = [];
        foreach ($data as $d) {
            $data_return[] = $d->$field;
        }
        return $data_return;
    }
}
