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

    var col_stars = 20, speed = 3;
    $(document).ready(function () {
        var elem = $('#stars_appears');
        if (elem && public_tables) {
            var idx = 0, max = public_tables.length, eh = $(elem).height(), ew = $(elem).width();
            for (var i = 0; i < col_stars; i++) {
                var rleft = Math.random()*ew;
                var rtop = Math.random()*eh;

                setTimeout(add_star(elem, idx, rtop, rleft), Math.random()*speed*1000);

                idx++;
                if (idx == max) idx = 0;
            }
        }
    });

    function add_star(elem, idx, top, left) {
        $(elem).append('<div style="width: '+(10*public_tables[idx].name.length)+'px;text-align: center;position:absolute;top:'+top+'px;left:'+left+'px;">' +
            '<a style="color: #eee;animation:move-twink-back '+speed+'s linear infinite;" href="'+public_tables[idx].li+'">'+public_tables[idx].name+'</a>' +
            '</div>');
    }
</script>
@endpush