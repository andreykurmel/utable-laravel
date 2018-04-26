<?php

/**
 * Vanguard routes
 * Authentication
 */

Route::get('login', 'Auth\AuthController@getLogin')->name('login');
Route::post('login', 'Auth\AuthController@postLogin');

Route::get('logout', [
    'as' => 'auth.logout',
    'uses' => 'Auth\AuthController@getLogout'
]);

// Allow registration routes only if registration is enabled.
if (settings('reg_enabled')) {
    Route::get('register', 'Auth\AuthController@getRegister')->name('register');
    Route::post('register', 'Auth\AuthController@postRegister');
    Route::get('register/confirmation/{token}', [
        'as' => 'register.confirm-email',
        'uses' => 'Auth\AuthController@confirmEmail'
    ]);
}

// Register password reset routes only if it is enabled inside website settings.
if (settings('forgot_password')) {
    Route::get('password/remind', 'Auth\PasswordController@forgotPassword');
    Route::post('password/remind', 'Auth\PasswordController@sendPasswordReminder');
    Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
    Route::post('password/reset', 'Auth\PasswordController@postReset');
}

/**
 * Two-Factor Authentication
 */
if (settings('2fa.enabled')) {
    Route::get('auth/two-factor-authentication', [
        'as' => 'auth.token',
        'uses' => 'Auth\AuthController@getToken'
    ]);

    Route::post('auth/two-factor-authentication', [
        'as' => 'auth.token.validate',
        'uses' => 'Auth\AuthController@postToken'
    ]);
}

/**
 * Social Login
 */
Route::get('auth/{provider}/login', [
    'as' => 'social.login',
    'uses' => 'Auth\SocialAuthController@redirectToProvider',
    'middleware' => 'social.login'
]);

Route::get('auth/{provider}/callback', 'Auth\SocialAuthController@handleProviderCallback');

Route::get('auth/twitter/email', 'Auth\SocialAuthController@getTwitterEmail');
Route::post('auth/twitter/email', 'Auth\SocialAuthController@postTwitterEmail');

Route::group(['middleware' => 'auth'], function () {

    /**
     * Dashboard
     */

    Route::get('/dashboard', [
        'as' => 'dashboard',
        'uses' => 'DashboardController@index'
    ]);

    /**
     * User Profile
     */

    Route::get('profile', [
        'as' => 'profile',
        'uses' => 'ProfileController@index'
    ]);

    Route::get('profile/activity', [
        'as' => 'profile.activity',
        'uses' => 'ProfileController@activity'
    ]);

    Route::put('profile/details/update', [
        'as' => 'profile.update.details',
        'uses' => 'ProfileController@updateDetails'
    ]);

    Route::post('profile/avatar/update', [
        'as' => 'profile.update.avatar',
        'uses' => 'ProfileController@updateAvatar'
    ]);

    Route::post('profile/avatar/update/external', [
        'as' => 'profile.update.avatar-external',
        'uses' => 'ProfileController@updateAvatarExternal'
    ]);

    Route::put('profile/login-details/update', [
        'as' => 'profile.update.login-details',
        'uses' => 'ProfileController@updateLoginDetails'
    ]);

    Route::post('profile/two-factor/enable', [
        'as' => 'profile.two-factor.enable',
        'uses' => 'ProfileController@enableTwoFactorAuth'
    ]);

    Route::post('profile/two-factor/disable', [
        'as' => 'profile.two-factor.disable',
        'uses' => 'ProfileController@disableTwoFactorAuth'
    ]);

    Route::get('profile/sessions', [
        'as' => 'profile.sessions',
        'uses' => 'ProfileController@sessions'
    ]);

    Route::delete('profile/sessions/{session}/invalidate', [
        'as' => 'profile.sessions.invalidate',
        'uses' => 'ProfileController@invalidateSession'
    ]);

    /**
     * User Management
     */
    Route::get('user', [
        'as' => 'user.list',
        'uses' => 'UsersController@index'
    ]);

    Route::get('user/create', [
        'as' => 'user.create',
        'uses' => 'UsersController@create'
    ]);

    Route::post('user/create', [
        'as' => 'user.store',
        'uses' => 'UsersController@store'
    ]);

    Route::get('user/{user}/show', [
        'as' => 'user.show',
        'uses' => 'UsersController@view'
    ]);

    Route::get('user/{user}/edit', [
        'as' => 'user.edit',
        'uses' => 'UsersController@edit'
    ]);

    Route::put('user/{user}/update/details', [
        'as' => 'user.update.details',
        'uses' => 'UsersController@updateDetails'
    ]);

    Route::put('user/{user}/update/login-details', [
        'as' => 'user.update.login-details',
        'uses' => 'UsersController@updateLoginDetails'
    ]);

    Route::delete('user/{user}/delete', [
        'as' => 'user.delete',
        'uses' => 'UsersController@delete'
    ]);

    Route::post('user/{user}/update/avatar', [
        'as' => 'user.update.avatar',
        'uses' => 'UsersController@updateAvatar'
    ]);

    Route::post('user/{user}/update/avatar/external', [
        'as' => 'user.update.avatar.external',
        'uses' => 'UsersController@updateAvatarExternal'
    ]);

    Route::get('user/{user}/sessions', [
        'as' => 'user.sessions',
        'uses' => 'UsersController@sessions'
    ]);

    Route::delete('user/{user}/sessions/{session}/invalidate', [
        'as' => 'user.sessions.invalidate',
        'uses' => 'UsersController@invalidateSession'
    ]);

    Route::post('user/{user}/two-factor/enable', [
        'as' => 'user.two-factor.enable',
        'uses' => 'UsersController@enableTwoFactorAuth'
    ]);

    Route::post('user/{user}/two-factor/disable', [
        'as' => 'user.two-factor.disable',
        'uses' => 'UsersController@disableTwoFactorAuth'
    ]);

    /**
     * Roles & Permissions
     */

    Route::get('role', [
        'as' => 'role.index',
        'uses' => 'RolesController@index'
    ]);

    Route::get('role/create', [
        'as' => 'role.create',
        'uses' => 'RolesController@create'
    ]);

    Route::post('role/store', [
        'as' => 'role.store',
        'uses' => 'RolesController@store'
    ]);

    Route::get('role/{role}/edit', [
        'as' => 'role.edit',
        'uses' => 'RolesController@edit'
    ]);

    Route::put('role/{role}/update', [
        'as' => 'role.update',
        'uses' => 'RolesController@update'
    ]);

    Route::delete('role/{role}/delete', [
        'as' => 'role.delete',
        'uses' => 'RolesController@delete'
    ]);


    Route::post('permission/save', [
        'as' => 'permission.save',
        'uses' => 'PermissionsController@saveRolePermissions'
    ]);

    Route::resource('permission', 'PermissionsController');

    /**
     * Settings
     */

    Route::get('settings', [
        'as' => 'settings.general',
        'uses' => 'SettingsController@general',
        'middleware' => 'permission:settings.general'
    ]);

    Route::post('settings/general', [
        'as' => 'settings.general.update',
        'uses' => 'SettingsController@update',
        'middleware' => 'permission:settings.general'
    ]);

    Route::get('settings/auth', [
        'as' => 'settings.auth',
        'uses' => 'SettingsController@auth',
        'middleware' => 'permission:settings.auth'
    ]);

    Route::post('settings/auth', [
        'as' => 'settings.auth.update',
        'uses' => 'SettingsController@update',
        'middleware' => 'permission:settings.auth'
    ]);

// Only allow managing 2FA if AUTHY_KEY is defined inside .env file
    if (env('AUTHY_KEY')) {
        Route::post('settings/auth/2fa/enable', [
            'as' => 'settings.auth.2fa.enable',
            'uses' => 'SettingsController@enableTwoFactor',
            'middleware' => 'permission:settings.auth'
        ]);

        Route::post('settings/auth/2fa/disable', [
            'as' => 'settings.auth.2fa.disable',
            'uses' => 'SettingsController@disableTwoFactor',
            'middleware' => 'permission:settings.auth'
        ]);
    }

    Route::post('settings/auth/registration/captcha/enable', [
        'as' => 'settings.registration.captcha.enable',
        'uses' => 'SettingsController@enableCaptcha',
        'middleware' => 'permission:settings.auth'
    ]);

    Route::post('settings/auth/registration/captcha/disable', [
        'as' => 'settings.registration.captcha.disable',
        'uses' => 'SettingsController@disableCaptcha',
        'middleware' => 'permission:settings.auth'
    ]);

    Route::get('settings/notifications', [
        'as' => 'settings.notifications',
        'uses' => 'SettingsController@notifications',
        'middleware' => 'permission:settings.notifications'
    ]);

    Route::post('settings/notifications', [
        'as' => 'settings.notifications.update',
        'uses' => 'SettingsController@update',
        'middleware' => 'permission:settings.notifications'
    ]);

    /**
     * Activity Log
     */

    Route::get('activity', [
        'as' => 'activity.index',
        'uses' => 'ActivityController@index'
    ]);

    Route::get('activity/user/{user}/log', [
        'as' => 'activity.user',
        'uses' => 'ActivityController@userActivity'
    ]);

});


/**
 * Installation
 */

Route::get('install', [
    'as' => 'install.start',
    'uses' => 'InstallController@index'
]);

Route::get('install/requirements', [
    'as' => 'install.requirements',
    'uses' => 'InstallController@requirements'
]);

Route::get('install/permissions', [
    'as' => 'install.permissions',
    'uses' => 'InstallController@permissions'
]);

Route::get('install/database', [
    'as' => 'install.database',
    'uses' => 'InstallController@databaseInfo'
]);

Route::get('install/start-installation', [
    'as' => 'install.installation',
    'uses' => 'InstallController@installation'
]);

Route::post('install/start-installation', [
    'as' => 'install.installation',
    'uses' => 'InstallController@installation'
]);

Route::post('install/install-app', [
    'as' => 'install.install',
    'uses' => 'InstallController@install'
]);

Route::get('install/complete', [
    'as' => 'install.complete',
    'uses' => 'InstallController@complete'
]);

Route::get('install/error', [
    'as' => 'install.error',
    'uses' => 'InstallController@error'
]);


/**
 * Utable routes
 */
Route::get('/api/getFilesForField', 'TableController@getFilesForField')->name('getFilesForField');
Route::get('/api/getUTable', 'TableController@getUTable')->name('getUTable');
Route::post('/api/getSelectedTable', 'TableController@getSelectedTable')->name('getSelectedTable');
Route::get('/api/loadFilter', 'TableController@loadFilter')->name('loadFilter');
Route::get('/api/favoriteToggleTable', 'TableController@favoriteToggleTable')->name('favoriteToggleTable');
Route::get('/api/favoriteToggleRow', 'TableController@favoriteToggleRow')->name('favoriteToggleRow');
Route::get('/api/showHideColumnToggle', 'TableController@showHideColumnToggle')->name('showHideColumnToggle');
Route::get('/api/getDDLdatas', 'TableController@getDDLdatas')->name('getDDLdatas');
Route::get('/api/getRefDDL', 'TableController@getRefDDL')->name('getRefDDL');
Route::get('/api/getRightsDatas', 'TableController@getRightsDatas')->name('getRightsDatas');
Route::get('/api/addRightsDatas', 'TableController@addRightsDatas')->name('addRightsDatas');
Route::get('/api/updateRightsDatas', 'TableController@updateRightsDatas')->name('updateRightsDatas');
Route::get('/api/deleteRightsDatas', 'TableController@deleteRightsDatas')->name('deleteRightsDatas');
Route::get('/api/toggleAllrights', 'TableController@toggleAllrights')->name('toggleAllrights');
Route::get('/api/ajaxSearchUser', 'TableController@ajaxSearchUser')->name('ajaxSearchUser');
Route::get('/api/getFavoritesForTable', 'TableController@getFavoritesForTable')->name('getFavoritesForTable');
Route::get('/api/getDistinctData', 'TableController@getDistinctData')->name('getDistinctData');
Route::get('/api/changeOrder', 'TableController@changeOrder')->name('changeOrder');
Route::get('/api/changeSettingsRowOrder', 'TableController@changeSettingsRowOrder')->name('changeSettingsRowOrder');
Route::get('/api/settingsForCreateMySQL', 'AppController@showSettingsForCreateTableMySQL')->name('showSettingsForCreateTableMySQL');
Route::post('/api/settingsForCreate', 'AppController@showSettingsForCreateTable')->name('showSettingsForCreateTable');
Route::post('/api/createTableFromMenu', 'TableController@createTableFromMenu')->name('createTableFromMenu');
Route::post('/api/createTable', 'TableController@createTable')->name('createTable');
Route::post('/api/replaceTable', 'TableController@replaceTable')->name('replaceTable');
Route::post('/api/modifyTable', 'TableController@modifyTable')->name('modifyTable');
Route::post('/api/remoteTable', 'TableController@remoteTable')->name('remoteTable');
Route::post('/api/refTable', 'TableController@refTable')->name('refTable');
Route::group(['middleware' => 'database.change'], function () {
    Route::get('/api/menutree_addfolder', 'TableController@menutree_addfolder')->name('menutree_addfolder');
    Route::get('/api/menutree_renamefolder', 'TableController@menutree_renamefolder')->name('menutree_renamefolder');
    Route::get('/api/menutree_deletefolder', 'TableController@menutree_deletefolder')->name('menutree_deletefolder');
    Route::get('/api/menutree_movenode', 'TableController@menutree_movenode')->name('menutree_movenode');
    Route::get('/api/menutree_createlink', 'TableController@menutree_createlink')->name('menutree_createlink');
    Route::get('/api/menutree_removelink', 'TableController@menutree_removelink')->name('menutree_removelink');
    Route::get('/api/addTableRow', 'TableController@addTableRow')->name('addTableRow');
    Route::get('/api/updateTableRow', 'TableController@updateTableRow')->name('updateTableRow');
    Route::get('/api/deleteTableRow', 'TableController@deleteTableRow')->name('deleteTableRow');
    Route::get('/api/deleteAllTable', 'TableController@deleteTable')->name('deleteTable');
});

Route::post('/download', 'DownloadController@download')->name('downloader');

Route::get('/', 'AppController@landing')->name('landing');
Route::group(['middleware' => 'test.subdomain'], function () {
//    Route::get('/data', function () { return redirect( route('homepage') ); });
//    Route::get('/data/all', 'AppController@homepage')->name('homepage.all');
//    Route::get('/data/all/{tableName}', 'AppController@homepageTable')->name('homepage.table');
//    Route::get('/data/{group}', 'AppController@homepageGroup')->name('group');
//    Route::get('/data/{group}/{tableName}', 'AppController@homepageGroupedTable')->name('group.table');
    Route::get('/data', 'AppController@homepage')->name('homepage');
    Route::get('/data/{table}', 'AppController@homepageTable')->name('homepageTable')->where(['table' => '.+']);
    //Route::get('/file/{filepath}', 'AppController@getFile')->name('getFile')->where(['filepath' => '.+']);
});