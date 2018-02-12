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
        $canEdit = false;
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
        return view('crown', compact('socialProviders', 'canEdit', 'public_tables'));
    }

    public function homepage() {
        $canEdit = false;
        $favourite = false;
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'canEdit', 'favourite'));
    }

    public function homepageTable($tableName) {
        $canEdit = $this->getCanEdit($tableName);
        $favourite = $this->getFavourite($tableName);
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'tableName', 'canEdit', 'favourite'));
    }

    public function homepageGroupedTable($group, $tableName) {
        $canEdit = $this->getCanEdit($tableName);
        $favourite = $this->getFavourite($tableName);
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'tableName', 'group', 'canEdit', 'favourite'));
    }

    private function getCanEdit($tableName) {
        $canEdit = false;
        if (Auth::user()) {
            if (Auth::user()->role_id != 1) {
                $tb = DB::connection('mysql_data')
                    ->table('tb')
                    ->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
                $tb->where(function ($q) {
                    $q->where('user_id', '=', Auth::user()->id);
                    $q->orWhereNull('user_id');
                });
                $tb->where(function ($q) {
                    $q->where('owner', '=', Auth::user()->id);
                    $q->orWhere('rights.right', '=', 'All');
                });
                $tb->where('tb.db', '=', $tableName);
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
}
