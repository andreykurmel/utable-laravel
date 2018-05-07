@extends('layouts.table_app')

@section('content')
    <div id="stars_appears" style="position: absolute;top: 50px;left: 0;text-align: center;right: 0;bottom: 0;background-color: #222;">
        <a href="{{ route('homepage') }}">
            <h1 style="position: absolute;z-index: 100;top: 40%;left: calc(50% - 490px);width: 980px;">
            TaBuDa</h1>
            <h2 style="position: absolute;z-index: 100;top: calc(40% + 20px);left: calc(50% - 490px);">
            - a space for managing and sharing tabulated data.<br>
            - a platform facilitating collaboration of work with tabulated data.</h2>
        </a>
    </div>
@endsection

@push('scripts')
<script>
    authUser = {{ Auth::user() ? Auth::user()->id : 0 }};
    table_meta = JSON.parse('{!! json_encode($tableMeta) !!}');
    public_tables = JSON.parse('{!! json_encode($public_tables) !!}');

    var col_stars = 20, speed = 3, i = 0;
    $(document).ready(function () {
        var idx = 0, max = public_tables.length;
        if (public_tables) {
            setInterval(function() {
                add_star(idx);

                idx++;
                if (idx == max) idx = 0;
            }, (speed*1000)/col_stars);

            /*var idx = 0, max = public_tables.length, eh = $(elem).height(), ew = $(elem).width();
            for (var i = 0; i < col_stars; i++) {
                var rleft = Math.random()*ew;
                var rtop = Math.random()*eh;

                setTimeout(add_star(elem, idx, rtop, rleft), (rleft/ew)*speed*1000);

                idx++;
                if (idx == max) idx = 0;
            }*/
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
</script>
@endpush