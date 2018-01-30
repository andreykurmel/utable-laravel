<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/table', function () {
    return view('table');
})->name('table');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('/api/getUTable', 'TableController@getUTable')->name('getUTable');
Route::get('/api/getSelectedTable', 'TableController@getSelectedTable')->name('getSelectedTable');
Route::get('/api/addTableRow', 'TableController@addTableRow')->name('addTableRow');
Route::get('/api/updateTableRow', 'TableController@updateTableRow')->name('updateTableRow');
Route::get('/api/deleteTableRow', 'TableController@deleteTableRow')->name('deleteTableRow');
