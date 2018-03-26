<?php

namespace Vanguard\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Support\Facades\DB;

class DatabaseChange
{
    protected $auth;
    /**
     * Creates a new instance of the middleware.
     *
     * @param Guard $auth
     */
    public function __construct(Guard $auth)
    {
        $this->auth = $auth;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if ($this->auth->guest()) {
            //guest don`t have rights to edit table
            abort(403, "Forbidden.");
        } else {
            if ($this->auth->user()->role_id != 1) {
                /*$tb = DB::connection('mysql_sys')
                    ->table('tb')
                    ->leftJoin('rights', 'rights.table_id', '=', 'tb.id');
                $tb->where(function ($q) {
                    $q->where('user_id', '=', $this->auth->user()->id);
                    $q->orWhereNull('user_id');
                });
                $tb->where(function ($q) {
                    $q->where('owner', '=', $this->auth->user()->id);
                });
                $tb->where('tb.db', '=', $request->tableName);
                //if user don`t have rights for edit table (owner or right='All') -> abort
                if ($tb->count() == 0) {
                    abort(403, "Forbidden.");
                }*/
            }
        }

        return $next($request);
    }
}
