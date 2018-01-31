<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page Not Found</title>

    {!! HTML::style('assets/css/bootstrap.min.css') !!}

    <style>
        body { padding-top: 100px; }
        h1 { font-size: 62px; }

        @media (max-width: 768px) {
            body { padding-top: 50px; }
            h1 { font-size: 50px; }
        }
    </style>
</head>

<body>

<div class="container">

    <div class="row">
        <div class="col-md-6 col-md-push-3">
            <div class="text-center">
                    <img src="{{ url('assets/img/vanguard-logo-no-text.png') }}" alt="Vanguard" class="logo">
                <h1>Oops, 404!</h1>
                <br />
                <p>
                    The page you requested could not be found, either contact your webmaster
                    or try again. Use your browser's <strong>Back</strong> button to navigate to the page
                    you have previously come from.
                </p>

                @if (Auth::check())
                    <p><strong>Or you could just press this neat little button:</strong></p>
                    <a href="{{  route('dashboard') }}" class="btn btn-large btn-info">
                        <i class="glyphicon glyphicon-home"></i> Go To Dashboard
                    </a>
                @endif
            </div>
        </div>
    </div>

</div>

</body>
</html>