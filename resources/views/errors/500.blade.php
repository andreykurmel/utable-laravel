<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Whoops, something went wrong...</title>

    {!! HTML::style('assets/css/bootstrap.min.css') !!}

    <style>
        body { padding-top: 100px; }
        h1 { font-size: 34px;
            margin-top: 40px;
        }

        @media (max-width: 768px) {
            body { padding-top: 50px; }
        }
    </style>
</head>

<body>

<div class="container">

    <div class="row">
        <div class="col-md-6 col-md-push-3">
            <div class="text-center">
                    <img src="{{ url('assets/img/vanguard-logo-no-text.png') }}" alt="{{ settings('app_name') }}" class="logo">
                <h1>Whoops, something went wrong! :(</h1>
                <br />
                <p>
                    Something went wrong and we could not proceed... Please try again or contact website owner.
                </p>
            </div>
        </div>
    </div>

</div>

</body>
</html>