@extends('layouts.table_app')

@section('content')
    <div id="stars_appears" style="position: absolute;top: 50px;left: 0;text-align: center;right: 0;bottom: 0;background-color: #222;">
        <a href="{{ route('homepage') }}">
            <h1 style="position: absolute;z-index: 100;top: 40%;left: calc(50% - 350px);">UTable - your table data in one place</h1>
        </a>
    </div>
@endsection

@push('scripts')
<script>
    authUser = {{ Auth::user() ? Auth::user()->id : 0 }};
    table_meta = JSON.parse('{!! json_encode($tableMeta) !!}');
    public_tables = JSON.parse('{!! json_encode($public_tables) !!}');
</script>
@endpush