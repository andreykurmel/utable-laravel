<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class AppController extends Controller
{
    private $tableService;
    private $subdomain = "";
    private $links = [];

    public function __construct(TableService $tb) {
        $this->tableService = $tb;

        if( preg_match('/^www\.?(.+)\.tabledataplace\.com$/i', $_SERVER['HTTP_HOST']/*'www.sub.tabledataplace.com'*/, $subdomain) ) {
            $this->subdomain = $subdomain[1];
        }
    }

    public function landing() {
        if (empty($_SERVER['HTTP_REFERER'])) {
            $_SERVER['HTTP_REFERER'] = "";
        }

        /*if ($this->subdomain) {
            $tableMeta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $this->subdomain)->first();
            if ($tableMeta->subdomain && $this->tableExist($this->subdomain)) {
                return view('table', $this->getVariables($this->subdomain));
            } else {
                if (!$tableMeta->subdomain || Auth::user()) {
                    return view('errors.404');
                } else {
                    return redirect()->to( route('login') );
                }
            }
        }*/

        if (Auth::guest() || ($_SERVER['HTTP_REFERER'] != config('app.url')."/")) {
            $socialProviders = config('auth.social.providers');
            $server = config('app.url');
            return view('landing', compact('socialProviders', 'server'));
        } else {
            return redirect()->to( route('homepage') );
        }
    }

    public function homepage() {
        return view('table', $this->getVariables());
    }

    public function homepageTable($table) {
        if ($this->tableExist($table)) {
            return view('table', $this->getVariables($table));
        } else {
            return redirect( route('homepage') );
        }
    }

    private function getVariables($tablePath = "") {
        $pathElems = explode('/', $tablePath);
        $tableName = end($pathElems);
        $pathCount = count($pathElems) - 1;

        $selEntries = $tableName ? $this->getSelectedEntries($tableName) : 10;
        $settingsEntries = $tableName ? $this->getSelectedEntries('tb_settings_display') : 10;

        $tableMeta = $tableName
            ?
            DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first()
            :
            [];

        $importHeaders = $this->tableService->getImportHeaders($tableName);

        $importReferences = $this->tableService->getImportHeaders($tableName, $tableMeta->id);

        if ($tableName) {
            $owner = (
                Auth::user()
                &&
                (Auth::user()->role_id == 1 || Auth::user()->id == $tableMeta->owner)
            ) ? true : false;
        } else {
            $owner = Auth::user() ? true : false;
        }

        $connections =
            Auth::user()
            ?
            DB::connection('mysql_sys')->table('conn')->where('user_id', '=', Auth::user()->id)->orderBy('name')->get()
            :
            [];

        if (Auth::user()) {
            //get tables for user
            $tablesDropDown = DB::connection('mysql_sys')->table('tb')
                ->leftJoin('menutree_2_tb as m2t', function ($q) {
                    $q->whereRaw('m2t.tb_id = tb.id');
                    $q->where('m2t.structure', '=', 'public');
                    $q->where('m2t.type', '=', 'link');
                })
                ->where('is_system', '=', 0);
            if (Auth::user()->role_id != 1) {
                $tablesDropDown->where('tb.owner', '=', Auth::user()->id)->orWhereNotNull('m2t.id');
            }
            $tablesDropDown = $tablesDropDown->groupBy('tb.id')->select('tb.*')->get();
            //get fields for each tables
            foreach ($tablesDropDown as &$tb) {
                $tb->items = DB::connection('mysql_sys')
                    ->table('tb_settings_display')
                    ->where('tb_id', '=', $tb->id)
                    ->where('user_id', '=', $tb->owner)
                    ->get();
            }
        } else {
            $tablesDropDown = [];
        }

        return [
            'server' => config('app.url'),
            'socialProviders' => config('auth.social.providers'),
            'treeTables' => $this->getTreeTables(),
            'tableMeta' => $tableMeta,
            'tableName' => $tableName,
            'headers' => $tableName ? $this->tableService->getHeaders($tableName) : [],
            'importHeaders' => $importHeaders,
            'importReferences' => $importReferences,
            'settingsHeaders' => $tableName ? $this->tableService->getHeaders('tb_settings_display') : [],
            'settingsDDL_Headers' => $tableName ? $this->tableService->getHeaders('ddl') : [],
            'settingsDDL_Items_Headers' => $tableName ? $this->tableService->getHeaders('ddl_items') : [],
            'settingsDDL_References_Headers' => $tableName ? $this->tableService->getHeaders('cdtns') : [],
            'settingsRights_Headers' => $tableName ? $this->tableService->getHeaders('permissions') : [],
            'settingsRights_Fields_Headers' => $tableName ? $this->tableService->getHeaders('permissions_fields') : [],
            'selectedEntries' => $selEntries ? $selEntries : 'All',
            'settingsEntries' => $settingsEntries ? $settingsEntries : 'All',
            //'canEditSettings' => $tableName ? $this->getCanEditSetings($tableName) : "",
            'favorite' => $tableName ? $this->isFavorite($tableName) : "",
            'owner' => $owner,
            'importTypesDDL' => DB::connection('mysql_sys')->table('ddl_items')->where('list_id', '=', '56')->orderBy('id')->get(),
            'importConnections' => $connections,
            'tablesDropDown' => $tablesDropDown
        ];
    }

    private function getCanEditSetings($tableName) {
        $canEdit = false;
        if (Auth::user()) {
            if (Auth::user()->role_id != 1) {
                $tb = DB::connection('mysql_sys')->table('tb');
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

    private function isFavorite($tableName = "") {
        $status = false;
        if ($tableName && Auth::user()) {
            if (DB::connection('mysql_sys')
                ->table('tb')
                ->join('menutree_2_tb as m2t', function ($q) {
                    $q->whereRaw('m2t.tb_id = tb.id');
                    $q->where('m2t.structure', '=', 'favorite');
                    $q->where('m2t.user_id', '=', Auth::user()->id);
                })
                ->where('tb.db_tb', '=', $tableName)
                ->count()
            ) {
                $status = "Active";
            } else {
                $status = "";
            }
        }
        return $status;
    }

    private function getTreeTables() {
        $arr = ['public' => $this->getTreeForTab('public')];
        if (Auth::user()) {
            $arr['private'] = $this->getTreeForTab('private');
            $arr['favorite'] = $this->getTreeForTab('favorite');
            $arr['custom_select'] = $this->links;
        }

        return $arr;
    }
    
    private function getTreeForTab($tab) {
        $folders = DB::connection('mysql_sys')->table('menutree')->where('structure', '=', $tab);
        //folders structure is shared only for 'public' tab. Other tabs with structure different for each user.
        if ($tab != 'public') {
            $folders->where('user_id', '=', Auth::user()->id);
        }
        $folders = $folders->get();

        //init menutree with folders
        $res_arr = (object)['id' => 0, 'title' => $tab ,'tables' => [], 'children' => $this->buildTree( $folders )];

        //tables are only on the 'private' tab, other tabs have only links.
        if ($tab == 'private') {
            $tables = DB::connection('mysql_sys')->table('tb')
                ->leftJoin('menutree_2_tb as m2t', function ($q) {
                    $q->whereRaw('m2t.tb_id = tb.id');
                    $q->where('m2t.user_id', '=', Auth::user()->id);
                    $q->where('m2t.structure', '=', 'private');
                    $q->where('m2t.type', '=', 'table');
                })
                ->where('is_system', '=', 0)
                ->selectRaw("tb.*, IF(m2t.id IS NULL, 0, m2t.id) as m2t_id, IF(m2t.menutree_id IS NULL, 0, m2t.menutree_id) as menutree_id, 'table' as link_type");

            if (Auth::user()->role_id != 1) {
                $tables->leftJoin('permissions', function ($q) {
                    $q->where('permissions.table_id', '=', 'tb.id');
                    $q->where('permissions.user_id', '=', Auth::user()->id);
                });
                $tables->where(function ($qt) {
                    $qt->where('tb.owner', '=', Auth::user()->id);
                    $qt->orWhere('permissions.user_id', '=', Auth::user()->id);
                });
            }
            $tables = $tables->get();
        } else {
            $tables = [];
        }

        //links can be found on each tab
        $links = DB::connection('mysql_sys')->table('tb')
            ->join('menutree_2_tb as m2t', function ($q) use ($tab) {
                $q->whereRaw('m2t.tb_id = tb.id');
                $q->where('m2t.structure', '=', $tab);
                $q->where('m2t.type', '=', 'link');
                //folders structure and links are shared only for 'public' tab. Other tabs with structure different for each user.
                if ($tab != 'public') {
                    $q->where('m2t.user_id', '=', Auth::user()->id);
                }
            })
            ->where('is_system', '=', 0)
            ->select('tb.*','m2t.id as m2t_id','m2t.menutree_id','m2t.type as link_type')
            ->get();

        //connect tables and links with folders structure (menutree)
        foreach ($tables as $tb) {
            $this->add_tb($tb, $res_arr);
        }
        foreach ($links as $l) {
            $this->add_tb($l, $res_arr);
        }

        return $this->buildHTMLTree($res_arr, '/data/', $tab);
    }

    private function add_tb($tb, &$res_arr) {
        if ($res_arr->id == $tb->menutree_id) {
            $res_arr->tables[] = $tb;
            return;
        }
        if ($res_arr->children) {
            foreach ($res_arr->children as &$ch) {
                $this->add_tb($tb, $ch);
            }
        }
    }

    private function buildHTMLTree($res_arr, $url, $tab) {
        if ($res_arr->id) {
            $html = "<li data-type='folder' data-menu_id='" . $res_arr->id . "'>" . $res_arr->title;
        } else {
            $html = "";
        }

        if ($res_arr->tables || $res_arr->children) {
            $html .= '<ul>';
            if ($res_arr->tables) {
                foreach ($res_arr->tables as $table) {
                    if ($tab == 'public') {
                        preg_match('/\/data\/([^\/]*)/i', $url, $pub_subdomain);
                        //get subdomain from root folder or fall to 'general'
                        $pub_subdomain = $pub_subdomain ? $pub_subdomain[1] : 'general';
                        $link = preg_replace('/\/\/www\./i', '//www.'.($pub_subdomain ? $pub_subdomain.'.' : ''), config('app.url'))
                            .'/data/'
                            .$table->db_tb;
                    } else {
                        $link = config('app.url').'/data/'.$table->db_tb;
                    }

                    $html .= '<li 
                        data-jstree=\'{"icon":"fa fa-'.$table->link_type.'"}\' 
                        data-type="'.$table->link_type.'" 
                        data-m2t_id="'.$table->m2t_id.'" 
                        data-tb_id="'.$table->id.'" 
                        data-tb_name="'.$table->name.'" 
                        data-tb_db="'.$table->db_tb.'" 
                        data-tb_nbr="'.$table->nbr_entry_listing.'" 
                        data-tb_notes="'.$table->notes.'" 
                        data-href="'.$link.'" 
                    ><a href="'.$link.'">'.$table->name.'</a></li>';

                    if ($tab == 'favorite') {
                        $this->links[$table->db_tb] = [
                            'li' => $link,
                            'name' => $table->name
                        ];
                    }
                }
            }
            if ($res_arr->children) {
                foreach ($res_arr->children as $child) {
                    $html .= $this->buildHTMLTree($child, $url.$child->title.'/', $tab);
                }
            }
            $html .= '</ul>';
        }

        if ($res_arr->id) {
            $html .= '</li>';
        }

        return $html;
    }

    private function buildTree($elements, $parentId = 0) {
        $branch = array();

        foreach ($elements as $element) {
            if ($element->parent_id == $parentId) {
                $children = $this->buildTree($elements, $element->id);
                if ($children) {
                    $element->children = $children;
                } else {
                    $element->children = [];
                }
                $element->tables = [];
                $branch[] = $element;
            }
        }

        return $branch;
    }

    private function getSelectedEntries($tableName) {
        $tb = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $tableName)->first();
        return $tb->nbr_entry_listing;
    }

    private function tableExist($tableName) {
        $exist = 0;

        if ($this->subdomain) {
            //check for 'public' tab
            $exist = DB::connection('mysql_sys')->table('tb')
                ->leftJoin('menutree_2_tb as m2t', function ($q) {
                    $q->whereRaw('m2t.tb_id = tb.id');
                    $q->where('m2t.structure', '=', 'public');
                    $q->where('m2t.type', '=', 'link');
                })
                ->where('tb.db_tb', '=', $tableName)
                ->whereNotNull('m2t.id')
                ->count();

        } else {
            //check for 'private' and 'favorite' tabs
            if (Auth::user()) {
                $table = DB::connection('mysql_sys')->table('tb')
                    ->leftJoin('permissions', 'permissions.table_id', '=', 'tb.id')
                    ->where('tb.db_tb', '=', $tableName);
                if (Auth::user()->role_id != 1) {
                    //user - get user`s data, favourites and public data in the current folder
                    $table->where(function ($qt) {
                        $qt->orWhere('tb.owner', '=', Auth::user()->id);
                        $qt->orWhere('permissions.user_id', '=', Auth::user()->id);
                    });
                }
                //admin - get all data
                $exist = $table->count();
            }
        }

        return $exist;
    }

    public function showSettingsForCreateTable(Request $request) {
        if (!Auth::user()) {
            return "Only for logged users";
        }

        if ($request->file_link) {
            $filename = explode('/', $request->file_link);
            $filename = pathinfo(last($filename), PATHINFO_FILENAME);
            $filename = preg_replace('/[^\w\d]/i', '_', $filename);

            $tmp_csv = time()."_".rand().".csv";
            if( !Storage::put("csv/".$tmp_csv, file_get_contents($request->file_link)) ) {
                return "File accessing error!";
            }
        }
        if ($request->csv) {
            $tmp_csv = time()."_".rand().".csv";
            $request->csv->storeAs('csv', $tmp_csv);

            $filename = pathinfo($request->csv->getClientOriginalName(), PATHINFO_FILENAME);
            $filename = preg_replace('/[^\w\d]/i', '_', $filename);
        }
        if (empty($filename)) {
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
            } else {
                foreach ($data as $key => $val) {
                    $headers[$key]['required'] = 1;
                }
            }

            if ($columns != count($data)) {
                return "Incorrect csv format (your rows have different number of columns)!";
            }

            //auto fill 'size' from columns
            foreach ($data as $key => $val) {
                if (!isset($headers[$key]['size'])) {
                    $headers[$key]['size'] = '';
                }
                if (strlen((string)$val) > $headers[$key]['size']) {
                    $headers[$key]['size'] = strlen((string)$val);
                }
            }
        }

        $to_view['filename'] = $filename;
        $to_view['headers'] = $headers;
        $to_view['data_csv'] = $tmp_csv;
        return $to_view;
    }

    public function showSettingsForCreateTableMySQL(Request $request) {
        if (!Auth::user()) {
            return "Only for logged users";
        }

        //if need to save connection info
        if ($request->save_conn) {
            $exist = DB::connection('mysql_sys')->table('conn')
                ->where('user_id', '=', Auth::user()->id)
                ->where('name', '=', $request->name_conn)
                ->first();
            if ($exist) {
                DB::connection('mysql_sys')->table('conn')
                    ->where('user_id', '=', Auth::user()->id)
                    ->where('name', '=', $request->name_conn)
                    ->update([
                        'server' => $request->host,
                        'user' => $request->user,
                        'pwd' => $request->pass,
                        'db' => $request->db,
                        'table' => $request->table,
                        'notes' => $request->notes,
                        'modifiedBy' => Auth::user()->id,
                        'modifiedOn' => now()
                    ]);
            } else {
                DB::connection('mysql_sys')->table('conn')->insert([
                    'user_id' => Auth::user()->id,
                    'name' => $request->name_conn,
                    'server' => $request->host,
                    'user' => $request->user,
                    'pwd' => $request->pass,
                    'db' => $request->db,
                    'table' => $request->table,
                    'notes' => $request->notes,
                    'createdBy' => Auth::user()->id,
                    'createdOn' => now(),
                    'modifiedBy' => Auth::user()->id,
                    'modifiedOn' => now()
                ]);
            }
        }

        Config::set('database.connections.mysql_import.host', $request->host);
        Config::set('database.connections.mysql_import.username', $request->user);
        Config::set('database.connections.mysql_import.password', $request->pass);
        Config::set('database.connections.mysql_import.database', 'information_schema');

        try {
            $columns = DB::connection('mysql_import')->table('COLUMNS')->where('TABLE_SCHEMA', '=', $request->db)->where('TABLE_NAME', '=', $request->table)->get();
            $full_info = true;
        } catch (\Exception $e) {}

        if (empty($columns)) {
            Config::set('database.connections.mysql_import2.host', $request->host);
            Config::set('database.connections.mysql_import2.username', $request->user);
            Config::set('database.connections.mysql_import2.password', $request->pass);
            Config::set('database.connections.mysql_import2.database', $request->db);

            try {
                $columns = DB::connection('mysql_import2')->table($request->table)->first();
                $full_info = false;
            } catch (\Exception $e) {}
        }

        if (!empty($columns)) {
            $headers = [];
            $idx = 1;
            if (!empty($full_info)) {
                foreach ($columns as $key => $col) {
                    if (!in_array($col->COLUMN_NAME, ['id','createdBy','createdOn','modifiedBy','modifiedOn'])) {
                        $headers[$idx] = [
                            'header' => $col->COLUMN_NAME,
                            'field' => $col->COLUMN_NAME,
                            'type' => ($col->NUMERIC_PRECISION ? 'int' : ($col->DATETIME_PRECISION ? 'date' : 'str')),
                            'size' => ($col->CHARACTER_MAXIMUM_LENGTH ? $col->CHARACTER_MAXIMUM_LENGTH : ''),
                            'default' => ($col->COLUMN_DEFAULT ? $col->COLUMN_DEFAULT : ''),
                            'required' => ($col->IS_NULLABLE != 'YES' ? 1 : 0)
                        ];
                        $idx ++;
                    }
                }
            } else {
                for ($idx = 1; $idx <= count((array)$columns); $idx++) {
                    $headers[$idx] = [
                        'header' => 'Col '.$idx,
                        'field' => 'col_'.$idx,
                        'type' => 'str',
                        'size' => '',
                        'default' => '',
                        'required' => 1
                    ];
                }
            }
        } else {
            return ['error' => true];
        }

        $to_view['filename'] = $request->table;
        $to_view['headers'] = $headers;
        $to_view['data_csv'] = '';
        return $to_view;
    }
}
