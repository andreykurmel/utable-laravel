<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Table Data Place</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">

    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-32x32.png') }}" sizes="32x32" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-16x16.png') }}" sizes="16x16" />
    <meta name="application-name" content="{{ settings('app_name') }}"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="{{ url('assets/img/icons/mstile-144x144.png') }}" />

    {!! HTML::style('css/vendor.css') !!}
    {!! HTML::style('assets/css/app.css') !!}
    {!! HTML::style('css/table.css') !!}
    {!! HTML::style('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/css/select2.min.css') !!}

    <style>
        #pswd_info {
            display:none;

            position:absolute;
            top: 45px;
            left: 70px;
            width:250px;
            padding:15px;
            background:#fefefe;
            font-size:.875em;
            border-radius:5px;
            box-shadow:0 1px 3px #ccc;
            border:1px solid #ddd;
        }
        #pswd_info h4 {
            margin:0 0 10px 0;
            padding:0;
            font-weight:normal;
        }
        #pswd_info::before {
            content: "\25B2";
            position:absolute;
            top:-12px;
            left:45%;
            font-size:14px;
            line-height:14px;
            color:#ddd;
            text-shadow:none;
            display:block;
        }
        .invalid-i {
            background:url({{ url('img/icons/cross.png') }}) no-repeat 0 50%;
            padding-left:22px;
            line-height:24px;
            color:#ec3f41;
        }
        .valid-i {
            background:url({{ url('img/icons/accept.png') }}) no-repeat 0 50%;
            padding-left:22px;
            line-height:24px;
            color:#3a7d34;
        }
        .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
            line-height: 1em;
            vertical-align: middle;
        }
    </style>

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
</head>
<body class="clearfix with-menu" style="display: none;">
    <div class="div-screen">
        <input type="hidden" id="inpSelectedTable" value="{{ isset($tableName) ? $tableName : "" }}">
        <input type="hidden" id="inpSelectedTableGroup" value="{{ isset($group) ? $group : "" }}">
        <input type="hidden" id="inpSelectedEntries" value="{{ $selectedEntries ? $selectedEntries : 10 }}">
        <input type="hidden" id="inpSettingsEntries" value="{{ $settingsEntries ? $settingsEntries : 10 }}">
        <!-- Prompt IE 6 users to install Chrome Frame -->
        <!--[if lt IE 7]><p class="message red-gradient simpler">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

        <!-- Button to open/hide menu -->
        <a href="" id="open-menu" onclick="showHideMenu()" style="top: 15px;"><span>Menu</span></a>
        <!-- Main content -->
        <nav class="navbar navbar-default" style="position: fixed;width: 100%;z-index: 999">
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse">
                    <ul class="nav navbar-nav navbar-left" style="float: left;">
                        <li style="display: inline-block">
                            <a href="{{ route("landing") }}" style="padding: 10px 0;height: 30px;">
                                <img src="{{ url('assets/img/tdp-logo-no-text.png') }}" alt="{{ settings('app_name') }}" style="height: 30px;">
                            </a>
                        </li>
                        <li style="display: inline-block">
                            <a href="{{ route("homepage") }}" class="btn btn-default" style="margin: 10px;padding: 4px 7px;font-size: 1.5em;">
                                <i class="fa fa-home"></i>
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
                                <a href="javascript:void(0)" onclick="$('.loginForm').show()">
                                    <i class="fa fa-sign-in"></i>
                                    @lang('app.login')
                                </a>
                            </li>
                        @endif
                    </ul>
                </div>
            </div>
        </nav>

        <section role="main" id="main">

            <!-- Visible only to browsers without javascript -->
            <noscript class="message black-gradient simpler">Your browser does not support JavaScript! Some features won't work as expected...</noscript>

            <!-- Main title -->
            <hgroup id="main-title" class="thin" style='height:50px'>
                <div class="colvisopts with-small-padding js-filterMenuHide" style="position: fixed; top: 54px; font-size:14px;z-index:1000;display: flex;align-items: center;right: 280px;">
                    @if($favourite)
                        <div style="display: inline-block;">
                            <a href="javascript:void(0)" style="padding: 15px;" onclick="favouriteToggle()" title="Favourite">
                                @if($favourite == "Active")
                                    <i id="favourite_star" class="fa fa-star" style="font-size: 1.5em;"></i>
                                @else
                                    <i id="favourite_star" class="fa fa-star-o" style="font-size: 1.5em;"></i>
                                @endif
                            </a>
                        </div>
                    @endif
                    <div class="showhidemenu" style='width:150px;display:inline-block'>
                        <a href="javascript:void(0)" class="button blue-gradient glossy"  onclick="showHideColumnsList()">Show/Hide Columns</a>
                    </div>
                    <div style="padding: 5px;display: inline-block;">
                        <select id="tableChanger" class="selectcustom" onchange="window.location = '/data/' + $('#tableChanger').val();" style="width: 100%;font-family: 'FontAwesome'">
                            <option value=""></option>
                            @foreach($listTables as $tb)
                                <option value="{{ $tb->www_add }}">
                                    @if(Auth::user())
                                        {{ (Auth::user()->id == $tb->owner ? '&#xf10c; ' : ($tb->right ? '&#xf006; ' : '&#x2003; ')) }}
                                    @endif
                                    {{ $tb->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                    <div style="display: inline-block;margin-left: 8px;">
                        <form action="{{ route('downloader') }}" method="post" id="downloader_form">
                            {{ csrf_field() }}
                            <input type="hidden" name="tableName" id="downloader_tableName" value="">
                            <input type="hidden" name="filename" id="downloader_method" value="">
                            <input type="hidden" name="q" id="downloader_query" value="">
                            <input type="hidden" name="fields" id="downloader_fields" value="">
                            <input type="hidden" name="filterData" id="downloader_filters" value="">
                            <button type="button" class="btn btn-default" onclick="openPrintDialog()">Print</button>
                            <button type="button" class="btn btn-default" onclick="downloaderGo('CSV')">CSV</button>
                            <button type="button" class="btn btn-default" onclick="downloaderGo('PDF')">PDF</button>
                            <button type="button" class="btn btn-default" onclick="downloaderGo('XLS')">Excel</button>
                        </form>
                    </div>
                </div>
            </hgroup>


            <!-- The padding wrapper may be omitted -->
            <div class="with-padding">

                <!-- Wrapper, set tabs style class here -->
                <div class="standard-tabs">

                    <!-- Tabs -->
                    <ul class="tabs" style="position: fixed ;top: 66px; left: 20px;">
                        <li class="active" id="li_list_view"><a href="javascript:void(0)" onclick="showList()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">i</span></i> List View</a></li>
                        @if($tableName)
                            <li id="li_favorite_view"><a href="javascript:void(0)" onclick="showFavorite()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="fa fa-star"></span></i> Favorite</a></li>
                        @endif
                        @if($tableName == 'st')
                            <li id="li_map_view"><a href="javascript:void(0)" onclick="showMap()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">0</span></i> Map View</a></li>
                        @endif
                        @if(Auth::user())
                            <li id="li_settings_view"><a href="javascript:void(0)" onclick="showSettings()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-settings icon-size2"> </i> Settings</a></li>
                        @endif
                    </ul>

                    <!-- Content -->
                    <div class="tabs-content js-filterMenuHide" style="position: fixed; left: 20px; bottom: 10px; top: 100px;right: 280px;">

                        <div id="list_view" style='padding:5px 20px 20px 20px; position: absolute; bottom: 0; top: 0; left: 0; right: 0;'>
                            @if($tableName == 'st')
                                <h2 style='font-size:14px;' id='main-search-wrapper'>
                                    <span class="input ">
                                       <form method="post" action="#" id='frm-search-latlng' style='padding-bottom: 2px;'>
                                          <span class="info-spot on-left"><span class="font-icon">`</span><span class="info-bubble">Click <span class="font-icon">`</span> to show search options</span></span>
                                          <input name="dec-lat" id="frm-dec-lat" class="input-unstyled input-sep validate[required]" placeholder="Latitude" value="" maxlength="50" style='width:100px' type="text">
                                          <input name="dec-lng" id="frm-dec-lng" class="input-unstyled input-sep validate[required]" placeholder="Longitude" value="" maxlength="50" style='width:100px' type="text">
                                          <input name="dec-radius" id="frm-dec-radius" class="input-unstyled validate[required]" placeholder="Radius MI" style='width:70px' value=""  maxlength="2" type="text">
                                          <select id='tower-owners-latlng' name="tower-owners" class="selectcustom   auto-open mid-margin-left mid-margin-right " style='width:100px'>
                                                <option value="all">Owner:All</option>
                                                                      </select>
                                          <a href="javascript:void(0)" class="button blue-gradient glossy" id='btn-search-latlng' onclick="changePage(1)">Search </a>
                                       </form>
                                       <form method="post" action="#" id='frm-search-address' style='padding-bottom: 2px;display:none'>
                                          <span class="info-spot on-left"><span class="font-icon">`</span><span class="info-bubble">Click <span class="font-icon">`</span> to show search options</span></span>
                                          <input name="address" id="frm-address" class="input-unstyled input-sep" placeholder="Street Address" value="" maxlength="50" style='width:100px' type="text">
                                          <input name="city" id="frm-city" class="input-unstyled input-sep" placeholder="City" value="" maxlength="50" style='width:100px' type="text">
                                          <select id='frm-state' name="state" class="selectcustom   auto-open mid-margin-left mid-margin-right " style='width:100px' >
                                            <option value="">State</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DC">District of Columbia</option>
                                            <option value="DE">Delaware</option>
                                            <option value="FL">Florida</option>
                                            <option value="GA">Georgia</option>
                                            <option value="HI">Hawaii</option>
                                            <option value="IA">Iowa</option>
                                            <option value="ID">Idaho</option>
                                            <option value="IL">Illinois</option>
                                            <option value="IN">Indiana</option>
                                            <option value="KS">Kansas</option>
                                            <option value="KY">Kentucky</option>
                                            <option value="LA">Louisiana</option>
                                            <option value="MA">Massachusetts</option>
                                            <option value="MD">Maryland</option>
                                            <option value="ME">Maine</option>
                                            <option value="MI">Michigan</option>
                                            <option value="MN">Minnesota</option>
                                            <option value="MO">Missouri</option>
                                            <option value="MS">Mississippi</option>
                                            <option value="MT">Montana</option>
                                            <option value="NC">North Carolina</option>
                                            <option value="ND">North Dakota</option>
                                            <option value="NE">Nebraska</option>
                                            <option value="NH">New Hampshire</option>
                                            <option value="NJ">New Jersey</option>
                                            <option value="NM">New Mexico</option>
                                            <option value="NV">Nevada</option>
                                            <option value="NY">New York</option>
                                            <option value="OH">Ohio</option>
                                            <option value="OK">Oklahoma</option>
                                            <option value="OR">Oregon</option>
                                            <option value="PA">Pennsylvania</option>
                                            <option value="RI">Rhode Island</option>
                                            <option value="SC">South Carolina</option>
                                            <option value="SD">South Dakota</option>
                                            <option value="TN">Tennessee</option>
                                            <option value="TX">Texas</option>
                                            <option value="UT">Utah</option>
                                            <option value="VA">Virginia</option>
                                            <option value="VT">Vermont</option>
                                            <option value="WA">Washington</option>
                                            <option value="WI">Wisconsin</option>
                                            <option value="WV">West Virginia</option>
                                            <option value="WY">Wyoming</option>
                                            <option value="PR">Puerto Rico</option>
                                            <option value="VI">Virgin Islands</option>
                                          </select>

                                          <input name="county" id="frm-county" class="input-unstyled input-sep" placeholder="County" value="" maxlength="50" style='width:50px' type="text">
                                          <input name="dec-radius" id="addr-dec-radius" class="input-unstyled" placeholder="Radius MI" value="" maxlength="10" style='width:70px'  type="hidden">
                                          <select id='tower-owners-address' name="tower-owners" class="selectcustom   auto-open mid-margin-left mid-margin-right " style='width:100px'>
                                                <option value="all">Owner:All</option>
                                                                </select>
                                          <a href="javascript:void(0)" class="button blue-gradient glossy" id='btn-search-address' onclick="changePage(1)">Search </a>
                                       </form>
                                    </span>
                                    <a href="javascript:void(0)" id='btn-search-type' class='button blue-gradient' onclick="toggleSearchType()">
                                        <i class="icon-size1"><span class="font-icon" style="margin:0;">l</span></i>
                                    </a>
                                    <div id="block-search-type" class="js-showSearchType" style="position:relative;display: none;">
                                        <span class="selectMultiple multiple white-gradient check-list replacement js-showSearchType_list" style="width: 178px;position: absolute;z-index: 1500;left: 356px;" tabindex="0">
                                            <span class="drop-down">
                                                <span class="selected" onclick="showLatSearch()" id="search_type_lat">
                                                    <span class="check"></span>Latitude/Longitude
                                                </span>
                                                <span onclick="showAddressSearch()" id="search_type_address">
                                                    <span class="check"></span>Address/Location
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                </h2>
                            @endif

                            <div class="dataTables_wrapper no-footer js_tableNameST" style="position: absolute; bottom: 10px; right: 20px; left: 20px;top: 10px;">

                                <div class="dataTables_header">
                                    <div class="dataTables_length">
                                        <label>
                                            Show
                                            <span class="select blue-gradient glossy replacement" tabindex="0">
                                                <span class="select-value js-selected_entries_span" style="height: inherit">{{ $selectedEntries ? $selectedEntries : 10 }}</span>
                                                <span class="select-arrow"></span>
                                                <span class="drop-down custom-scroll">
                                                    <span class="entry-elem entry10 {{ $selectedEntries == 10 ? 'selected' : '' }}" onclick="changeEntries(10)">10</span>
                                                    <span class="entry-elem entry20 {{ $selectedEntries == 20 ? 'selected' : '' }}" onclick="changeEntries(20)">20</span>
                                                    <span class="entry-elem entry50 {{ $selectedEntries == 50 ? 'selected' : '' }}" onclick="changeEntries(50)">50</span>
                                                    <span class="entry-elem entry100 {{ $selectedEntries == 100 ? 'selected' : '' }}" onclick="changeEntries(100)">100</span>
                                                    <span class="entry-elem entryAll {{ $selectedEntries == 'All' ? 'selected' : '' }}" onclick="changeEntries('All')">All</span>
                                                </span>
                                            </span>
                                            entries
                                        </label>
                                    </div>
                                    @if(Auth::user())
                                        <a style="margin-top:11px" href="javascript:void(0)" class="button blue-gradient glossy" onclick="addData()">Add</a>
                                        <input type="checkbox" style="margin-left: 10px;position:relative;top: 4px;width: 20px;height: 20px;" id="addingIsInline" onclick="checkboxAddToggle()">
                                    @endif
                                    <div class="dataTables_filter"><label>Search by Keyword:<input id="searchKeywordInp" onchange="searchKeywordChanged()" type="search" class="" placeholder="Within listed entries"></label></div>
                                </div>
                                <div id="div_for_horizontal_scroll" class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                    <table class="table dataTable" id="tbAddRow" style="margin-bottom: 0;position: absolute;top:-32px;z-index: 25;display: none;">
                                        <thead id="tbAddRow_header">
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                            @endforeach
                                        </tr>
                                        </thead>

                                        <tbody id="tbAddRow_body">
                                        </tbody>
                                    </table>
                                    <table class="table dataTable" id="tbHeaders" style="margin-bottom: 0;position: absolute;z-index: 50;top:0;">
                                        <thead id="tbHeaders_header">
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                            @endforeach
                                        </tr>
                                        </thead>

                                        <tbody style="visibility: hidden;" id="tbHeaders_body">
                                        </tbody>
                                    </table>
                                    <div id="divTbData" style="position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;top:32px;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" id="tbData" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead id="tbData_header">
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                                @endforeach
                                            </tr>
                                            </thead>

                                            <tbody id="tbData_body">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dataTables_footer" style="position: absolute; bottom: 0px; right: 0; left: 0">
                                    <div class="dataTables_info" role="status" aria-live="polite" style="position:absolute;">
                                        Showing <span id="showing_from_span"></span>
                                        to <span id="showing_to_span"></span>
                                        of <span id="showing_all_span"></span> entries</div>
                                    <div class="dataTables_paginate paging_full_numbers">
                                        <a class="paginate_button first" onclick="changePage(1)">First
                                        </a><a class="paginate_button previous" onclick="changePage(selectedPage>1 ? selectedPage : 1)">Previous
                                        </a><span id="paginate_btns_span">
                                        </span><a class="paginate_button next" onclick="changePage((selectedPage+1)<(rowsCount/selectedEntries) ? selectedPage+2 : (rowsCount/selectedEntries))">Next
                                        </a><a class="paginate_button last" onclick="changePage(Math.ceil(rowsCount/selectedEntries))">Last</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="favorite_view" style='display:none;padding:5px 20px 20px 20px; position: absolute; bottom: 0; top: 0; left: 0; right: 0;'>

                            <div class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; right: 20px; left: 20px;top: 10px;">

                                <div class="dataTables_header">
                                    <div class="dataTables_length">
                                        <label>
                                            Show
                                            <span class="select blue-gradient glossy replacement" tabindex="0">
                                                <span class="select-value js-selected_entries_span" style="height: inherit">{{ $selectedEntries ? $selectedEntries : 10 }}</span>
                                                <span class="select-arrow"></span>
                                                <span class="drop-down custom-scroll">
                                                    <span class="entry-elem entry10 {{ $selectedEntries == 10 ? 'selected' : '' }}" onclick="changeEntries(10)">10</span>
                                                    <span class="entry-elem entry20 {{ $selectedEntries == 20 ? 'selected' : '' }}" onclick="changeEntries(20)">20</span>
                                                    <span class="entry-elem entry50 {{ $selectedEntries == 50 ? 'selected' : '' }}" onclick="changeEntries(50)">50</span>
                                                    <span class="entry-elem entry100 {{ $selectedEntries == 100 ? 'selected' : '' }}" onclick="changeEntries(100)">100</span>
                                                    <span class="entry-elem entryAll {{ $selectedEntries == 'All' ? 'selected' : '' }}" onclick="changeEntries('All')">All</span>
                                                </span>
                                            </span>
                                            entries
                                        </label>
                                    </div>
                                    <button class="button blue-gradient glossy" style="margin-top: 9px;margin-left: 20px;" onclick="favoritesCopyToClipboard()">copy</button>
                                </div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                    <table class="table dataTable" id="tbFavoriteHeaders" style="margin-bottom: 0;position: absolute;z-index: 50;top:0;">
                                        <thead id="tbFavoriteHeaders_header">
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                            @endforeach
                                        </tr>
                                        </thead>

                                        <tbody style="visibility: hidden;" id="tbFavoriteHeaders_body">
                                        </tbody>
                                    </table>
                                    <div style="position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;top:32px;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" id="tbFavoriteData" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead id="tbFavoriteData_header">
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                                @endforeach
                                            </tr>
                                            </thead>

                                            <tbody id="tbFavoriteData_body">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dataTables_footer" style="position: absolute; bottom: 0; right: 0; left: 0; height: 52px;">
                                    <div class="dataTables_info" role="status" aria-live="polite" style="position:absolute;">
                                        Showing
                                        @if(Auth::user())
                                            <span id="favorite_showing_from_span"></span>
                                            to <span id="favorite_showing_to_span"></span>
                                            of <span id="favorite_showing_all_span"></span>
                                        @else
                                            all
                                        @endif
                                        entries
                                    </div>
                                    <div class="dataTables_paginate paging_full_numbers">
                                        <a class="paginate_button first" onclick="changeFavoritePage(1)">First
                                        </a><a class="paginate_button previous" onclick="changeFavoritePage(selectedFavoritePage>1 ? selectedFavoritePage : 1)">Previous
                                        </a><span id="favorite_paginate_btns_span">
                                        </span><a class="paginate_button next" onclick="changeFavoritePage((selectedFavoritePage+1)<(favoriteRowsCount/selectedEntries) ? selectedFavoritePage+2 : (favoriteRowsCount/selectedEntries))">Next
                                        </a><a class="paginate_button last" onclick="changeFavoritePage(Math.ceil(favoriteRowsCount/selectedEntries))">Last</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="map_view" class="with-padding" style="display:none; position: absolute; bottom: 20px; top: 20px; left: 20px; right: 20px;">
                            <div id="map-google" style="position: absolute; bottom: 0; top: 0; left: 0; right: 0;"></div>
                        </div>

                        @if(Auth::user())
                        <div id="settings_view" style="display:none; padding:5px 20px 20px 20px; position: absolute; bottom: 0; top: 0; left: 0; right: 0;">

                            <!-- Tabs -->
                            <div class="standard-tabs" style="margin: 15px 10px;position: absolute;width: 200px;transform: rotate(-90deg);left: -75px;top: 80px;">
                                <ul class="tabs">
                                    @if($canEditSettings)
                                        <li id="li_settings_rights" style="float: left;"><a href="javascript:void(0)" onclick="settingsTabShowRights()" class='with-med-padding'>Rights</a></li>
                                    @endif
                                    @if($canEditSettings)
                                        <li id="li_settings_ddl" style="float: left;"><a href="javascript:void(0)" onclick="settingsTabShowDDL()" class='with-med-padding'>DDL</a></li>
                                    @endif
                                    <li class="active" id="li_settings_display" style="float: left;"><a href="javascript:void(0)" onclick="settingsTabShowDisplay()" class='with-med-padding'>Display</a></li>
                                </ul>
                            </div>

                            <!-- Content -->
                            <div id="div_settings_display" class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; top: 10px; right: 20px; left: 40px;">
                                <div class="dataTables_header">
                                    <div class="dataTables_length">
                                        <label>
                                            Show
                                            <span class="select blue-gradient glossy replacement" tabindex="0">
                                            <span class="select-value js-selected_settings_entries_span" style="height: inherit">{{ $settingsEntries ? $settingsEntries : 10 }}</span>
                                                <span class="select-arrow"></span>
                                                <span class="drop-down custom-scroll">
                                                    <span class="entry-elem-s entry-s-10 {{ $settingsEntries == 10 ? 'selected' : '' }}" onclick="changeSettingsEntries(10)">10</span>
                                                    <span class="entry-elem-s entry-s-20 {{ $settingsEntries == 20 ? 'selected' : '' }}" onclick="changeSettingsEntries(20)">20</span>
                                                    <span class="entry-elem-s entry-s-50 {{ $settingsEntries == 50 ? 'selected' : '' }}" onclick="changeSettingsEntries(50)">50</span>
                                                    <span class="entry-elem-s entry-s-100 {{ $settingsEntries == 100 ? 'selected' : '' }}" onclick="changeSettingsEntries(100)">100</span>
                                                    <span class="entry-elem-s entry-s-All {{ $settingsEntries == 'All' ? 'selected' : '' }}" onclick="changeSettingsEntries('All')">All</span>
                                                </span>
                                            </span>
                                            entries
                                        </label>
                                    </div>
                                    <div class="dataTables_filter"><label>Search by Keyword:<input id="searchSettingsKeywordInp" onchange="searchSettingsKeywordChanged()" type="search" class="" placeholder="Within listed entries"></label></div>
                                </div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                    <table class="table dataTable" style="margin-bottom: 0;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsHeaders as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'ddl_id' ? 'DDL Name' : $hdr->name }}</th>
                                            @endforeach
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsHeaders_body">
                                        </tbody>
                                    </table>
                                    <div style="top: 32px; position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead>
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($settingsHeaders as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'ddl_id' ? 'DDL Name' : $hdr->name }}</th>
                                                @endforeach
                                            </tr>
                                            </thead>

                                            <tbody id="tbSettingsData_body">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dataTables_footer" style="position: absolute; bottom: 0px; right: 0; left: 0">
                                    <div class="dataTables_info" role="status" aria-live="polite" style="position:absolute;">
                                        Showing <span id="showing_settings_from_span"></span>
                                        to <span id="showing_settings_to_span"></span>
                                        of <span id="showing_settings_all_span"></span> entries</div>
                                    <div class="dataTables_paginate paging_full_numbers">
                                        <a class="paginate_button first" onclick="changeSettingsPage(1)">First
                                        </a><a class="paginate_button previous" onclick="changeSettingsPage(settingsPage+1>1 ? settingsPage+1 : 1)">Previous
                                        </a><span id="paginate_settings_btns_span">
                                        </span><a class="paginate_button next" onclick="changeSettingsPage((settingsPage+2)<(settingsRowsCount/settingsEntries) ? settingsPage+3 : (settingsRowsCount/settingsEntries))">Next
                                        </a><a class="paginate_button last" onclick="changeSettingsPage(settingsRowsCount/settingsEntries)">Last</a>
                                    </div>
                                </div>
                            </div>

                            <div id="div_settings_ddl" class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; top: 10px; right: 20px; left: 40px;display: none;">

                                <div style="position:absolute; font-size: 1.2em; left: 10px; width: calc(50% - 20px); top: 15px;">Dropdown Lists</div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 70px; left: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsDDL_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'tb_id' ? 'Table Name' : $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsDDL_headers">
                                        </tbody>
                                    </table>
                                    <div style="top: 32px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead>
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($settingsDDL_Headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'tb_id' ? 'Table Name' : $hdr->name }}</th>
                                                @endforeach
                                                <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody id="tbSettingsDDL_data">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style="overflow-x: auto; overflow-y: hidden; position: absolute; height: 37px; bottom: 32px; left: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <a style="position: absolute;top: 4px;right: 22px;z-index: 200;" href="javascript:void(0)" class="button blue-gradient glossy" onclick="saveSettingsDDLRow('ddl')">Add</a>
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: -32px;left: 0;right: 0;z-index: 50;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsDDL_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'tb_id' ? 'Table Name' : $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsDDL_addrow">
                                        </tbody>
                                    </table>
                                </div>

                                <div style="position:absolute; font-size: 1.2em; right: 10px; width: calc(50% - 20px); top: 15px;">Options of Current Selected Dropdown List</div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 70px; right: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsDDL_Items_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'list_id' ? 'DDL Name' : $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsDDL_Items_headers">
                                        </tbody>
                                    </table>
                                    <div style="top: 32px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead>
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($settingsDDL_Items_Headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'list_id' ? 'DDL Name' : $hdr->name }}</th>
                                                @endforeach
                                                <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody id="tbSettingsDDL_Items_data">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style="overflow-x: auto; overflow-y: hidden; position: absolute; height: 37px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <a style="position: absolute;top: 4px;right: 22px;z-index: 200;display: none;" href="javascript:void(0)" class="button blue-gradient glossy" onclick="saveSettingsDDLRow('ddl_items')" id="add_settings_ddl_item_btn">Add</a>
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: -32px;left: 0;right: 0;z-index: 50;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsDDL_Items_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'list_id' ? 'DDL Name' : $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsDDL_Items_addrow">
                                        <tr style="height: 32px;">
                                            @foreach($settingsDDL_Items_Headers as $hdr)
                                                <td data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}"></td>
                                            @endforeach
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div class="dataTables_footer" style="position: absolute; bottom: 25px; right: 0; left: 10px">
                                    <div role="status" aria-live="polite" style="position:absolute;">
                                        Showing all entries
                                    </div>
                                </div>
                            </div>

                            <div id="div_settings_rights" class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; top: 10px; right: 20px; left: 40px;display: none;">
                                <div style="position:absolute; font-size: 1.2em; left: 10px; width: calc(50% - 20px); top: 15px;">Rights list</div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 70px; left: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsRights_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsRights_headers">
                                        </tbody>
                                    </table>
                                    <div style="top: 32px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead>
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($settingsRights_Headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                                @endforeach
                                                <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody id="tbSettingsRights_data">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div style="overflow-x: auto; overflow-y: hidden; position: absolute; height: 37px; bottom: 32px; left: 10px; width: calc(50% - 20px); background-color: #ccc;">
                                    <div style="width: calc(100% - 110px);position: relative;top: 5px;left: 10px;"><select id="selectUserSearch"></select></div>
                                    <a style="position: absolute;top: 4px;right: 10px;z-index: 200;" href="javascript:void(0)" class="button blue-gradient glossy" onclick="addSettingsRights()">Add User</a>
                                </div>

                                <div style="position:absolute; font-size: 1.2em; right: 10px; width: calc(50% - 20px); top: 15px;">Options of Current Selected Right</div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff;">
                                    <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsRights_Fields_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsRights_Fields_headers">
                                        </tbody>
                                    </table>
                                    <div style="top: 32px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                            <thead>
                                            <tr>
                                                <th class="sorting nowrap">#</th>
                                                @foreach($settingsRights_Fields_Headers as $hdr)
                                                    <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                                @endforeach
                                                <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody id="tbSettingsRights_Fields_data">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="dataTables_footer" style="position: absolute; bottom: 25px; right: 0; left: 10px">
                                    <div role="status" aria-live="polite" style="position:absolute;">
                                        Showing all entries
                                    </div>
                                </div>
                            </div>

                        </div>
                        @endif

                    </div>

                </div>

            </div>

        </section>
        <!-- End main content -->
        <!-- Sidebar/drop-down menu -->
        <section id="menu" role="complementary" class="" style="position:fixed;top: 59px;bottom: 0;right: 0;width: 260px;">
            <!-- This wrapper is used by several responsive layouts -->
            <div id="menu-content" style="position:absolute;top: 0;bottom: 0;right: 0;left: 0;">

                <header>
                    Filter Results
                </header>
                <dl class="accordion white-bg with-mid-padding" id="acd-filter-menu" style="position:absolute;top: 38px;bottom: 0;right: 0;left: 0;overflow: hidden;">
                </dl>
            </div>
            <!-- End content wrapper -->

            <!-- This is optional -->
            <footer id="menu-footer">
                <!-- Any content -->
            </footer>

        </section>

        <!-- Pop Up Modal -->
        <div id="modals" class="with-blocker editable-modal js-editmodal" style="display: none;">

            <div class="modal-blocker visible"></div>
            <div class="modal" style="display:block;left: 20%;right: 30%; top: 23px; bottom: 23px; opacity: 1; margin-top: 0; max-height: 650px;">
                <ul class="modal-actions children-tooltip">
                    <li class="red-hover"><a href="javascript:void(0)" title="Close" onclick="$('.js-editmodal').hide();">Close</a></li>
                </ul>
                <div class="modal-bg" style="height: 100%; position:relative;">
                    <div class="modal-content custom-scroll" style="box-shadow: none;border: none;position: absolute;top: 20px;left: 20px;right: 20px;bottom: 50px;">
                        <input class="details-latlng" type="hidden" value=":">
                        <div class="standard-tabs tabs-active" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
                            <!-- Tabs -->
                            <ul class="tabs same-height" style="margin-top: 10px">
                                <li class="active" id="details_li_list_view"><a href="javascript:void(0)" class="with-small-padding" onclick="detailsShowList()"> Details</a></li>
                                @if($tableName == 'st')
                                    <li id="details_li_map_view"><a href="javascript:void(0)" class="with-small-padding" onclick="detailsShowMap()"> Google Map</a></li>
                                @endif
                            </ul>
                            <!-- Content -->
                            <div class="tabs-content" id="details-tabs-content" style="position: absolute;top: 33px;left: 0;right: 0;bottom: 0;overflow: auto;">
                                <span class="tabs-back with-left-arrow top-bevel-on-light dark-text-bevel">Back</span>
                                <div id="details_lview" class="tab-active">
                                    <div class="with-padding">
                                        <table align="center" border="1" cellspacing="0" style="background:white;color:black;width:80%;">
                                            <tbody id="modals_rows">
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div id="details_gmap" class="with-small-padding" style="position: relative; width: 100%; height: 100%; display: none;">
                                    <div id="map-details" style="height: 100%; width: 100%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="position:absolute; bottom: 10px; right: 20px; left: 20px;">
                        <button id="modal_btn_delete" class="btn btn-danger" onclick="deleteRowModal()" style="float: left;">Delete</button>
                        <button id="modal_btn_add" class="btn btn-success" onclick="addRowModal()" style="float: left;">Add</button>
                        <button id="modal_btn_update" class="btn btn-info" onclick="updateRowModal()" style="float: left; margin-left: 40px;">Update</button>
                        <button type="button" onclick="$('.js-editmodal').hide();" class="button small" style="float: right;">Close</button>
                    </div>
                </div>
                <div class="modal-resize-nw"></div>
                <div class="modal-resize-n"></div>
                <div class="modal-resize-ne"></div>
                <div class="modal-resize-e"></div>
                <div class="modal-resize-se"></div>
                <div class="modal-resize-s"></div>
                <div class="modal-resize-sw"></div>
                <div class="modal-resize-w"></div>
            </div>
        </div>

        <!-- Pop Up Modal -->

        <div class="loadingFromServer" style="position: fixed; top: 10px; left: 10px;z-index: 1500; padding: 10px; background: #fff; border-radius: 10px;display: none;">
            <span class="loader working"></span> <span id="modal-status" style="color: #333;">Contacting server.. :)</span>
        </div>
        <div class="loadingFromServer" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;"></div>

        <div style="position: fixed;top: 94px;bottom: 10px;z-index: 1500;right: 830px;display: none;" class="js-filterMenuHide_2" id="showHideColumnsList">
            <div class="message tooltip  tracking" style="position: absolute; top: 0; opacity: 1; max-height: 100%; overflow: auto;" id="accesstestscroll">
                <div id='block-cols-list'>
                    <ul class='list' id='ul-cols-list'>
                        @foreach($headers as $hdr)
                            <li style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">
                                <input id="{{ $hdr->field }}_visibility" onclick="showHideColumn('{{ $hdr->field }}')" class="checkcols" type="checkbox" checked > <label class="labels" for="{{ $hdr->field }}_visibility"> {{ $hdr->name }} </label>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        {{-- Login form --}}
        <div class="loginForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);display: none;">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap" id="login">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <img src="{{ url('assets/img/tdp-logo.png') }}" alt="{{ settings('app_name') }}">
                        </div>

                        {{-- This will simply include partials/messages.blade.php view here --}}
                        @include('partials/messages')

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
                                    <a href="javascript:void(0)" onclick="$('.loginForm').hide();$('.passResetForm').show();" class="forgot" style="top: 9px;">@lang('app.i_forgot_my_password')</a>
                                @endif
                            </div>
                            <div style="margin-bottom:20px;">

                                @if (settings('remember_me'))
                                    <input type="checkbox" name="remember" id="remember" value="1"/>
                                    <label for="remember" style="font-weight: 400;">@lang('app.remember_me')</label>
                                @endif

                                @if (settings('reg_enabled'))
                                    <a href="javascript:void(0)" onclick="$('.loginForm').hide();$('.registerForm').show();" style="float: right;color: #337ab7;">@lang('app.dont_have_an_account')</a>
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
        <div class="loginForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.loginForm').hide()"></div>

        {{-- Register form --}}
        <div class="registerForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);display: none;">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <img src="{{ url('assets/img/tdp-logo.png') }}" alt="{{ settings('app_name') }}">
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
                            <div class="form-group input-icon" style="position: relative;">
                                <i class="fa fa-lock"></i>
                                <input id="pswd_target_input" type="password" name="password" class="form-control" placeholder="@lang('app.password')">
                                <div id="pswd_info">
                                    <h4>Password must meet the following requirements:</h4>
                                    <ul>
                                        <li id="pswd_letter" class="invalid">At least <strong>one letter</strong></li>
                                        <li id="pswd_capital" class="invalid">At least <strong>one capital letter</strong></li>
                                        <li id="pswd_number" class="invalid">At least <strong>one number</strong></li>
                                        <li id="pswd_special" class="invalid">At least <strong>one special character</strong></li>
                                        <li id="pswd_length" class="invalid">Be at least <strong>6 characters</strong></li>
                                    </ul>
                                </div>
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
                                <a href="javascript:void(0)" onclick="$('.registerForm').hide();$('.loginForm').show();" style="color: #337ab7;">Already have account?</a>
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
        <div class="registerForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.registerForm').hide()"></div>

        {{-- Password Reset form --}}
        <div class="passResetForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 180px);display: none;">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap">
                        <h1>@lang('app.forgot_your_password')</h1>

                        @include('partials.messages')

                        <form role="form" action="<?= url('password/remind') ?>" method="POST" id="remind-password-form" autocomplete="off">
                            <input type="hidden" value="<?= csrf_token() ?>" name="_token">

                            <div class="form-group password-field input-icon">
                                <label for="password" class="sr-only">@lang('app.email')</label>
                                <i class="fa fa-at"></i>
                                <input type="email" name="email" id="email" class="form-control" placeholder="@lang('app.your_email')">
                            </div>

                            <div class="form-group">
                                <button type="submit" class="btn btn-custom btn-lg btn-block" id="btn-reset-password">
                                    @lang('app.reset_password')
                                </button>
                                <a href="javascript:void(0)" onclick="$('.passResetForm').hide();$('.loginForm').show();" class="btn btn-default btn-lg btn-block">
                                    Cancel
                                </a>
                            </div>
                        </form>

                    </div>
                    <div class="row">
                        <div class="col-xs-12" style="text-align: center;font-size: 12px;">
                            <p>@lang('app.copyright') © - {{ settings('app_name') }} {{ date('Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="passResetForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.passResetForm').hide()"></div>
    </div>

    <div class="div-print" id="div-print"></div>

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

    {!! HTML::script('https://maps.googleapis.com/maps/api/js?key=AIzaSyAGaaPdBTpcf_z_lLmhwxNwHESJhFQ4MGM&hl=en&language=en') !!}
    {!! HTML::script('assets/js/lib/jquery.mCustomScrollbar.concat.min.js') !!}
    {!! HTML::script('assets/js/lib/lodash.min.js') !!}
    {!! HTML::script('assets/js/lib/setup.js') !!}
    {!! HTML::script('assets/js/lib/developr.auto-resizing.js') !!}
    {!! HTML::script('assets/js/lib/developr.modal.js') !!}
    {!! HTML::script('assets/js/lib/developr.input.js') !!}
    {!! HTML::script('assets/js/lib/developr.scroll.js') !!}
    {!! HTML::script('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js') !!}
    {!! HTML::script('https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js') !!}
    {!! HTML::script('assets/js/lib/table.js') !!}

    {{-- Login scripts --}}
    {!! HTML::script('assets/js/as/login.js') !!}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\LoginRequest', '#login-form') !!}

    {{-- Register scripts --}}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\RegisterRequest', '#registration-form') !!}

    {{-- Reset Pass scripts --}}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\PasswordRemindRequest', '#remind-password-form') !!}
    <script>
        canEditSettings = {{ (int)$canEditSettings }};
        authUser = {{ (int)Auth::check() }};
    </script>
</body>
</html>
