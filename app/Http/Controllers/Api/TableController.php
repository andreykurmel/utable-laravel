<?php

namespace Vanguard\Http\Controllers\Api;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Vanguard\Http\Controllers\Controller;
use Vanguard\Services\TableService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TableController extends Controller
{
    private $tableService;
    private $system_fields;
    private $user;

    public function getUser() {
        if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
            $this->user = DB::connection('mysql')
                ->table('users as u')
                ->join('api_tokens as a', 'a.user_id', '=', 'u.id')
                ->where('a.id', '=', $_SERVER['HTTP_AUTHORIZATION'])
                ->select('u.*')
                ->first();
        } else {
            $this->user = Auth::user();
        }
    }

    public function __construct(TableService $ts) {
        $this->tableService = $ts;
        $this->system_fields = ['id','refer_tb_id','createdBy','createdOn','modifiedBy','modifiedOn'];
    }

    public function getTables(Request $request) {
        $this->getUser();
        return $this->user->id;
    }
}
