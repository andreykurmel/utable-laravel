<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Be Right Back</title>

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
                <img src="{{ url('assets/img/vanguard-logo-no-text.png') }}" alt="Vanguard">
                <h1>Be Right Back.</h1>
                <br>
                <p class="lead">Application is currently being updated. <br> Please check back in few minutes.</p>
            </div>
        </div>
    </div>

</div>

</body>
</html>