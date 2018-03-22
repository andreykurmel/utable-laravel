<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class AppController extends Controller
{
    private $tableService;
    private $subdomain = "";

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

        if ($this->subdomain) {
            $tableMeta = DB::connection('mysql_sys')->table('tb')->where('db_tb', '=', $this->subdomain)->first();
            if ($tableMeta->subdomain || $this->tableExist($this->subdomain)) {
                return view('table', $this->getVariables($this->subdomain));
            } else {
                if (!$tableMeta->subdomain || Auth::user()) {
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
            '';

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
            'server' => config('app.url'),
            'socialProviders' => config('auth.social.providers'),
            'treeTables' => $this->getTreeTables(),
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
            'canEditSettings' => $tableName ? $this->getCanEditSetings($tableName) : "",
            'favorite' => $tableName ? $this->isFavorite($tableName) : "",
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
                ->join('favorite_tables as ft', 'ft.table_id', '=', 'tb.id')
                ->where('ft.user_id', '=', Auth::user()->id)
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
        return [
            'public' => '<ul>'.$this->getTreeForTab('public').'</ul>',
            'private' => '<ul>'.$this->getTreeForTab('private').'</ul>',
            'favorite' => '<ul><li data-type=\'folder\'>Favorite'.
                    '<ul>'.$this->getTreeForTab('public',1).'</ul>'.
                    '<ul>'.$this->getTreeForTab('private',1).'</ul>'.
                '</li></ul>'
        ];
    }
    
    private function getTreeForTab($tab, $for_favorite = 0) {
        $folders = DB::connection('mysql_sys')->table('menutree')->where('structure', '=', $tab)->get();

        $res_arr = (object)['id' => 0, 'root_id' => 0, 'title' => $tab ,'tables' => [], 'children' => $this->buildTree( $folders )];

        $tables = DB::connection('mysql_sys')->table('tb')
            ->join('menutree_2_tb as m2t', 'm2t.tb_id', '=', 'tb.id')
            ->where('is_system', '=', 0)
            ->select('tb.*','m2t.menutree_id','m2t.type as link_type');

        if ($for_favorite) {
            $tables->join('favorite_tables as ft', function ($q) {
                $q->whereRaw('ft.table_id = tb.id');
                $q->where('ft.user_id', '=', Auth::user() ? Auth::user()->id : 0);
            });
        }
        if ($tab == 'private') {
            if (Auth::user()) {
                $tables->leftJoin('rights', function ($q) {
                        $q->where('rights.table_id', '=', 'tb.id');
                        $q->where('rights.user_id', '=', Auth::user()->id);
                    })
                    ->where('access', '=', $tab);
                if (Auth::user()->role_id != 1) {
                    $tables->where(function ($qt) {
                        $qt->where('tb.owner', '=', Auth::user()->id);
                        $qt->orWhere('rights.user_id', '=', Auth::user()->id);
                    });
                }
                $tables = $tables->groupBy('m2t.id')->get();
            } else {
                $tables = [];
            }
        } else {
            $tables = $tables->where('access', '=', $tab)->get();
        }

        foreach ($tables as $tb) {
            $this->add_tb($tb, $res_arr);
        }

        //dd($res_arr);

        return ($tables ? $this->buildHTMLTree($res_arr, '/data/', $tab) : '');
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
        $html = "<li data-type='folder' data-menu_id='".$res_arr->id."' data-root_id='".$res_arr->root_id."'>".$res_arr->title;
        if ($res_arr->tables || $res_arr->children) {
            $html .= '<ul>';
            if ($res_arr->tables) {
                foreach ($res_arr->tables as $table) {
                    if ($table->subdomain) {
                        $link = preg_replace('/\/\/www/i', '//www.'.$table->subdomain, config('app.url'));
                    } else {
                        if ($tab == 'public') {
                            preg_match('/\/data\/([^\/]*)/i', $url, $pub_subdomain);
                            $pub_subdomain = $pub_subdomain ? $pub_subdomain[1] : '';
                            $link = preg_replace('/\/\/www\./i', '//www.'.($pub_subdomain ? $pub_subdomain.'.' : ''), config('app.url'))
                                .preg_replace('/\/data\/'.$pub_subdomain.'\//i', '/data/', $url)
                                .$table->db_tb;
                        } else {
                            $link = config('app.url').$url.$table->db_tb;
                        }
                    }

                    $html .= '<li data-jstree=\'{"icon":"fa fa-'.$table->link_type.'"}\' data-type="'.$table->link_type.'"><a href="'.$link.'">'.$table->name.'</a></li>';
                }
            }
            if ($res_arr->children) {
                foreach ($res_arr->children as $child) {
                    $html .= $this->buildHTMLTree($child, $url.$child->title.'/', $tab);
                }
            }
            $html .= '</ul>';
        }
        $html .= '</li>';

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

    private function tableExist($tablePath) {
        //for subdomains logic changes from 'SUB.tabledataplace.com/data/folder/table' to 'tabledataplace.com/data/SUB/folder/table'
        if ($this->subdomain) {
            $tablePath = $this->subdomain.'/'.$tablePath;
        }
        $pathElems = explode('/', $tablePath);
        $tableName = end($pathElems);
        $pathCount = count($pathElems) - 1;

        //find table
        $cnt = DB::connection('mysql_sys')->table('tb')
            ->leftJoin('rights', 'rights.table_id', '=', 'tb.id')
            ->where('tb.db_tb', '=', $tableName);

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
        $tb = $cnt->select('tb.*')->first();

        //exist if table has subdomain eq to the request`s subdomain
        if ($this->subdomain && $this->subdomain == $tb->subdomain) {
            return 1;
        }

        $tb_id = $tb ? $tb->id : 0;

        //find 'menutree' path
        $menutree_id = 0;
        if ($pathCount) {
            for ($i = 0; $i < $pathCount; $i++) {
                $menutree = DB::connection('mysql_sys')->table('menutree')->where('title', '=', $pathElems[$i])->where('parent_id', '=', $menutree_id)->first();
                $menutree_id = $menutree ? $menutree->id : -1;
            }
        }

        //exists if exist table and exist 'menutree' path
        return DB::connection('mysql_sys')->table('menutree_2_tb')->where('tb_id', '=', $tb_id)->where('menutree_id', '=', $menutree_id)->count();
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

    public function showSettingsForCreateTableMySQL(Request $request) {
        Config::set('database.connections.mysql_import.host', $request->host);
        Config::set('database.connections.mysql_import.username', $request->user);
        Config::set('database.connections.mysql_import.password', $request->pass);
        Config::set('database.connections.mysql_import.database', 'information_schemas');

        try {
            $columns = DB::connection('mysql_import')->table('COLUMNS')->where('TABLE_SCHEMA', '=', $request->db)->where('TABLE_NAME', '=', $request->table)->get();
            $full_info = true;
        } catch (\Exception $e) {}

        if (empty($columns)) {
            DB::disconnect('mysql_import');
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
                        'required' => 0
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

    public function alltable(Request $request) {
        dd($request);
    }
}
