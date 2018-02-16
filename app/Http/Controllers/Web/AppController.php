<?php

namespace Vanguard\Http\Controllers\Web;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Vanguard\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function landing() {
        if (empty($_SERVER['HTTP_REFERER'])) {
            $_SERVER['HTTP_REFERER'] = "";
        }

        if (Auth::guest() || ($_SERVER['HTTP_REFERER'] != config('app.url')."/")) {
            $socialProviders = config('auth.social.providers');
            return view('landing', compact('socialProviders'));
        } else {
            return redirect()->to( route('homepage') );
        }
    }

    public function crown() {
        /*$canEdit = false;
        $public_tables = DB::connection('mysql_data')->table('tb')->join('group as g', 'g.id', '=', 'tb.group_id')->where('group_id', '=', 1);
        if (!Auth::user()) {
            //guest - get public data
            $public_tables->where('access', '=', 'public');
        } else {
            if (Auth::user()->role_id != 1) {
                //user - get user`s data, tables with right 'view' and public
                $public_tables->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
                $public_tables->where(function ($q) {
                    $q->where('user_id', '=', Auth::user()->id);
                    $q->orWhereNull('user_id');
                });
                $public_tables->where(function ($q) {
                    $q->where('owner', '=', Auth::user()->id);
                    $q->orWhere('access', '=', 'public');
                    $q->orWhereNotNull('rights.right');
                });
            }
            //admin - get all data
        }
        $public_tables->select('tb.*', 'www_add');
        $public_tables = $public_tables->get();
        //$public_tables = DB::connection('mysql_data')->table('tb')->where('group_id', '=', 1)->get();
        $socialProviders = config('auth.social.providers');
        return view('crown', compact('socialProviders', 'canEdit', 'public_tables'));*/
        return view('table', $this->getVariables("", "crown"));
    }

    public function homepage() {
        return view('table', $this->getVariables());
    }

    public function homepageTable($tableName) {
        if ($this->tableExist($tableName)) {
            return view('table', $this->getVariables($tableName));
        } else {
            return redirect( route('homepage') );
        }
    }

    public function homepageGroupedTable($group, $tableName) {
        if ($this->tableExist($tableName)) {
            return view('table', $this->getVariables($tableName, $group));
        } else {
            return redirect( route('homepage') );
        }
    }

    private function getVariables($tableName = "", $group = "") {

        $selEntries = $tableName ? $this->getSelectedEntries($tableName) : 10;
        $settingsEntries = $tableName ? $this->getSelectedEntries('tb_settings_display') : 10;
        return [
            'socialProviders' => config('auth.social.providers'),
            'listTables' => $this->getListTables($group),
            'tableName' => $tableName,
            'headers' => $tableName ? $this->getHeaders($tableName) : [],
            'settingsHeaders' => $tableName ? $this->getHeaders('tb_settings_display') : [],
            'selectedEntries' => $selEntries ? $selEntries : 'All',
            'settingsEntries' => $settingsEntries ? $settingsEntries : 'All',
            'group' => $group,
            'canEdit' => $tableName ? $this->getCanEdit($tableName) : "",
            'canEditSettings' => $tableName ? $this->getCanEdit('tb_settings_display') : "",
            'favourite' => $tableName ? $this->getFavourite($tableName) : ""
        ];
    }

    private function getCanEdit($tableName) {
        $canEdit = false;
        if (Auth::user()) {
            if (Auth::user()->role_id != 1) {
                $tb = DB::connection('mysql_data')
                    ->table('tb')
                    ->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
                $tb->where('tb.db_tb', '=', $tableName);
                $tb->where(function ($q) {
                    $q->where('tb.owner', '=', Auth::user()->id);
                    $q->orWhere(function ($q_in) {
                        $q_in->where('rights.user_id', '=', Auth::user()->id);
                        $q_in->where('rights.right', '=', 'All');
                    });
                });
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
                ->where('right', '=', 'View')
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
        $tb = DB::connection('mysql_data')->table('tb')->leftJoin('group as g', 'g.id', '=', 'tb.group_id');
        if ($tableGroup) {
            //get tables only for current group
            $tb->where('access', '=', 'public');
            $tb->where('www_add', '=', $tableGroup);
        } else {
            if (!Auth::user()) {
                //guest - get public data
                $tb->where('access', '=', 'public');
                $tb->where('www_add', '=', null);
            } else {
                if (Auth::user()->role_id != 1) {
                    //user - get user`s data, favourites and public data in the current folder
                    $tb->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
                    $tb->where('www_add', '=', null);
                    $tb->where('access', '=', 'public');
                    $tb->orWhere(function ($qt) {
                        $qt->where(function ($q) {
                            $q->where('rights.user_id', '=', Auth::user()->id);
                            $q->orWhereNull('rights.user_id');
                        });
                        $qt->where(function ($q) {
                            $q->where('owner', '=', Auth::user()->id);
                            $q->orWhereNotNull('rights.right');
                        });
                    });
                }
                //admin - get all data
            }
        }
        $tb->select('tb.*', 'www_add');
        $tb = $tb->get();
        foreach ($tb as &$item) {
            $item->www_add = ($item->www_add ? $item->www_add . "/" . $item->db_tb : $item->db_tb);
        }

        return $tb;
    }

    private function getSelectedEntries($tableName) {
        $tb = DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $tableName)->first();
        return $tb->nbr_entry_listing;
    }

    private function getHeaders($tableName) {
        $header_data = DB::connection('mysql_data')
            ->table('tb')
            ->join('tb_settings_display as tsd', 'tsd.tb_id', '=', 'tb.id')
            ->where('db_tb', '=', $tableName)
            ->select('tsd.*')
            ->get();

        $tb = (array)DB::connection('mysql_data')->table($tableName)->first();
        $headers = [];
        foreach ($tb as $key => $val) {
            $headers[$key] = $header_data->where('field', '=', $key)->first();
        }
        return $headers;
    }

    private function tableExist($tableName) {
        return DB::connection('mysql_data')->table('tb')->where('db_tb', '=', $tableName)->first();
    }
}
