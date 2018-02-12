<!doctype html>
<html lang="en" style="position:relative;height: 100%;width: 100%;">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('page-title') | {{ settings('app_name') }}</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">

    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="{{ url('assets/img/icons/apple-touch-icon-144x144.png') }}" />
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="{{ url('assets/img/icons/apple-touch-icon-152x152.png') }}" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-32x32.png') }}" sizes="32x32" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-16x16.png') }}" sizes="16x16" />
    <meta name="application-name" content="{{ settings('app_name') }}"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="{{ url('assets/img/icons/mstile-144x144.png') }}" />

    {!! HTML::style('css/vendor.css') !!}
    {!! HTML::style('assets/css/app.css') !!}
    {!! HTML::style('css/table.css') !!}

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
</head>
<body style="position:relative;height: 100%;width: 100%;">
    <nav class="navbar navbar-default" style="position: fixed;width: 100%;">
        <div class="container-fluid">
            <div id="navbar" class="navbar-collapse">
                <ul class="nav navbar-nav navbar-left" style="float: left;">
                    <li style="display: inline-block">
                        <a href="{{ route("homepage") }}" style="padding: 10px 0;height: 30px;">
                            <img src="{{ url('assets/img/vanguard-logo-no-text.png') }}" alt="{{ settings('app_name') }}" style="height: 30px;">
                        </a>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right" style="float: right;">
                    @if(Auth::user())
                        <li style="display: inline-block">
                            <a href="{{ route('profile') }}">
                                <i class="fa fa-user"></i>
                                {{ Auth::user()->username }}
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
                            <a href="javascript:void(0)" onclick="$('.showLoginForm').show()">
                                <i class="fa fa-sign-in"></i>
                                @lang('app.login')
                            </a>
                        </li>
                    @endif
                </ul>
            </div>
        </div>
    </nav>
    
    <div style="position: absolute;top: 40%;text-align: center;width: 100%;">
        @if($public_tables)
            @foreach($public_tables as $tb)
                <a href="{{ route('homepage.table', ['group'=>'crown', 'tableName'=>$tb->db_tb]) }}"><h1>{{ $tb->name }}</h1></a>
            @endforeach
        @else
            <a href="{{ route('homepage') }}"><h1>No data available</h1></a>
        @endif
    </div>

    <!-- Login form -->
    <div class="showLoginForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px); display: none;">
        <div class="auth" style="font-size: 14px;">
            <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                <div class="form-wrap" id="login">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <img src="assets/img/vanguard-logo.png" alt="Utable">
                    </div>
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
                            <a href="<?= url('password/remind') ?>" class="forgot" style="top: 9px;">@lang('app.i_forgot_my_password')</a>
                            @endif
                        </div>
                        <div style="margin-bottom:20px;">

                            @if (settings('remember_me'))
                            <input type="checkbox" name="remember" id="remember" value="1"/>
                            <label for="remember" style="font-weight: 400;">@lang('app.remember_me')</label>
                            @endif

                            @if (settings('reg_enabled'))
                            <a href="javascript:void(0)" onclick="$('.showLoginForm').hide();$('.showRegisterForm').show()" style="float: right;color: #337ab7;">@lang('app.dont_have_an_account')</a>
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
    <div class="showLoginForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000; display: none;" onclick="$('.showLoginForm').hide()"></div>

    <!-- Register form -->
    <div class="showRegisterForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px); display: none;">
        <div class="auth" style="font-size: 14px;">
            <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                <div class="form-wrap">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <img src="{{ url('assets/img/vanguard-logo.png') }}" alt="{{ settings('app_name') }}">
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
                        <div class="form-group input-icon">
                            <i class="fa fa-lock"></i>
                            <input type="password" name="password" class="form-control" placeholder="@lang('app.password')">
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
                            <a href="javascript:void(0)" onclick="$('.showRegisterForm').hide();$('.showLoginForm').show()" style="color: #337ab7;">Already have account?</a>
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
    <div class="showRegisterForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000; display: none;" onclick="showRegisterForm = false"></div>


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

    {{-- Login scripts --}}
    {!! HTML::script('assets/js/as/login.js') !!}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\LoginRequest', '#login-form') !!}

    {{-- Register scripts --}}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\RegisterRequest', '#registration-form') !!}
</body>
</html>
