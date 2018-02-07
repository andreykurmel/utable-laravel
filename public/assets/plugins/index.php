<!doctype html>
<html lang="en" style="position:relative;height: 100%;width: 100%;">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">
    
    <link href="home/assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">
    <link href="home/assets/css/font-awesome.min.css" rel="stylesheet" type="text/css">

    <title>Utable</title>
</head>
<body style="position:relative;height: 100%;width: 100%;">
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div id="navbar" class="navbar-collapse">
                <ul class="nav navbar-nav navbar-right" style="float: right;">
                    <li style="display: inline-block">
                        <a href="home/login">
                            <i class="fa fa-sign-in"></i>
                            Login
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    
    <div style="position: absolute;top: 40%;text-align: center;width: 100%;">
        <h1>UTable - your table data in one place</h1>
    </div>

    <!-- Login form -->
    <div ng-show="showLoginForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);">
        <div class="auth" style="font-size: 14px;">
            <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                <div class="form-wrap" id="login">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <img src="home/assets/img/vanguard-logo.png" alt="Utable">
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
                            <a href="javascript:void(0)" ng-click="showLoginForm=false;showRegisterForm=true" style="float: right;color: #337ab7;">@lang('app.dont_have_an_account')</a>
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
    <div ng-show="showLoginForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;" ng-click="showLoginForm = false"></div>

    <!-- Register form -->
    <div ng-show="showRegisterForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);">
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
                            <a href="javascript:void(0)" ng-click="showRegisterForm=false;showLoginForm=true" style="color: #337ab7;">Already have account?</a>
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
    <div ng-show="showRegisterForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;" ng-click="showRegisterForm = false"></div>

    <script></script>
</body>
</html>
