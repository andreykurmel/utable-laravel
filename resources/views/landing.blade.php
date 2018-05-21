@extends('layouts.table_app')

@section('content')
    <div id="stars_appears" style="position: absolute;top: 50px;left: 0;text-align: center;right: 0;bottom: 0;background-color: #222;">
        <a id="header_a" class="_hide" href="{{ route('homepage') }}" style="display: block;position: absolute;z-index: 100;top: 50%;left: 50%;transform: translate(-50%, -50%);">
            <h1 style="margin: 0px;">TaBuDa</h1>
            <h2 style="margin: 5px 0;">
            - a space for managing and sharing -<br>
            - a platform facilitating collaboration of work with -</h2>
            <h1 style="margin: 0px;">TaBulated Data.</h1>
        </a>
        <div style="position:absolute; bottom: 25px; left: 0; right: 0;text-align: center;">
            <button id="about_btn" class="btn btn-default btn-lg" style="margin-left: 15px;border: 3px solid #ccc;" onclick="if($('#about_div').is(':visible')) {$('._hide').hide(); $('#header_a').show();} else {$('._hide').hide(); $('#about_div').show();}">About</button>

            <!--button id="features_btn" class="btn btn-default btn-lg" style="margin-left: 15px;border: 3px solid #ccc;" onclick="if($('#features_div').is(':visible')) {$('._hide').hide(); $('#header_a').show();} else {$('._hide').hide(); $('#features_div').show();}">Features</button-->

            <button id="contact_btn" class="btn btn-default btn-lg" style="margin-left: 15px;border: 3px solid #ccc;" onclick="if($('#contact_div').is(':visible')) {$('._hide').hide(); $('#header_a').show();} else {$('._hide').hide(); $('#contact_div').show();}">Contact Us</button>
        </div>

        <div id="about_div" class="_hide" style="position:absolute; top: 200px; right: 100px; left: 100px; bottom: 200px; background-color: rgba(255,255,255,0.8); opacity: 0.8; border: 3px solid #ccc; border-radius: 5px; display: none;">
            <div style="width: 100%; height: 100%; display: flex; align-items: center;justify-content: center;">
                ABOUT
            </div>
        </div>

        <div id="features_div" class="_hide" style="position:absolute; top: 200px; right: 100px; left: 100px; bottom: 200px; background-color: rgba(255,255,255,0.8); opacity: 0.8; border: 3px solid #ccc; border-radius: 5px; display: none;">
            <div style="width: 100%; height: 100%; display: flex; align-items: center;justify-content: center;">
                FEATURES
            </div>
        </div>

        <div id="contact_div" class="_hide" style="position:absolute; top: 200px; right: 100px; left: 100px; bottom: 200px; background-color: rgba(255,255,255,0.8); opacity: 0.8; border: 3px solid #ccc; border-radius: 5px; display: none;">
            <div style="width: 100%; height: 100%; display: flex; align-items: center;justify-content: center;">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-offset-3 col-lg-6 col-md-offset-1 col-md-10" style="padding: 20px 30px;border: 3px solid #222; border-radius: 5px;">
                            <h3 class="contact-title">Contact</h3>
                            <div class="line-block"></div>
                            <form class="contact-form" id="contact-form" action="{{ route('sendEmail') }}" method="post" enctype="multipart/form-data">
                                {{ csrf_field() }}
                                <div class="form-group">
                                    <input class="form-control" type="text" name="email" placeholder="Email" id="contact_email">
                                </div>
                                <div class="form-group">
                                    <textarea placeholder="Message" class="form-control" name="msg" rows="3" id="contact_message"></textarea>
                                </div>
                                <div class="form-group">
                                    <input class="form-control" type="file" name="attach" placeholder="Attachment" id="contact_attach">
                                </div>
                                <button type="submit" class="btn btn-success">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@push('scripts')
<script>
    authUser = {{ Auth::user() ? Auth::user()->id : 0 }};
    table_meta = JSON.parse('{!! json_encode($tableMeta) !!}');
    public_tables = JSON.parse('{!! json_encode($public_tables) !!}');
    view_id = '{{ $view_id ? $view_id : '' }}';

    var col_stars = 20, speed = 3, i = 0;
    $(document).ready(function () {
        var idx = 0, max = public_tables.length;
        if (public_tables) {
            setInterval(function() {
                add_star(idx);

                idx++;
                if (idx == max) idx = 0;
            }, (speed*1000)/col_stars);
        }
    });

    function add_star(idx) {
        var left = Math.random()*100;
        var top = Math.random()*100;
        console.log();
        var wi = (10*public_tables[idx].name.length)+'px';
        $('#stars_appears').append('<div id="star_'+i+'" style="width: '+wi+';text-align: center;position:absolute;top:calc('+top+'% - 50px);left:calc('+left+'% - '+wi+');">' +
            '<a style="animation:move-twink-back '+speed+'s linear;font-size: 0;color: #eee;" href="'+public_tables[idx].li+'">'+public_tables[idx].name+'</a>' +
            '</div>');
        var star = $('#star_'+i);
        i++;
        setTimeout(function() {
            $(star).remove();
        }, speed*1000);
    }

    $(document).on('click', function (e) {console.log("!");
        if ($('#about_div').is(':visible') && e.target.id != 'about_div' && e.target.id != 'about_btn') {
            $('#about_div').hide();
            $('#header_a').show();
        }
        if ($('#features_div').is(':visible') && e.target.id != 'features_div' && e.target.id != 'features_btn') {
            $('#features_div').hide();
            $('#header_a').show();
        }
        if ($('#contact_div').is(':visible') && e.target.id != 'contact_div' && e.target.id != 'contact_btn') {
            $('#contact_div').hide();
            $('#header_a').show();
        }
    });
</script>
@endpush