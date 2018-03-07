@extends('layouts.table_app')

@section('content')
    <form method="post" action="{{ route('createTable') }}">
        <input type="hidden" value="<?= csrf_token() ?>" name="_token">
        <input type="hidden" name="with_headers" value="{{ $with_headers }}">
        <input type="hidden" name="data_csv" value="{{ $data_csv }}">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <h1>Setings for new table:</h1>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-xs-6">
                    <div class="form-group">
                        <label>Table name:</label>
                        <input type="text" class="form-control" name="filename" value="{{ $filename }}">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-12">
                    <div class="form-group">
                        <table class="table table-striped">
                            <tr>
                                <th>Header</th>
                                <th>Field</th>
                                <th>Type</th>
                                <th>Max Size</th>
                                <th>Default</th>
                                <th>Required</th>
                            </tr>
                            @foreach($headers as $hdr)
                                <tr>
                                    <td>
                                        <input type="text" class="form-control" name="columns[{{ $loop->index }}][header]" value="{{ $with_headers ? $hdr['header'] : '' }}">
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="columns[{{ $loop->index }}][field]" value="{{ $with_headers ? $hdr['field'] : '' }}">
                                    </td>
                                    <td>
                                        <select class="form-control" name="columns[{{ $loop->index }}][type]" value="int">
                                            <option value="int">Integer</option>
                                            <option value="str">String</option>
                                            <option value="date">Date</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="number" class="form-control" name="columns[{{ $loop->index }}][size]">
                                    </td>
                                    <td>
                                        <input type="text" class="form-control" name="columns[{{ $loop->index }}][default]">
                                    </td>
                                    <td>
                                        <input type="checkbox" class="form-control" name="columns[{{ $loop->index }}][required]">
                                    </td>
                                </tr>
                            @endforeach
                        </table>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-12">
                    <div class="form-group">
                        <input type="submit" class="btn btn-success" value="Create">
                        <a href="{{ route('homepage') }}" class="btn btn-default">Cancel</a>
                    </div>
                </div>
            </div>
        </div>
    </form>
@endsection