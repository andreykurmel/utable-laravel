<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class AppController extends Controller
{
    private $tableService;

    public function __construct(TableService $tb) {
        $this->tableService = $tb;
    }

    public function landing() {
        if (empty($_SERVER['HTTP_REFERER'])) {
            $_SERVER['HTTP_REFERER'] = "";
        }

        $subdomain = "";
        if( preg_match('/^www\.?(.+)\.tabledataplace\.com$/i', $_SERVER['HTTP_HOST'], $subdomain) ) {
            $subdomain = $subdomain[1];
        }
        if ($subdomain) {
            if ($this->tableExist($subdomain, NULL)) {
                return view('table', $this->getVariables($subdomain));
            } else {
                if (Auth::user()) {
                    return view('errors.404');
                } else {
                    return redirect()->to( route('login') );
                }
            }
        }

        if (Auth::guest() || ($_SERVER['HTTP_REFERER'] != config('app.url')."/")) {
            $socialProviders = config('auth.social.providers');
            return view('landing', compact('socialProviders'));
        } else {
            return redirect()->to( route('homepage') );
        }
    }

    public function homepage() {
        return view('table', $this->getVariables());
    }

    public function homepageTable($tableName) {
        if ($this->tableExist($tableName, "")) {
            return view('table', $this->getVariables($tableName));
        } else {
            return redirect( route('homepage') );
        }
    }

    public function homepageGroup($group) {
        return view('table', $this->getVariables("", $group));
    }

    public function homepageGroupedTable($group, $tableName) {
        if ($this->tableExist($tableName, $group)) {
            return view('table', $this->getVariables($tableName, $group));
        } else {
            return redirect( route('homepage') );
        }
    }

    private function getVariables($tableName = "", $group = "") {
        $selEntries = $tableName ? $this->getSelectedEntries($tableName) : 10;
        $settingsEntries = $tableName ? $this->getSelectedEntries('tb_settings_display') : 10;

        $tableMeta = $tableName
            ?
            DB::connection('mysql_data')->table('tb')->leftJoin('group', 'tb.group_id', '=', 'group.id')
                ->where('db_tb', '=', $tableName)->select('tb.*', 'group.name as grname', 'group.www_add')->first()
            :
            '';

        $groupList = DB::connection('mysql_data')->table('group')->get();

        $importHeadersMeta = $tableName
            ?
            DB::connection('mysql_schema')
                ->table('COLUMNS')
                ->where('TABLE_SCHEMA', '=', env('DB_DATABASE_DATA', 'utable'))
                ->where('TABLE_NAME', '=', $tableName)
                ->get()
            :
            [];
        $importHeaders = $tableName ? $this->tableService->getHeaders($tableName) : $this->emptyTBHeaders();
        foreach ($importHeaders as &$imp) {
            if (in_array($imp->field, ['id','createdBy','createdOn','modifiedBy','modifiedOn'])) {
                $imp->auto = 1;
                $imp->type = ($imp->field == 'createdOn' || $imp->field == 'modifiedOn' ? 'date' : 'int');
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
                $imp->type = ($curval && $curval->NUMERIC_PRECISION ? 'int' : ($curval && $curval->DATETIME_PRECISION ? 'date' : 'str'));
                $imp->default = ($curval && $curval->COLUMN_DEFAULT ? $curval->COLUMN_DEFAULT : '');
                $imp->required = ($curval && $curval->IS_NULLABLE != 'YES' ? 1 : 0);
                $imp->maxlen = ($curval && $curval->CHARACTER_MAXIMUM_LENGTH ? $curval->CHARACTER_MAXIMUM_LENGTH : '');
            }
        }

        if ($tableName) {
            $owner = (
                Auth::user()
                &&
                (Auth::user()->role_id == 1 || Auth::user()->id == $tableMeta->owner)
            ) ? true : false;
        } else {
            $owner = Auth::user() ? true : false;
        }

        return [
            'socialProviders' => config('auth.social.providers'),
            'listTables' => $this->getListTables($group),
            'tableMeta' => $tableMeta,
            'tableName' => $tableName,
            'headers' => $tableName ? $this->tableService->getHeaders($tableName) : [],
            'importHeaders' => $importHeaders,
            'settingsHeaders' => $tableName ? $this->tableService->getHeaders('tb_settings_display') : [],
            'settingsDDL_Headers' => $tableName ? $this->tableService->getHeaders('ddl') : [],
            'settingsDDL_Items_Headers' => $tableName ? $this->tableService->getHeaders('ddl_items') : [],
            'settingsRights_Headers' => $tableName ? $this->tableService->getHeaders('rights') : [],
            'settingsRights_Fields_Headers' => $tableName ? $this->tableService->getHeaders('rights_fields') : [],
            'selectedEntries' => $selEntries ? $selEntries : 'All',
            'settingsEntries' => $settingsEntries ? $settingsEntries : 'All',
            'group' => $group,
            'groupList' => $groupList,
            'canEditSettings' => $tableName ? $this->getCanEditSetings($tableName) : "",
            'favourite' => $tableName ? $this->getFavourite($tableName) : "",
            'owner' => $owner
        ];
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

    private function getCanEditSetings($tableName) {
        $canEdit = false;
        if (Auth::user()) {
            if (Auth::user()->role_id != 1) {
                $tb = DB::connection('mysql_data')->table('tb');
                $tb->where('tb.db_tb', '=', $tableName);
                $tb->where('tb.owner', '=', Auth::user()->id);
                //if user have rights for edit table (owner or right='All')
                if ($tb->count() > 0) {
                    $canEdit = true;
                }
            } else {
                //if admin
                $canEdit = true;
            }
        }
        return $canEdit;
    }

    private function getFavourite($tableName = "") {
        $status = false;
        if ($tableName && Auth::user()) {
            if (DB::connection('mysql_data')
                ->table('rights')
                ->join('tb', 'table_id', '=', 'tb.id')
                ->where('db_tb', '=', $tableName)
                ->where('user_id', '=', Auth::user()->id)
                ->count()
            ) {
                $status = "Active";
            } else {
                $status = "Inactive";
            }
        }
        return $status;
    }
    
    private function getListTables($tableGroup = "") {
        $tb = DB::connection('mysql_data')
            ->table('tb')
            ->leftJoin('group as g', 'g.id', '=', 'tb.group_id')
            ->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
        if ($tableGroup) {
            //get tables only for current group
            $tb->where('tb.access', '=', 'public');
            $tb->where('g.www_add', '=', $tableGroup);
        } else {
            if (!Auth::user()) {
                //guest - get public data
                $tb->where('tb.access', '=', 'public');
                $tb->where('g.www_add', '=', null);
            } else {
                if (Auth::user()->role_id != 1) {
                    //user - get user`s data, favourites and public data in the current folder
                    $tb->where('g.www_add', '=', null);
                    $tb->where(function ($qt) {
                        $qt->where('tb.access', '=', 'public');
                        $qt->orWhere('tb.owner', '=', Auth::user()->id);
                        $qt->orWhere('rights.user_id', '=', Auth::user()->id);
                    });
                }
                //admin - get all data
            }
        }
        $tb->select('tb.*', 'g.www_add', 'rights.id as right')->groupBy('tb.id');
        $tb = $tb->get();
        foreach ($tb as &$item) {
            $item->www_add = ($item->www_add ? $item->www_add."/".$item->db_tb : "all/".$item->db_tb);
        }

        return $tb;
    }

    private function getSelectedEntries($tableName) {
        $tb = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $tableName)->first();
        return $tb->nbr_entry_listing;
    }

    private function tableExist($tableName, $group = NULL) {
        $cnt = DB::connection('mysql_data')->table('tb')
            ->leftJoin('group', 'group.id', '=', 'tb.group_id')
            ->leftJoin('rights', 'rights.table_id', '=', 'tb.id')
            ->where('tb.db_tb', '=', $tableName);
        if ($group !== NULL) {
            $cnt->where('group.www_add', '=', $group ? $group : NULL);
        }

        if (!Auth::user()) {
            //guest - get public data
            $cnt->where('tb.access', '=', 'public');
        } else {
            if (Auth::user()->role_id != 1) {
                //user - get user`s data, favourites and public data in the current folder
                $cnt->where(function ($qt) {
                    $qt->where('tb.access', '=', 'public');
                    $qt->orWhere('tb.owner', '=', Auth::user()->id);
                    $qt->orWhere('rights.user_id', '=', Auth::user()->id);
                });
            }
            //admin - get all data
        }
        return $cnt->count();
    }

    public function showSettingsForCreateTable(Request $request) {
        if ($request->csv) {
            $tmp_csv = time()."_".rand().".csv";
            $request->csv->storeAs('csv', $tmp_csv);

            $filename = pathinfo($request->csv->getClientOriginalName(), PATHINFO_FILENAME);
            $filename = preg_replace('/[^\w\d]/i', '_', $filename);
        } else {
            $filename = $request->filename;
            $tmp_csv = $request->data_csv;
        }

        $columns = 0;
        $headers = [];
        $fileHandle = fopen(storage_path("app/csv/".$tmp_csv), 'r');
        $row_idx = 0;
        while (($data = fgetcsv($fileHandle)) !== FALSE) {
            $row_idx++;
            if (!$columns) {
                $columns = count($data);
            }

            if ($row_idx == 1) {
                foreach ($data as $key => $val) {
                    $headers[$key] = [
                        'header' => $request->check_1 ? $val : '',
                        'field' => strtolower(preg_replace('/[^\w\d]/i', '_', ($request->check_2 ? $val : 'col_'.$key) )),
                    ];
                }
            }
            if ($row_idx == 2 && $request->check_2) {
                foreach ($data as $key => $val) {
                    $headers[$key]['field'] = strtolower(preg_replace('/[^\w\d]/i', '_', $val ));
                }
            }
            if ($row_idx == 3) {
                foreach ($data as $key => $val) {
                    $headers[$key]['type'] = $request->check_3 ? $val : 'str';
                }
            }
            if ($row_idx == 4) {
                foreach ($data as $key => $val) {
                    $headers[$key]['size'] = $request->check_4 ? (int)$val : '';
                }
            }
            if ($row_idx == 5) {
                foreach ($data as $key => $val) {
                    $headers[$key]['default'] = $request->check_5 ? $val : '';
                }
            }
            if ($row_idx == 6) {
                foreach ($data as $key => $val) {
                    $headers[$key]['required'] = $request->check_6 && $val ? 1 : 0;
                }
            }

            if ($columns != count($data)) {
                return "Incorrect csv format (your rows have different number of columns)!";
            }
        }

        $to_view['filename'] = $filename;
        $to_view['headers'] = $headers;
        $to_view['data_csv'] = $tmp_csv;
        return $to_view;
    }
}
