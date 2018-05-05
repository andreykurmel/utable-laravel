<?php

namespace Vanguard\Http\Middleware;

use Closure;

class TestSubdomain
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        /*if ( preg_match('/^www\.?(.+)\.tabuda\.space$/i', $_SERVER['HTTP_HOST']) ) {
            return redirect()->to( route('landing') );
        } else {
            return $next($request);
        }*/
        return $next($request);
    }
}
