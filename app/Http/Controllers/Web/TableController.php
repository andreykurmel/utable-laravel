<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
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

        $tb_settings_display = DB::connection('mysql_data')->table('tb_settings_display')->get();

        $ddl = DB::connection('mysql_data')->table('tb')
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

        $id = DB::connection('mysql_data')->table($tableName)->insert($params);

        if ($id) {
            $responseArray['error'] = FALSE;
            $responseArray['last_id'] = DB::connection('mysql_data')->getPdo()->lastInsertId();
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
            if (strpos($key, '/') !== false) {
                unset($params[$key]);
            }
        }
        $params['modifiedBy'] = Auth::user()->id;
        $params['modifiedOn'] = now();

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

    public function loadFilter(Request $request) {
        $filter_vals = DB::connection('mysql_data')->table($request->tableName)
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

    public function favouriteToggle(Request $request) {
        if (Auth::user()) {
            $table_id = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->select('id')->first();
            //if need to activate favourite -> then add row into 'rights' table
            if ($request->status == "Active") {
                //add row only if it doesn`t exist
                if (!DB::connection('mysql_data')
                    ->table('rights')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_id->id)
                    ->count()
                ) {
                    DB::connection('mysql_data')
                        ->table('rights')
                        ->insert([
                            'user_id' => Auth::user()->id,
                            'table_id' => $table_id->id
                        ]);
                }
            //if need to inactive favourite -> then delete from 'rights' table
            } else {
                DB::connection('mysql_data')->table('rights')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_id->id)
                    ->delete();
            }
        }
    }

    public function favouriteToggleRow(Request $request) {
        if (Auth::user()) {
            $table_id = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->select('id')->first();
            //if need to activate favourite -> then add row into 'favorite' table
            if ($request->status == "Active") {
                //add row only if it doesn`t exist
                if (!DB::connection('mysql_data')
                    ->table('favorite')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('table_id', '=', $table_id->id)
                    ->where('row_id', '=', $request->row_id)
                    ->count()
                ) {
                    DB::connection('mysql_data')
                        ->table('favorite')
                        ->insert([
                            'user_id' => Auth::user()->id,
                            'table_id' => $table_id->id,
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
                    ->where('table_id', '=', $table_id->id)
                    ->where('row_id', '=', $request->row_id)
                    ->delete();
            }
        }
    }

    public function getDDLdatas(Request $request)
    {
        $DDLdatas = [];
        if (Auth::user()) {
            $DDLdatas['DDL_hdr'] = $this->tableService->getHeaders('ddl');
            $DDLdatas['DDL_items_hdr'] = $this->tableService->getHeaders('ddl_items');
            $DDLdatas['table_meta'] = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $DDLdatas['data'] = DB::connection('mysql_data')
                ->table('ddl')
                ->join('tb', 'tb.id', '=', 'ddl.tb_id')
                ->where('tb.db_tb', '=', $request->tableName)
                ->select('ddl.*')
                ->get();

            foreach ($DDLdatas['data'] as &$DDL) {
                $DDL->items = DB::connection('mysql_data')
                    ->table('ddl_items')
                    ->where('list_id', '=', $DDL->id)
                    ->whereNotNull('option')
                    ->get();
            }
        }
        return $DDLdatas;
    }

    public function getRightsDatas(Request $request)
    {
        $Rightsdatas = [];
        if (Auth::user()) {
            $Rightsdatas['Rights_hdr'] = $this->tableService->getHeaders('rights');
            $Rightsdatas['Rights_Fields_hdr'] = $this->tableService->getHeaders('rights_fields');
            $Rightsdatas['table_meta'] = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $usrs = DB::table('users')->get();
            foreach ($usrs as $usr) {
                $Rightsdatas['users_names'][$usr->id] = $usr->first_name ? $usr->first_name." ".$usr->last_name : $usr->username;
            }

            $Rightsdatas['data'] = DB::connection('mysql_data')
                ->table('rights')
                ->join('tb', 'tb.id', '=', 'rights.table_id')
                ->where('tb.db_tb', '=', $request->tableName)
                ->select('rights.*')
                ->get();

            foreach ($Rightsdatas['data'] as &$Rights) {
                $Rights->fields = DB::connection('mysql_data')
                    ->table('rights_fields')
                    ->where('rights_id', '=', $Rights->id)
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

            $res = DB::connection('mysql_data')->table('rights_fields')->where('id', '=', $id)->update($params);

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

            if ($request->tableName == 'rights') {
                DB::connection('mysql_data')->table('rights')->insert($params);

                $id = DB::connection('mysql_data')->getPdo()->lastInsertId();

                $rights_fields = DB::connection('mysql_data')
                    ->table('tb_settings_display')
                    ->where('tb_id', '=', $request->table_id)
                    ->get();

                foreach ($rights_fields as $rf) {
                    DB::connection('mysql_data')->table('rights_fields')->insert([
                        'rights_id' => $id,
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
            }
            if ($request->tableName == 'rights_fields') {
                $id = DB::connection('mysql_data')->table('rights_fields')->insert($params);
            }

            if ($id) {
                $responseArray['error'] = FALSE;
                $responseArray['last_id'] = DB::connection('mysql_data')->getPdo()->lastInsertId();
                $responseArray['msg'] = "Data Inserted Successfully";

            } else {
                $responseArray['error'] = TRUE;
                $responseArray['msg'] =  "Server Error";
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

            if ($request->tableName == 'rights') {
                $res = DB::connection('mysql_data')->table('rights')->where('id', '=', $id)->delete();
                $res = DB::connection('mysql_data')->table('rights_fields')->where('rights_id', '=', $id)->delete();
            }
            if ($request->tableName == 'rights_fields') {
                $res = DB::connection('mysql_data')->table('rights_fields')->where('id', '=', $id)->delete();
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
            $res = DB::connection('mysql_data')->table('rights_fields')->where('rights_id', '=', $request->right_id)->update([
                'view' => $request->r_status,
                'edit' => $request->r_status
            ]);

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
            ->select('id', 'username as text')
            ->limit(5)->get();
        return ['results' => $users];
    }

    public function getFavoritesForTable(Request $request)
    {
        if (Auth::user()) {
            $page = isset($request->p) ? (int)$request->p : 0;
            $count = isset($request->c) ? (int)$request->c : 0;

            $table_meta = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $headers = $this->tableService->getHeaders($request->tableName);

            $rows = DB::connection('mysql_data')
                ->table($request->tableName.' as mt')
                ->join('favorite as f', 'mt.id', '=', 'f.row_id')
                ->where('f.user_id', '=', Auth::user()->id)
                ->where('f.table_id', '=', $table_meta->id)
                ->select('mt.*');

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
            $table_meta = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $request->tableName)->first();

            $orders = DB::connection('mysql_data')
                ->table('orders')
                ->where('user_id', '=', Auth::user()->id)
                ->where('table_id', '=', $table_meta->id)
                ->orderBy('order')
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
                DB::connection('mysql_data')
                    ->table('orders')
                    ->where('id', '=', $orders[$i]->id)
                    ->update([ 'order' => $i+1 ]);
            }

            return ['status' => 'success'];
        } else {
            return [];
        }
    }

    public function createTable(Request $request)
    {
        $columns = $request->columns;
        $filename = $request->filename;

        //create table
        try {
            Schema::connection('mysql_data')->create($filename, function (Blueprint $table) use ($columns) {
                $table->increments('id');

                foreach ($columns as $col) {
                    if ($col['type'] == 'date') {
                        $t = $table->string($col['field'], $col['size'] > 0 ? $col['field'] : 255);
                    } elseif ($col['type'] == 'str') {
                        $t = $table->dateTime($col['field']);
                    } else {
                        $t = $table->integer($col['field']);
                    }

                    if (empty($col['required'])) {
                        $t->nullable();
                    }

                    if (!empty($col['default'])) {
                        $t->default($col['default']);
                    }
                }

                $table->integer('createdBy')->nullable();
                $table->dateTime('createdOn')->nullable();
                $table->integer('modifiedBy')->nullable();
                $table->dateTime('modifiedOn')->nullable();
            });
        } catch (\Exception $e) {
            return "Seems that your table schema is incorrect!<br>".$e->getMessage();
        }

        DB::connection('mysql_data')->table('tb')->insert([
            'name' => $filename,
            'owner' => Auth::user()->id,
            'access' => 'private',
            'group_id' => '',
            'nbr_entry_listing' => 20,
            'source' => 'mysql',
            'db_tb' => $filename,
            'host' => env('DB_HOST', 'localhost'),
            'db' => env('DB_DATABASE', 'utable_admin'),
            'user' => env('DB_USERNAME', 'root'),
            'pwd' => env('DB_PASSWORD', ''),
            'createdBy' => Auth::user()->id,
            'createdOn' => now(),
            'modifiedBy' => Auth::user()->id,
            'modifiedOn' => now()
        ]);
        $tb_id = DB::connection('mysql_data')->getPdo()->lastInsertId();

        foreach ($columns as $col) {
            DB::connection('mysql_data')->table('tb_settings_display')->insert([
                'tb_id' => $tb_id,
                'field' => $col['field'],
                'name' => $col['header'],
                'web' => 'Yes',
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

        $fileHandle = fopen(storage_path("app/csv/".$request->data_csv), 'r');
        $first = true;
        while (($data = fgetcsv($fileHandle)) !== FALSE) {
            if ($first) {
                $first = false;
                if ($request->with_headers) {
                    continue;
                }
            }

            $insert = [];
            foreach ($data as $idx => $val) {
                $insert[ $columns[$idx]['field'] ] = $val;
            }
            $insert['createdBy'] = Auth::user()->id;
            $insert['createdOn'] = now();
            $insert['modifiedBy'] = Auth::user()->id;
            $insert['modifiedOn'] = now();
            DB::connection('mysql_data')->table($filename)->insert($insert);
        }

        return redirect()->to( route('homepage')."/".$filename );
    }
}
