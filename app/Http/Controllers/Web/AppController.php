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
        return [
            'socialProviders' => config('auth.social.providers'),
            'listTables' => $this->getListTables($group),
            'tableName' => $tableName,
            'headers' => $tableName ? $this->tableService->getHeaders($tableName) : [],
            'settingsHeaders' => $tableName ? $this->tableService->getHeaders('tb_settings_display') : [],
            'settingsDDL_Headers' => $tableName ? $this->tableService->getHeaders('ddl') : [],
            'settingsDDL_Items_Headers' => $tableName ? $this->tableService->getHeaders('ddl_items') : [],
            'settingsRights_Headers' => $tableName ? $this->tableService->getHeaders('rights') : [],
            'selectedEntries' => $selEntries ? $selEntries : 'All',
            'settingsEntries' => $settingsEntries ? $settingsEntries : 'All',
            'group' => $group,
            'canEditSettings' => $tableName ? $this->getCanEditSetings($tableName) : "",
            'favourite' => $tableName ? $this->getFavourite($tableName) : ""
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
        $tb->select('tb.*', 'g.www_add', 'rights.right')->groupBy('tb.id');
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

    private function tableExist($tableName, $group) {
        if ($group) {
            $cnt = DB::connection('mysql_data')->table('tb')->join('group', 'group.id', '=', 'tb.group_id')
                ->where('tb.db_tb', '=', $tableName)
                ->where('group.www_add', '=', $group)
                ->first();
        } else {
            $cnt = DB::connection('mysql_data')->table('tb')
                ->where('db_tb', '=', $tableName)
                ->where('group_id', '=', '')
                ->first();
        }
        return $cnt;
    }
}
