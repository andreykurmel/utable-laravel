<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Vanguard\Services\TableService;

class AppController extends Controller
{
    private $tableService;
    private $subdomain = "";
    private $links = [];
    private $public_tables = [];

    public function __construct(TableService $tb) {
        $this->tableService = $tb;

        if( preg_match('/^www\.?(.+)\.tabuda\.space$/i', $_SERVER['HTTP_HOST']/*'www.sub.tabuda.space'*/, $subdomain) ) {
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
            return view('landing', $this->getVariables());
        } else {
            return redirect()->to( route('homepage') );
        }
    }

    public function getFile($filepath) {
        $pathArr = explode('/', $filepath);
        if (count($pathArr) != 4) {
            return "Not found!";
        }
        $folderName = $pathArr[0];
        $row = $pathArr[1];
        $field = $pathArr[2];
        $fileName = $pathArr[3];//return();
        if (file_exists( storage_path('app/file/'.$folderName.'/'.$row.'/'.$field.'/'.$fileName) )) {
            return Storage::get(storage_path('app/file/'.$folderName.'/'.$row.'/'.$field.'/'.$fileName));
        } else {
            return "Not found!";
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

    public function homepageView($view) {
        if ($this->viewExist($view)) {
            return view('table', $this->getVariables($view, true));
        } else {
            return redirect( route('homepage') );
        }
    }

    private function getVariables($tablePath = "", $is_view = false) {
        if ($is_view) {
            $tableFullName = DB::connection('mysql_sys')
                ->table('tb_views as tv')
                ->join('tb', 'tb.db_tb', '=', 'tv.table_name')
                ->where('tv.path_hash', '=', $tablePath)
                ->first();
            $tableFullName = $tableFullName->name;
        } else {
            $pathElems = explode('/', $tablePath);
            $tableFullName = end($pathElems);
            $pathCount = count($pathElems) - 1;
        }

        $tableMeta = $tableFullName
            ?
            DB::connection('mysql_sys')->table('tb')->where('name', '=', $tableFullName)->first()
            :
            [];

        $tableName = $tableMeta ? $tableMeta->db_tb : '';

        $table_notes = ['owner' => '', 'user' => ''];

        $selEntries = $tableName ? $this->getSelectedEntries($tableName) : 10;
        $settingsEntries = $tableName ? $this->getSelectedEntries('tb_settings_display') : 10;

        if ($tableMeta) {
            $tableMeta->conn_notes = json_decode($tableMeta->conn_notes);

            //------------------ get table notes (owner`s and user`s)
            $tn = DB::connection('mysql_sys')->table('tb_notes')->where('tb_id', '=', $tableMeta->id)->where('user_id', '=', 0)->first();
            if (!$tn) {
                DB::connection('mysql_sys')->table('tb_notes')->insert([
                    'tb_id' => $tableMeta->id,
                    'user_id' => 0
                ]);
                $tn = DB::connection('mysql_sys')->table('tb_notes')->where('tb_id', '=', $tableMeta->id)->where('user_id', '=', 0)->first();
            }
            $table_notes['owner'] = $tn->notes;
            $table_notes['owner_id'] = $tn->id;

            if (Auth::user()) {
                $tn = DB::connection('mysql_sys')->table('tb_notes')->where('tb_id', '=', $tableMeta->id)->where('user_id', '=', Auth::user()->id)->first();
                if (!$tn) {
                    DB::connection('mysql_sys')->table('tb_notes')->insert([
                        'tb_id' => $tableMeta->id,
                        'user_id' => Auth::user()->id
                    ]);
                    $tn = DB::connection('mysql_sys')->table('tb_notes')->where('tb_id', '=', $tableMeta->id)->where('user_id', '=', Auth::user()->id)->first();
                }
                $table_notes['user'] = $tn->notes;
                $table_notes['user_id'] = $tn->id;
            }
            //-------------------- end get table notes
        }

        $importHeaders = ($tableName ? $this->tableService->getImportHeaders($tableName) : []);

        $importReferences = ($tableName ? $this->tableService->getImportHeaders($tableName, $tableMeta->id) : []);

        if ($tableName) {
            $owner = (
                Auth::user()
                &&
                (/*Auth::user()->role_id == 1 || */Auth::user()->id == $tableMeta->owner)
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
            //if (Auth::user()->role_id != 1) {
                $tablesDropDown->where('tb.owner', '=', Auth::user()->id)->orWhereNotNull('m2t.id');
            //}
            $tablesDropDown = $tablesDropDown->groupBy('tb.id')->select('tb.*')->get();
            //get fields for each tables
            foreach ($tablesDropDown as &$tb) {
                $refTbName = DB::connection('mysql_sys')->table('tb')->where('id', '=', $tb->id)->first();
                $refTbName = DB::connection('mysql_sys')->table('tb')->where('id', '=', $tb->id)->first();

                $tb->conn_notes = '';
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
            'settingsRights_Rows_Headers' => $tableName ? $this->tableService->getHeaders('range') : [],
            'selectedEntries' => $selEntries ? $selEntries : 'All',
            'settingsEntries' => $settingsEntries ? $settingsEntries : 'All',
            //'canEditSettings' => $tableName ? $this->getCanEditSetings($tableName) : "",
            'favorite' => $tableName ? $this->isFavorite($tableName) : "",
            'owner' => $owner,
            'importTypesDDL' => DB::connection('mysql_sys')->table('ddl_items')->where('list_id', '=', '56')->orderBy('id')->get(),
            'importConnections' => $connections,
            'tablesDropDown' => $tablesDropDown,
            'allUsers' => DB::connection('mysql')->table('users')->get(),
            'public_tables' => $this->public_tables,
            'table_notes' => $table_notes,
            'view_id' => ($is_view ? $tablePath : false)
        ];
    }

    private function getCanEditSetings($tableName) {
        $canEdit = false;
        if (Auth::user()) {
            //if (Auth::user()->role_id != 1) {
                $tb = DB::connection('mysql_sys')->table('tb');
                $tb->where('tb.db_tb', '=', $tableName);
                $tb->where('tb.owner', '=', Auth::user()->id);
                //if user have rights for edit table (owner or right='All')
                if ($tb->count() > 0) {
                    $canEdit = true;
                }
            /*} else {
                //if admin
                $canEdit = true;
            }*/
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

            //if (Auth::user()->role_id != 1) { now admin cannot access to all tables on the server
                $tables->leftJoin('permissions', function ($q) {
                    $q->where('permissions.table_id', '=', 'tb.id');
                    $q->where('permissions.user_id', '=', Auth::user()->id);
                });
                $tables->where(function ($qt) {
                    $qt->where('tb.owner', '=', Auth::user()->id);
                    $qt->orWhere('permissions.user_id', '=', Auth::user()->id);
                });
            //}
            $tables = $tables->get();

            $views = DB::connection('mysql_sys')->table('tb_views')
                ->where('createdBy', '=', Auth::user()->id)
                ->selectRaw("*, 0 as m2t_id, 0 as menutree_id, 'eye' as link_type")
                ->get();
        } else {
            $tables = [];
            $views = [];
        }

        //links can be found on each tab
        $links = DB::connection('mysql_sys')->table('tb')
            ->join('menutree_2_tb as m2t', function ($q) use ($tab) {
                $q->whereRaw('m2t.tb_id = tb.id');
                $q->where('m2t.structure', '=', $tab);
                $q->whereIn('m2t.type', ['link','share-alt']);
                //folders structure and links are shared only for 'public' tab. Other tabs with structure different for each user.
                if ($tab != 'public') {
                    $q->where('m2t.user_id', '=', Auth::user()->id);
                }
            })
            ->where('is_system', '=', 0)
            ->select('tb.*','m2t.id as m2t_id','m2t.menutree_id','m2t.type as link_type')
            ->get();

        //connect tables and links with folders structure (menutree)
        foreach ($views as $vw) {
            $this->add_tb($vw, $res_arr);
        }
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
            $html = "<li data-type='folder' data-title='" . $res_arr->title . "' ".
                "data-jstree='{\"opened\":".($res_arr->state ? 1 : 0).", \"icon\":\"fa fa-folder".($res_arr->state ? '-open' : '')."\"}' ".
                "data-menu_id='" . $res_arr->id . "'>" . $res_arr->title . " ({~folders".$res_arr->id."}/{~tables".$res_arr->id."})";
        } else {
            $html = "";
        }
        $folders_cnt = ($res_arr->children ? count($res_arr->children) : 0);
        $tables_cnt = ($res_arr->tables ? count($res_arr->tables) : 0);

        if ($res_arr->tables || $res_arr->children) {
            $html .= '<ul>';
            if ($res_arr->tables) {
                foreach ($res_arr->tables as $table) {
                    //show 'views'
                    if ($table->link_type == 'eye') {
                        $link = config('app.url').'/view/'.$table->path_hash;

                        $html .= '<li 
                            data-jstree=\'{"icon":"fa fa-'.$table->link_type.'"}\' 
                            data-type="'.$table->link_type.'" 
                            data-m2t_id="'.$table->m2t_id.'" 
                            data-tb_id="'.$table->id.'" 
                            data-href="'.$link.'" 
                        ><a href="'.$link.'">'.$table->view_name.'</a></li>';

                    //show 'tables' and 'links'
                    } else {
                        if ($tab == 'public') {
                            preg_match('/\/data\/([^\/]*)/i', $url, $pub_subdomain);
                            //get subdomain from root folder or fall to 'general'
                            $pub_subdomain = $pub_subdomain ? $pub_subdomain[1] : 'general';
                            $link = preg_replace('/\/\/www\./i', '//www.'.($pub_subdomain ? $pub_subdomain.'.' : ''), config('app.url'))
                                .preg_replace('/'.$pub_subdomain.'\//i','', $url)
                                .$table->name;
                        } else {
                            $link = config('app.url').$url.$table->name;
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

                        if ($tab == 'public') {
                            $this->public_tables[] = [
                                'li' => $link,
                                'name' => $table->name
                            ];
                        }
                    }
                }
            }
            if ($res_arr->children) {
                foreach ($res_arr->children as $child) {
                    $res = $this->buildHTMLTree($child, $url.$child->title.'/', $tab);
                    $html .= $res['html'];
                    $folders_cnt += $res['folders'];
                    $tables_cnt += $res['tables'];
                }
            }
            $html .= '</ul>';
        }

        if ($res_arr->id) {
            $html .= '</li>';
        }

        $html = str_replace('{~folders'.$res_arr->id.'}', $folders_cnt, $html);
        $html = str_replace('{~tables'.$res_arr->id.'}', $tables_cnt, $html);

        return [
            'html' => $html,
            'folders' => $folders_cnt,
            'tables' => $tables_cnt
        ];
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

    private function viewExist($viewPath) {
        return DB::connection('mysql_sys')->table('tb_views')->where('path_hash', '=', $viewPath)->count();
    }

    private function tableExist($tableName) {
        $pathArr = explode('/', $tableName);
        $tableName = array_pop($pathArr);
        $exist = 0;

        if ($this->subdomain) {
            array_unshift($pathArr, $this->subdomain);
            //check for 'public' tab
            $exist = DB::connection('mysql_sys')->table('tb')
                ->leftJoin('menutree_2_tb as m2t', function ($q) {
                    $q->whereRaw('m2t.tb_id = tb.id');
                    $q->where('m2t.structure', '=', 'public');
                    $q->where('m2t.type', '=', 'link');
                })
                ->where('tb.name', '=', $tableName)
                ->whereNotNull('m2t.id')
                ->count();

        } else {
            //check for 'private' and 'favorite' tabs
            if (Auth::user()) {
                $table = DB::connection('mysql_sys')->table('tb')
                    ->leftJoin('permissions', 'permissions.table_id', '=', 'tb.id')
                    ->where('tb.name', '=', $tableName);
                //if (Auth::user()->role_id != 1) {
                    //user - get user`s data, favourites and public data in the current folder
                    $table->where(function ($qt) {
                        $qt->orWhere('tb.owner', '=', Auth::user()->id);
                        $qt->orWhere('permissions.user_id', '=', Auth::user()->id);
                    });
                //}
                //admin - get all data
                $exist = $table->count();
            }
        }

        //test path
        $par_id = 0;
        $exist_path = 1;
        if ($exist && count($pathArr)) {
            foreach ($pathArr as $p_elem) {
                $par_id = DB::connection('mysql_sys')->table('menutree')
                    ->where('title', '=', $p_elem)
                    ->where('parent_id', '=', $par_id);

                if ($this->subdomain) {
                    $par_id->where('structure', '=', 'public');
                } else {
                    $par_id->where('user_id', '=', Auth::user() ? Auth::user()->id : 0);
                }
                $par_id = $par_id->first();

                if ($par_id) {
                    $par_id = $par_id->id;
                } else {
                    $exist_path = 0;
                    break;
                }
            }
        }

        return $exist && $exist_path;
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
                    $headers[$key]['type'] = $request->check_3 ? ucfirst(strtolower($val)) : 'String';
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
                            'type' => ($col ? $col->DATA_TYPE : 'String'),
                            'size' => ($col->CHARACTER_MAXIMUM_LENGTH ? $col->CHARACTER_MAXIMUM_LENGTH : ($col->NUMERIC_PRECISION ? $col->NUMERIC_PRECISION : '')),
                            'default' => ($col->COLUMN_DEFAULT ? $col->COLUMN_DEFAULT : ''),
                            'required' => ($col->IS_NULLABLE != 'YES' ? 1 : 0)
                        ];
                        switch ($headers[$idx]['type']) {
                            case 'int': $headers[$idx]['type'] = 'Integer'; break;
                            case 'decimal': $headers[$idx]['type'] = 'Decimal'; break;
                            case 'datetime': $headers[$idx]['type'] = 'Date Time'; break;
                            case 'date': $headers[$idx]['type'] = 'Date'; break;
                            default: $headers[$idx]['type'] = 'String'; break;
                        }
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

    public function sendEmail(Request $request) {
        if ($request->email && $request->msg) {
            Mail::send('emails.contact', ['msg' => $request->msg, 'email' => $request->email], function ($mail) use ($request) {
                $mail->from($request->email);
                $mail->to( config('mail.from.address') );
                if ($request->hasFile('attach')) {
                    $mail->attach($request->attach->path());
                }
            });
        }
        return redirect()->to(route('landing'));
    }
}
