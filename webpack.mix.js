let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

 mix.js('resources/assets/js/app.js', 'public/js')
     .sass('resources/assets/sass/app.scss', 'public/css')
     .styles([
        'resources/assets/css/bootstrap.min.css',
        'resources/assets/css/font-awesome.min.css',
        'resources/assets/css/metisMenu.css',
        'resources/assets/css/sweetalert.css',
        'resources/assets/css/bootstrap-social.css',
        'resources/assets/css/bootstrap-datetimepicker.min.css'
     ],
         'public/css/vendor.css')
     .styles([
        'resources/assets/css/table/jquery.mCustomScrollbar.css',
        'resources/assets/css/table/custom_css.css',
        'resources/assets/css/table/reset.css',
        'resources/assets/css/table/style.css',
        'resources/assets/css/table/colors.css',
        'resources/assets/css/table/modal.css',
        'resources/assets/css/table/form.css',
        'resources/assets/css/table/tables.css',
        'resources/assets/css/table/datatable.css',
        'resources/assets/css/table/480.css',
        'resources/assets/css/table/768.css',
        'resources/assets/css/table/992.css',
        'resources/assets/css/table/1200.css',
        'resources/assets/css/table/additional.css'
     ],
         'public/css/table.css')
     /*.js([
        'resources/assets/js/jquery-2.1.4.min.js',
        'resources/assets/js/bootstrap.min.js',
        'resources/assets/js/bootstrap-datetimepicker.min.js',
        'resources/assets/js/moment.min.js',
        'resources/assets/js/metisMenu.min.js',
        'resources/assets/js/sweetalert.min.js',
        'resources/assets/js/delete.handler.js',
        'resources/assets/js/js.cookie.js',
        'resources/assets/js/jsvalidation.min.js'
     ],
         'public/js/vendor.js')*/
     /*.js([
        'resources/assets/js/table/jquery.mCustomScrollbar.concat.min.js',
        'resources/assets/js/table/lodash.min.js',
        'resources/assets/js/table/modernizr.custom.js',
        'resources/assets/js/table/developr.auto-resizing.js',
        'resources/assets/js/table/developr.modal.js',
        'resources/assets/js/table/developr.input.js',
        'resources/assets/js/table/developr.scroll.js',
        'resources/assets/js/table/angular-filter.min.js',
        'resources/assets/js/table/route.js',
        'resources/assets/js/table/API.js',
        'resources/assets/js/table/mainController.js'
     ],
         'public/js/table.js')*/;