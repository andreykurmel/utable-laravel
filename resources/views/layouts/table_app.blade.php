<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Table Data Place</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">

    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-32x32.png') }}" sizes="32x32" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-16x16.png') }}" sizes="16x16" />
    <meta name="application-name" content="{{ settings('app_name') }}"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="{{ url('assets/img/icons/mstile-144x144.png') }}" />

    {!! HTML::style('css/vendor.css') !!}
    {!! HTML::style('assets/css/app.css') !!}
    {!! HTML::style('css/table.css') !!}
    {!! HTML::style('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/css/select2.min.css') !!}

    <style>
        #pswd_info {
            display:none;

            position:absolute;
            top: 45px;
            left: 70px;
            width:250px;
            padding:15px;
            background:#fefefe;
            font-size:.875em;
            border-radius:5px;
            box-shadow:0 1px 3px #ccc;
            border:1px solid #ddd;
        }
        #pswd_info h4 {
            margin:0 0 10px 0;
            padding:0;
            font-weight:normal;
        }
        #pswd_info::before {
            content: "\25B2";
            position:absolute;
            top:-12px;
            left:45%;
            font-size:14px;
            line-height:14px;
            color:#ddd;
            text-shadow:none;
            display:block;
        }
        .invalid-i {
            background:url({{ url('img/icons/cross.png') }}) no-repeat 0 50%;
            padding-left:22px;
            line-height:24px;
            color:#ec3f41;
        }
        .valid-i {
            background:url({{ url('img/icons/accept.png') }}) no-repeat 0 50%;
            padding-left:22px;
            line-height:24px;
            color:#3a7d34;
        }
        .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
            line-height: 1em;
            vertical-align: middle;
            overflow: hidden;
        }

        #tbHeaders_header .over,
        #tbSettingsHeaders_head .over {
            border-left: 3px dashed #000;;
        }

        #tbSettingsData_body button.over {
            border: 3px dashed #000;;
        }

        #tbSettingsData_body td.over {
            border-top: 3px dashed #000;;
        }

        #import_view .row label,
        #import_view .row .col-xs-3 {
            height: 34px;
            display: flex;
            align-items: center;
        }

        #import_view .form-control {
            height: initial;
        }

        #import_view tbody > tr > td {
            padding: 0;
            text-align: center;
        }

        #import_view .container {
            max-width: 1170px;
            width: 100%;
        }
    </style>

    @stack('styles')

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
</head>
<body class="clearfix with-menu" style="display: none;">

<nav class="navbar navbar-default">
    <div class="container-fluid">
        <div id="navbar" class="navbar-collapse">
            <ul class="nav navbar-nav navbar-left" style="float: left;">
                <li style="display: inline-block">
                    <a href="{{ route("landing") }}" style="padding: 10px 0;height: 30px;">
                        <img src="{{ url('assets/img/tdp-logo-no-text.png') }}" alt="{{ settings('app_name') }}" style="height: 30px;">
                    </a>
                </li>
                <li style="display: inline-block">
                    <a href="{{ route("homepage") }}" class="btn btn-default" style="margin: 10px;padding: 4px 7px;font-size: 1.5em;">
                        <i class="fa fa-home"></i>
                    </a>
                </li>
            </ul>
            <ul class="nav navbar-nav navbar-right" style="float: right;">
                @if(Auth::user())
                    <li style="display: inline-block">
                        <a href="{{ route('profile') }}">
                            <i class="fa fa-user"></i>
                            {{ Auth::user()->first_name ? Auth::user()->first_name." ".Auth::user()->last_name : Auth::user()->username }}
                        </a>
                    </li>
                    <li style="display: inline-block">
                        <a href="{{ route('auth.logout') }}">
                            <i class="fa fa-sign-out"></i>
                            @lang('app.logout')
                        </a>
                    </li>
                @else
                    <li style="display: inline-block">
                        <a href="javascript:void(0)" onclick="$('.loginForm').show()">
                            <i class="fa fa-sign-in"></i>
                            @lang('app.login')
                        </a>
                    </li>
                @endif
            </ul>
        </div>
    </div>
</nav>

@yield('content')

{{-- Login form --}}
<div class="loginForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);{{ $errors->any() ? '' : 'display: none;' }}">
    <div class="auth" style="font-size: 14px;">
        <div class="auth-form" style="padding: 15px 15px 5px 15px;">
            <div class="form-wrap" id="login">
                <div style="text-align: center; margin-bottom: 25px;">
                    <img src="{{ url('assets/img/tdp-logo.png') }}" alt="{{ settings('app_name') }}">
                </div>

                {{-- This will simply include partials/messages.blade.php view here --}}
                @include('partials/messages')

                <form role="form" action="<?= url('login') ?>" method="POST" id="login-form" autocomplete="off">
                    <input type="hidden" value="<?= csrf_token() ?>" name="_token">

                    @if (Input::has('to'))
                        <input type="hidden" value="{{ Input::get('to') }}" name="to">
                    @endif

                    <div class="form-group input-icon">
                        <label for="username" class="sr-only">@lang('app.email_or_username')</label>
                        <i class="fa fa-user"></i>
                        <input type="email" name="username" class="form-control" placeholder="@lang('app.email_or_username')" style="border-radius: 4px;">
                    </div>
                    <div class="form-group password-field input-icon">
                        <label for="password" class="sr-only">@lang('app.password')</label>
                        <i class="fa fa-lock"></i>
                        <input type="password" name="password" class="form-control" placeholder="@lang('app.password')">
                        @if (settings('forgot_password'))
                            <a href="javascript:void(0)" onclick="$('.loginForm').hide();$('.passResetForm').show();" class="forgot" style="top: 9px;">@lang('app.i_forgot_my_password')</a>
                        @endif
                    </div>
                    <div style="margin-bottom:20px;">

                        @if (settings('remember_me'))
                            <input type="checkbox" name="remember" id="remember" value="1"/>
                            <label for="remember" style="font-weight: 400;">@lang('app.remember_me')</label>
                        @endif

                        @if (settings('reg_enabled'))
                            <a href="javascript:void(0)" onclick="$('.loginForm').hide();$('.registerForm').show();" style="float: right;color: #337ab7;">@lang('app.dont_have_an_account')</a>
                        @endif
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-custom btn-lg btn-block" id="btn-login">
                            @lang('app.log_in')
                        </button>
                    </div>

                </form>

                @include('auth.social.buttons')

            </div>
            <div class="row">
                <div class="col-xs-12" style="text-align: center;font-size: 12px;">
                    <p>@lang('app.copyright') © - {{ settings('app_name') }} {{ date('Y') }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="loginForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;{{ $errors->any() ? '' : 'display: none;' }}" onclick="$('.loginForm').hide()"></div>

{{-- Register form --}}
<div class="registerForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);display: none;">
    <div class="auth" style="font-size: 14px;">
        <div class="auth-form" style="padding: 15px 15px 5px 15px;">
            <div class="form-wrap">
                <div style="text-align: center; margin-bottom: 25px;">
                    <img src="{{ url('assets/img/tdp-logo.png') }}" alt="{{ settings('app_name') }}">
                </div>

                @include('partials/messages')

                <form role="form" action="<?= url('register') ?>" method="post" id="registration-form" autocomplete="off">
                    <input type="hidden" value="<?= csrf_token() ?>" name="_token">
                    <div class="form-group input-icon">
                        <i class="fa fa-at"></i>
                        <input type="email" name="email" class="form-control" placeholder="@lang('app.email')" value="{{ old('email') }}">
                    </div>
                    <div class="form-group input-icon">
                        <i class="fa fa-user"></i>
                        <input type="text" name="username" class="form-control" placeholder="@lang('app.username')"  value="{{ old('username') }}">
                    </div>
                    <div class="form-group input-icon" style="position: relative;">
                        <i class="fa fa-lock"></i>
                        <input id="pswd_target_input" type="password" name="password" class="form-control" placeholder="@lang('app.password')">
                        <div id="pswd_info">
                            <h4>Password must meet the following requirements:</h4>
                            <ul>
                                <li id="pswd_letter" class="invalid">At least <strong>one letter</strong></li>
                                <li id="pswd_capital" class="invalid">At least <strong>one capital letter</strong></li>
                                <li id="pswd_number" class="invalid">At least <strong>one number</strong></li>
                                <li id="pswd_special" class="invalid">At least <strong>one special character</strong></li>
                                <li id="pswd_length" class="invalid">Be at least <strong>6 characters</strong></li>
                            </ul>
                        </div>
                    </div>
                    <div class="form-group input-icon">
                        <i class="fa fa-lock"></i>
                        <input type="password" name="password_confirmation" id="password_confirmation" class="form-control" placeholder="@lang('app.confirm_password')">
                    </div>

                    @if (settings('tos'))
                        <div class="form-group">
                            <div class="checkbox">
                                <input type="checkbox" name="tos" id="tos" value="1"/>
                                <label for="tos">@lang('app.i_accept') <a href="#tos-modal" data-toggle="modal">@lang('app.terms_of_service')</a></label>
                            </div>
                        </div>
                    @endif

                    {{-- Only display captcha if it is enabled --}}
                    @if (settings('registration.captcha.enabled'))
                        <div class="form-group">
                            {!! app('captcha')->display() !!}
                        </div>
                    @endif
                    {{-- end captcha --}}

                    <div class="form-group">
                        <button type="submit" class="btn btn-custom btn-lg btn-block" id="btn-register">
                            @lang('app.register')
                        </button>
                    </div>

                    <div style="margin-bottom:20px;text-align:center;">
                        <a href="javascript:void(0)" onclick="$('.registerForm').hide();$('.loginForm').show();" style="color: #337ab7;">Already have account?</a>
                    </div>
                </form>

                @include('auth.social.buttons')

            </div>
            <div class="row">
                <div class="col-xs-12" style="text-align: center;font-size: 12px;">
                    <p>@lang('app.copyright') © - {{ settings('app_name') }} {{ date('Y') }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="registerForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.registerForm').hide()"></div>

{{-- Password Reset form --}}
<div class="passResetForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 180px);display: none;">
    <div class="auth" style="font-size: 14px;">
        <div class="auth-form" style="padding: 15px 15px 5px 15px;">
            <div class="form-wrap">
                <h1>@lang('app.forgot_your_password')</h1>

                @include('partials.messages')

                <form role="form" action="<?= url('password/remind') ?>" method="POST" id="remind-password-form" autocomplete="off">
                    <input type="hidden" value="<?= csrf_token() ?>" name="_token">

                    <div class="form-group password-field input-icon">
                        <label for="password" class="sr-only">@lang('app.email')</label>
                        <i class="fa fa-at"></i>
                        <input type="email" name="email" id="email" class="form-control" placeholder="@lang('app.your_email')">
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn btn-custom btn-lg btn-block" id="btn-reset-password">
                            @lang('app.reset_password')
                        </button>
                        <a href="javascript:void(0)" onclick="$('.passResetForm').hide();$('.loginForm').show();" class="btn btn-default btn-lg btn-block">
                            Cancel
                        </a>
                    </div>
                </form>

            </div>
            <div class="row">
                <div class="col-xs-12" style="text-align: center;font-size: 12px;">
                    <p>@lang('app.copyright') © - {{ settings('app_name') }} {{ date('Y') }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="passResetForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.passResetForm').hide()"></div>

{!! HTML::script('assets/js/lib/modernizr.custom.js') !!}
{!! HTML::script('assets/js/jquery-3.2.1.min.js') !!}
{!! HTML::script('assets/js/moment.min.js') !!}
{!! HTML::script('assets/js/bootstrap.min.js') !!}
{!! HTML::script('assets/js/bootstrap-datetimepicker.min.js') !!}
{!! HTML::script('assets/js/metisMenu.min.js') !!}
{!! HTML::script('assets/js/sweetalert.min.js') !!}
{!! HTML::script('assets/js/delete.handler.js') !!}
{!! HTML::script('assets/plugins/js-cookie/js.cookie.js') !!}
{!! HTML::script('vendor/jsvalidation/js/jsvalidation.js') !!}
<script type="text/javascript">
    $.ajaxSetup({
        headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') }
    });
</script>

{!! HTML::script('https://maps.googleapis.com/maps/api/js?key=AIzaSyAGaaPdBTpcf_z_lLmhwxNwHESJhFQ4MGM&hl=en&language=en') !!}
{!! HTML::script('assets/js/lib/jquery.mCustomScrollbar.concat.min.js') !!}
{!! HTML::script('assets/js/lib/lodash.min.js') !!}
{!! HTML::script('assets/js/lib/setup.js') !!}
{!! HTML::script('assets/js/lib/developr.auto-resizing.js') !!}
{!! HTML::script('assets/js/lib/developr.modal.js') !!}
{!! HTML::script('assets/js/lib/developr.input.js') !!}
{!! HTML::script('assets/js/lib/developr.scroll.js') !!}
{!! HTML::script('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js') !!}
{!! HTML::script('assets/js/lib/table.js') !!}

{{-- Login scripts --}}
{!! HTML::script('assets/js/as/login.js') !!}
{!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\LoginRequest', '#login-form') !!}

{{-- Register scripts --}}
{!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\RegisterRequest', '#registration-form') !!}

{{-- Reset Pass scripts --}}
{!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\PasswordRemindRequest', '#remind-password-form') !!}

@stack('scripts')
</body>
</html>
