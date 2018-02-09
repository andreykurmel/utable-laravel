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

    public function homepage() {
        $canEdit = false;
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'canEdit'));
    }

    public function homepageTable($tableName) {
        $canEdit = $this->getCanEdit($tableName);
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'tableName', 'canEdit'));
    }

    public function homepageGroupedTable($group, $tableName) {
        $canEdit = $this->getCanEdit($tableName);
        $socialProviders = config('auth.social.providers');
        return view('table', compact('socialProviders', 'tableName', 'group', 'canEdit'));
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
}
