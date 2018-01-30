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
    .js(
        [
            'resources/assets/js/app.js',
            'resources/assets/js/products-userSearch.js',
            'resources/assets/js/feedback_form.js',
            'resources/assets/js/videos/all.js',
            'resources/assets/js/message/showTopic.js'
        ],
        'public/js/app.js'
    )
    .styles([
        'resources/assets/ui-lib/css/reset.css',
        'resources/assets/ui-lib/css/style.css',
        'resources/assets/ui-lib/css/colors.css',
        'resources/assets/ui-lib/css/styles/modal.css',
        'resources/assets/ui-lib/css/styles/form.css',
        'resources/assets/ui-lib/css/tables.css',
        'resources/assets/ui-lib/css/datatable.css',
        'resources/assets/ui-lib/css/480.css',
        'resources/assets/ui-lib/css/768.css',
        'resources/assets/ui-lib/css/992.css',
        'resources/assets/ui-lib/css/1200.css',
        'resources/assets/css/custom.css',
        'resources/assets/css/jquery.mCustomScrollbar.css',
        'resources/assets/css/bootstrap-datetimepicker.min.css'
    ], 'public/css/all.css');
