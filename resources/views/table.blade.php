@extends('layouts.table_app')

@section('content')
    <div class="div-screen">
        <input type="hidden" id="inpServerName" value="{{ $server }}">
        <input type="hidden" id="inpSelectedTable" value="{{ isset($tableName) ? $tableName : "" }}">
        <input type="hidden" id="inpSelectedEntries" value="{{ $selectedEntries ? $selectedEntries : 10 }}">
        <input type="hidden" id="inpSettingsEntries" value="{{ $settingsEntries ? $settingsEntries : 10 }}">
        <!-- Prompt IE 6 users to install Chrome Frame -->
        <!--[if lt IE 7]><p class="message red-gradient simpler">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

        <section id="showTableLibBody" class="menu left-menu" role="complementary" style="overflow: hidden; position:fixed;top: 59px;bottom: 0;left: -1px;width: 260px;">
            <!-- This wrapper is used by several responsive layouts -->
            <div class="menu-content">

                <header style="text-align: right;">
                    Table Library
                    <a id="showTableLibBtn" class="open-menu" onclick="showHideTableLib()"><span></span></a>
                </header>

                <div class="standard-tabs" style="position: absolute; left: 0;right: 0;top: 38px;bottom: 0; background: #f1f3f4; padding-top: 20px">
                    <ul class="tabs" style="position:relative; left: 10px;">
                        <li {{ Auth::guest() ? 'class=active' : '' }} id="tablebar_li_public"><a href="javascript:void(0)" onclick="tablebar_show_public()" class="with-med-padding" style="padding-bottom:12px;padding-top:12px">Public</a></li>
                        <li id="tablebar_li_private"><a href="javascript:void(0)" onclick="tablebar_show_private()" class="with-med-padding" style="padding-bottom:12px;padding-top:12px">Private</a></li>
                        <li {{ Auth::user() ? 'class=active' : '' }} id="tablebar_li_favorite"><a href="javascript:void(0)" onclick="tablebar_show_favorite()" class="with-med-padding" style="padding-bottom:12px;padding-top:12px">Favorite</a></li>
                    </ul>


                    <div id="tablebar_public_div" class="tab-content" style="{{ Auth::guest() ? '' : 'display:none;' }} position: absolute; top: 50px; left: 0; right: 0; bottom: 0; border: 1px solid #cccccc; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); overflow: auto; padding: 15px;">
                        {!! $treeTables['public'] !!}
                    </div>
                    <div id="tablebar_private_div" class="tab-content" style="display:none; position: absolute; top: 50px; left: 0; right: 0; bottom: 0; border: 1px solid #cccccc; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); overflow: auto; padding: 15px;">
                        @if(Auth::user())
                            {!! $treeTables['private'] !!}
                        @else
                            Register and Login to add and manage your own collection of data tables.
                        @endif
                    </div>
                    <div id="tablebar_favorite_div" class="tab-content" style="{{ Auth::user() ? '' : 'display:none;' }} position: absolute; top: 50px; left: 0; right: 0; bottom: 0; border: 1px solid #cccccc; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); overflow: auto; padding: 15px;">
                        @if(Auth::user())
                            {!! $treeTables['favorite'] !!}
                        @else
                            Register and Login to add and manage your own collection of data tables.
                        @endif
                    </div>
                </div>
            </div>
            <!-- End content wrapper -->
        </section>

        <section role="main" id="main">

            <!-- Visible only to browsers without javascript -->
            <noscript class="message black-gradient simpler">Your browser does not support JavaScript! Some features won't work as expected...</noscript>

            <!-- Main title -->
            <div class="colvisopts with-small-padding js-filterMenuHide" style="position: fixed; top: 54px; font-size:14px;z-index:1000;display: flex;align-items: center;right: 20px;">
                @if($owner && $tableName)
                    <div style="display: inline-block;">
                        <a href="javascript:void(0)" style="padding: 15px;" onclick="deleteCurrentTable()" title="Delete table">
                            <i class="fa fa-remove" style="font-size: 1.5em;"></i>
                        </a>
                    </div>
                @endif
                @if(Auth::user() && $tableName)
                    <div style="display: inline-block;">
                        <a href="javascript:void(0)" style="padding: 15px;" onclick="toggleFavoriteTable(this)" title="Favorite table">
                            <i class="fa {{ ($favorite == 'Active' ? 'fa-star' : 'fa-star-o') }}" style="font-size: 1.5em;"></i>
                        </a>
                    </div>
                @endif
                <div class="showhidemenu" style='width:150px;display:inline-block'>
                    <a href="javascript:void(0)" class="button blue-gradient glossy thin"  onclick="showHideColumnsList()">Show/Hide Columns</a>
                </div>
                @if(Auth::user())
                    <div style="padding: 5px;display: inline-block;">
                        <select id="tableChanger" class="selectcustom" onchange="window.location = $('#tableChanger').val();" style="width: 100%;font-family: 'FontAwesome'">
                            <option value="{{ '/data/all' }}"></option>
                            @foreach($treeTables['custom_select'] as $tb)
                                <option value="{{ $tb['li'] }}">
                                    {{ $tb['name'] }}
                                </option>
                            @endforeach
                        </select>
                    </div>
                @endif
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


            <!-- Wrapper, set tabs style class here -->
            <div class="standard-tabs js-table_lib_hide" style="position: fixed ;top: 70px; left: 280px; width: 500px;">

                <!-- Tabs -->
                <ul class="tabs js-leftPosition">
                    <li class="active" id="li_list_view"><a href="javascript:void(0)" onclick="showList()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">i</span></i> List View</a></li>
                    @if($tableName)
                        <li id="li_favorite_view"><a href="javascript:void(0)" onclick="showFavorite()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="fa fa-star"></span></i> Favorite</a></li>
                    @endif
                    @if($tableName == 'st')
                        <li id="li_map_view"><a href="javascript:void(0)" onclick="showMap()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">0</span></i> Map View</a></li>
                    @endif
                    @if(Auth::user() && $tableName)
                        <li id="li_settings_view"><a href="javascript:void(0)" onclick="showSettings()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-settings icon-size2"> </i> Settings</a></li>
                    @endif
                    @if($owner && $tableName)
                    <li id="li_import_view"><a href="javascript:void(0)" onclick="showImport()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px">Data</a></li>
                    @endif
                </ul>

                <!-- Content -->
                <div class="tabs-content js-filterMenuHide js-leftPosition js-table_lib_hide" style="position: fixed; left: 280px; bottom: 10px; top: 100px;right: 20px;">

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
                                <table class="table dataTable" id="tbAddRow" style="margin-bottom: 0;position: absolute;top:-64px;z-index: 25;display: none;">
                                    <thead id="tbAddRow_header">
                                    <tr>
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
                                        @foreach($headers as $hdr)
                                            <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                        @endforeach
                                    </tr>
                                    </thead>

                                    <tbody style="visibility: hidden;" id="tbHeaders_body">
                                    </tbody>
                                </table>
                                <div id="divTbData" style="position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;top:64px;" class="table_body_viewport">
                                    <table class="table responsive-table responsive-table-on dataTable" id="tbData" style="margin-bottom: 0; margin-top: -64px;">
                                        <thead id="tbData_header">
                                        <tr>
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
                                    Showing <span id="showing_from_span">0</span>
                                    to <span id="showing_to_span">0</span>
                                    of <span id="showing_all_span">0</span> entries</div>
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
                                <button class="button blue-gradient glossy" style="margin-top: 9px;margin-left: 20px;margin-right: 10px;" onclick="favoritesCopyToClipboard()">Copy</button>
                                <input id="favourite_copy_with_headers" type="checkbox">
                                <label for="favourite_copy_with_headers">Headers</label>
                                @if($tableMeta && $tableMeta->source == 'remote')
                                    <span style="margin-left: 30px; color: #F00;font-size: 1.5em;font-weight: bold;">Table is remote (save function is unavailable)!</span>
                                @endif
                            </div>
                            <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                <table class="table dataTable" id="tbFavoriteCheckRow" style="margin-bottom: 0;position: absolute;top:-32px;z-index: 25;">
                                    <thead id="tbFavoriteCheckRow_header">
                                    <tr>
                                        @foreach($headers as $hdr)
                                            <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->name }}</th>
                                        @endforeach
                                    </tr>
                                    </thead>

                                    <tbody id="tbFavoriteCheckRow_body">
                                    </tbody>
                                </table>
                                <table class="table dataTable" id="tbFavoriteHeaders" style="margin-bottom: 0;position: absolute;z-index: 50;top:36px;">
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
                                <div id="tbFavoriteDataDiv" style="position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;top:68px;" class="table_body_viewport">
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
                        <div class="standard-tabs" style="margin: 15px 10px;position: absolute;width: 250px;transform: rotate(-90deg);left: -100px;top: 80px;">
                            <ul class="tabs">
                                @if($owner)
                                    <li id="li_settings_rights" style="float: left;"><a href="javascript:void(0)" onclick="settingsTabShowRights()" class='with-med-padding'>Permissions</a></li>
                                @endif
                                @if($owner)
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
                                    <thead id="tbSettingsHeaders_head">
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
                                        <thead id="tbSettingsData_head">
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
                            <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 32px; left: 10px; width: calc(50% - 20px); background-color: #fff;">
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

                            <div style="position:absolute; font-size: 1.2em; right: 10px; width: calc(50% - 20px); top: 15px;">Options of Current Selected Dropdown List <span id="settings_selected_DDL_name"></span></div>
                            <div class="dataTables_body _settings_selected_DDL_regular" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff;">
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
                            <div class="dataTables_body _settings_selected_DDL_reference" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 42px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff;">
                                <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                    <thead>
                                    <tr>
                                        <th class="sorting nowrap">#</th>
                                        @foreach($settingsDDL_References_Headers as $hdr)
                                            <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'list_id' ? 'DDL Name' : $hdr->name }}</th>
                                        @endforeach
                                        <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody id="tbSettingsDDL_References_headers">
                                    </tbody>
                                </table>
                                <div style="top: 32px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                    <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsDDL_References_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">{{ $hdr->field == 'list_id' ? 'DDL Name' : $hdr->name }}</th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsDDL_References_data">
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

                        <div id="div_settings_rights" class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; top: 10px; right: 20px; left: 40px;display: none;">
                            <div style="position:absolute; font-size: 1.2em; left: 10px; width: calc(50% - 20px); top: 15px;">Permissions list</div>
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

                            <div style="position:absolute; font-size: 1.2em; right: 10px; width: calc(50% - 20px); top: 15px;">Permission Options of Current Selected User</div>
                            <!-- Tabs -->
                            <div class="standard-tabs" style="position: absolute; width: calc(50% - 30px); right: 15px; top: 51px; z-index: 50;">
                                <ul class="tabs" style="background-color: #FFF; padding: 5px;">
                                    <li class="active" id="li_settings_permissions_cols_tab" style="float: left;"><a href="javascript:void(0)" onclick="settingsPermissionsTabShowColumns()" class='with-med-padding'>Columns</a></li>
                                    <li id="li_settings_permissions_rows_tab" style="float: left;"><a href="javascript:void(0)" onclick="settingsPermissionsTabShowRows()" class='with-med-padding'>Rows</a></li>
                                </ul>
                            </div>
                            <!-- CONTENT -->
                            <div id="settings_permissions_cols_tab" class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 78px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff;z-index: 100; border: 2px solid #AAA; border-radius: 6px 6px 0 0;">
                                <table class="table dataTable" style="margin-bottom: 0;position: absolute;top: 0;left: 0;right: 0;z-index: 100;">
                                    <thead>
                                    <tr>
                                        <th class="sorting nowrap">#</th>
                                        @foreach($settingsRights_Fields_Headers as $hdr)
                                            <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">
                                                {{ $hdr->name }}
                                                {!! ($hdr->field == 'view' || $hdr->field == 'edit' ? '<span class="rights_fields_check_'.$hdr->field.'" style="padding-left:10px"></div>' : '') !!}
                                            </th>
                                        @endforeach
                                        <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                    </tr>
                                    </thead>

                                    <tbody id="tbSettingsRights_Fields_headers">
                                    </tbody>
                                </table>
                                <div style="top: 36px; position: absolute; z-index: 150; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                    <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -32px;">
                                        <thead>
                                        <tr>
                                            <th class="sorting nowrap">#</th>
                                            @foreach($settingsRights_Fields_Headers as $hdr)
                                                <th class="sorting nowrap" data-key="{{ $hdr->field }}" style="{{ $hdr->web == 'No' ? 'display: none;' : '' }}">
                                                    {{ $hdr->name }}
                                                    {!! ($hdr->field == 'view' || $hdr->field == 'edit' ? '<span class="rights_fields_check_'.$hdr->field.'" style="padding-left:10px"></div>' : '') !!}
                                                </th>
                                            @endforeach
                                            <th class="sorting nowrap" style="width: 30px;">Actions</th>
                                        </tr>
                                        </thead>

                                        <tbody id="tbSettingsRights_Fields_data">
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div id="settings_permissions_rows_tab" class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 78px; bottom: 32px; right: 10px; width: calc(50% - 20px); background-color: #fff; display: none;z-index: 100; border: 2px solid #AAA; border-radius: 6px 6px 0 0;">
                                Rows
                            </div>

                            <div class="dataTables_footer" style="position: absolute; bottom: 25px; right: 0; left: 10px">
                                <div role="status" aria-live="polite" style="position:absolute;">
                                    Showing all entries
                                </div>
                            </div>
                        </div>

                    </div>
                    @endif

                    @if($owner && $tableName)
                    <div id="import_view" class="with-padding" style="display:none; position: absolute; bottom: 20px; top: 20px; left: 20px; right: 20px;">
                        <div style="position: absolute; bottom: 0; top: 0; left: 0; right: 0;overflow: hidden;">
                            <form id="import_form" method="post" action="" onsubmit="import_form_submit()">
                                <div class="container" style="position: relative;">
                                    <input id="import_form_save_btn" type="submit" class="btn btn-success" value="Save" style="position: absolute;right: 0;z-index: 1;">
                                </div>
                                <input type="hidden" value="<?= csrf_token() ?>" name="_token">
                                <input type="hidden" id="import_data_csv" name="data_csv" value="">
                                <input type="hidden" id="import_table_name" name="table_name" value="{{ $tableMeta ? $tableMeta->name : '' }}">
                                <input type="hidden" id="import_table_db_tb" name="table_db_tb" value="{{ $tableName }}">
                                <input type="hidden" id="import_target_db" name="import_target_db" value="0">
                                <input type="hidden" id="import_target_db_should_del" name="import_target_db_should_del" value="0">
                                <input type="hidden" id="import_tb_rfcn" name="import_tb_rfcn" value="">
                                <div class="standard-tabs" style="position: absolute; left: 0;right: 0;top: 0;bottom: 0;padding-top: 10px;">
                                    <div class="standard-tabs container">
                                        <ul class="tabs">
                                            <li id="import_li_csv_tab" onclick="import_show_csv_tab()">
                                                <a href="javascript:void(0)" onclick="import_show_csv_tab()" class="with-med-padding" style="padding-bottom:12px;padding-top:12px">
                                                    Method
                                                </a>
                                            </li>
                                            <li class="active" id="import_li_col_tab">
                                                <a href="javascript:void(0)" onclick="import_show_col_tab()" class="with-med-padding" style="padding-bottom:12px;padding-top:12px">
                                                    Field Settings
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div id="import_csv_tab" class="tab-content container" style="position: absolute; top: 40px; left: 0; right: 0; bottom: 0; border: 1px solid #cccccc; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); overflow: auto; padding: 15px; display: none;">
                                        <div class="row form-group" style="padding: 0 15px;">
                                            <select id="import_type_import" name="type_import" class="form-control" onchange="changeImportStyle(this)" style="width: 15%; display: inline-block; float: left;height: 36px;">
                                                <option {{ ($tableMeta->source != 'ref' ? 'selected' : '') }} value="scratch">From Scratch</option>
                                                <option value="csv">CSV Import</option>
                                                <option value="mysql">MySQL Import</option>
                                                <option value="remote">Remote</option>
                                                <option {{ ($tableMeta->source == 'ref' ? 'selected' : '') }} value="ref">Referencing</option>
                                            </select>
                                            <select class="form-control" id="import_action_type" onchange="changeImportAction(this)" style="width: 15%; display: inline-block; float: left;height: 36px;margin-left: 5px;">
                                                <option value="/createTable">New</option>
                                                <option value="/replaceTable">Replace Existing</option>
                                                <option value="/modifyTable">Append</option>
                                            </select>
                                            <label style="padding: 10px;float: left;">Notes:</label>
                                            <input type="text" id="import_method_notes" class="form-control" style="width: 30%;"onchange="import_method_notes_changed()">
                                        </div>
                                        <div class="form-group js-import_csv_style" style="width: 67%;display: flex;align-items: center; justify-content:  space-between;">
                                            <div style="width: calc(50% - 25px); display: inline-block;">
                                                <input type="file" id="import_csv" class="form-control" placeholder="Your csv file" accept=".csv" onchange="sent_csv_to_backend(1)">
                                            </div>
                                            OR
                                            <div style="width: calc(50% - 25px); display: inline-block;">
                                                <input type="text" id="import_file_link" class="form-control" placeholder="www address of file">
                                            </div>
                                        </div>
                                        <div class="row form-group js-import_mysql_style" style="display: none;">
                                            <div class="col-xs-8 form-group">
                                                <div class="row">
                                                    <div class="col-xs-4">
                                                        <label>Select a saved the connection:</label>
                                                    </div>
                                                    <div class="col-xs-4">
                                                        <select class="form-control" id="import_saved_conn" onchange="select_import_connection()" style="height: 34px;">
                                                            <option value="-1"></option>
                                                            @foreach($importConnections as $key => $iconn)
                                                                <option value="{{ $key }}">{{ $iconn->name }}</option>
                                                            @endforeach
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-8 form-group">
                                                <input id="import_name_conn" name="import_name_conn" type="text" class="form-control" style="width: 15%; display: inline-block;" placeholder="NAME">
                                                <input id="import_mysql_host" name="import_host" type="text" class="form-control" style="width: 15%; display: inline-block;" placeholder="HOST">
                                                <input id="import_mysql_lgn" name="import_lgn" type="text" class="form-control" style="width: 15%; display: inline-block;" placeholder="LOGIN">
                                                <input id="import_mysql_pwd" name="import_pwd" type="password" class="form-control" style="width: 15%; display: inline-block;" placeholder="PASS">
                                                <input id="import_mysql_db" name="import_db" type="text" class="form-control" style="width: 15%; display: inline-block;" placeholder="DB">
                                                <input id="import_mysql_table" name="import_table" type="text" class="form-control" style="width: 15%; display: inline-block;" placeholder="TABLE">
                                            </div>
                                            <div class="col-xs-8 form-group">
                                                <div class="row" style="display: flex;align-items: center;">
                                                    <div class="col-xs-1">
                                                        <input id="import_save_conn" name="import_save_conn" type="checkbox" class="form-control" style="margin: 0;">
                                                    </div>
                                                    <div class="col-xs-8">
                                                        <label>Save the connection?</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-8 form-group">
                                                <input type="button" class="btn btn-success" style="width: 11%; display: inline-block;" value="Connect" onclick="import_test_db_connect()">
                                            </div>
                                        </div>
                                        <div class="row js-import_csv_style">
                                            <div class="col-xs-5">
                                                <div class="row">
                                                    <div class="col-xs-9"><label>First row as headers:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c1" name="csv_first_headers" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9"><label>Second row as fields:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c2" name="csv_second_fields" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9"><label>Third row as data type:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c3" name="csv_third_type" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9"><label>Fourth row as max. size:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c4" name="csv_fourth_size" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9"><label>Fifth row as default value:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c5" name="csv_fifth_default" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-9"><label>Sixth row as inclusion:</label></div>
                                                    <div class="col-xs-3"><input type="checkbox" class="form-control js-import_chb" id="import_csv_c6" name="csv_sixth_required" onchange="sent_csv_to_backend(0)"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-5"><label>Starting row:</label></div>
                                                    <div class="col-xs-7"><input type="number" class="form-control" name="csv_start_data"></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-5"><label>Ending row:</label></div>
                                                    <div class="col-xs-7"><input type="number" class="form-control" name="csv_end_data"></div>
                                                </div>
                                            </div>
                                            <div class="col-xs-5">
                                                <div class="row">
                                                    <div class="col-xs-2"><input type="checkbox" class="form-control" name="csv_replace_accents"></div>
                                                    <div class="col-xs-10"><label>Replace Accents/Diacriticals</label></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2"><input type="checkbox" class="form-control" name="csv_quote_char"></div>
                                                    <div class="col-xs-10"><label>Treat all Quoting Characted as data</label></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2"><input type="checkbox" class="form-control" name="csv_quote_apostrophe"></div>
                                                    <div class="col-xs-10"><label>Input CSV Quoting Characted is Apostrophe</label></div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-xs-2"><input type="checkbox" class="form-control" name="csv_backslash"></div>
                                                    <div class="col-xs-10"><label>CSV contains backslash escaping like \n, \t and \.</label></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button class="btn btn-primary js-import_csv_style" onclick="sent_csv_to_backend(1)">Import</button>
                                    </div>

                                    <div id="import_col_tab" class="tab-content container" style="position: absolute; top: 40px; left: 0; right: 0; bottom: 0; border: 1px solid #cccccc; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25); overflow: auto; padding: 15px;">
                                        <input type="hidden" id="import_row_count" value="{{ count($importHeaders) }}">
                                        <input type="hidden" id="import_ref_row_count" value="{{ count($importReferences) }}">
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                    <table class="table table-striped" id="import_main_columns" style="float: left; width: 100%;">
                                                        <thead>
                                                            <tr class="import_not_reference_columns">
                                                                <th>Table Header</th>
                                                                <th>tb Field</th>
                                                                <th class="js-import_column-orders">Column # in CSV</th>
                                                                <th>Type</th>
                                                                <th>Max. Size</th>
                                                                <th>Default Value</th>
                                                                <th>Required</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                            <tr class="import_reference_columns">
                                                                <th colspan="5" style="text-align: center;">Current Table</th>
                                                            </tr>
                                                            <tr class="import_reference_columns">
                                                                <th>Table Header</th>
                                                                <th>Table Field</th>
                                                                <th>Type</th>
                                                                <th>Size</th>
                                                                <th>Actions</th>
                                                            </tr>
                                                        </thead>

                                                        <tbody id="import_table_body">
                                                        @foreach($importHeaders as $hdr)
                                                            <tr id="import_columns_{{ $loop->index }}" style="{{ $hdr->auto ? 'display:none;' : '' }}">
                                                                <td>
                                                                    <input type="text" class="form-control" name="columns[{{ $loop->index }}][header]" value="{{ $hdr->name }}" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                </td>
                                                                <td>
                                                                    <input type="text" class="form-control" id="import_columns_{{ $loop->index }}_field_val" name="columns[{{ $loop->index }}][field]"  value="{{ $hdr->field }}" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                    <input type="hidden" class="form-control" name="columns[{{ $loop->index }}][old_field]" value="{{ $hdr->field }}" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                </td>
                                                                <td class="js-import_column-orders import_not_reference_columns">
                                                                    <select class="form-control" name="columns[{{ $loop->index }}][col]" onfocus="show_import_cols_numbers()" {{ $hdr->auto ? 'readonly' : ''}}></select>
                                                                </td>
                                                                <td>
                                                                    <select class="form-control" name="columns[{{ $loop->index }}][type]" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                        @foreach($importTypesDDL as $i_ddl)
                                                                            <option {{ $hdr->type == $i_ddl->option ? 'selected="selected"' : '' }}>{{ $i_ddl->option }}</option>
                                                                        @endforeach
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <input type="number" class="form-control" name="columns[{{ $loop->index }}][size]" value="{{ $hdr->maxlen }}" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                </td>
                                                                <td class="import_not_reference_columns">
                                                                    <input type="text" class="form-control" name="columns[{{ $loop->index }}][default]" value="{{ $hdr->default }}" {{ $hdr->auto ? 'readonly' : ''}}>
                                                                </td>
                                                                <td class="import_not_reference_columns">
                                                                    <input type="checkbox" class="form-control" name="columns[{{ $loop->index }}][required]" {{ $hdr->auto ? 'readonly' : ''}} {{ $hdr->auto || $hdr->required ? 'checked' : ''}}>
                                                                </td>
                                                                <td>
                                                                    <input type="hidden" id="import_columns_deleted_{{ $loop->index }}" name="columns[{{ $loop->index }}][stat]">
                                                                    @if(!$hdr->auto)
                                                                    <button type="button" class="btn btn-default" onclick="import_del_row({{ $loop->index }})">&times;</button>
                                                                    @endif
                                                                </td>
                                                            </tr>
                                                        @endforeach
                                                        <tr id="import_columns_row_add">
                                                            <td>
                                                                <input type="text" class="form-control import_columns_add" id="import_columns_add_header">
                                                            </td>
                                                            <td>
                                                                <input type="text" class="form-control import_columns_add" id="import_columns_add_field">
                                                            </td>
                                                            <td class="js-import_column-orders import_columns_add" id="import_not_reference_columns">
                                                                <select class="form-control import_columns_add" id="import_columns_add_col" onfocus="show_import_cols_numbers()"></select>
                                                            </td>
                                                            <td>
                                                                <select class="form-control import_columns_add" id="import_columns_add_type" >
                                                                    @foreach($importTypesDDL as $i_ddl)
                                                                        <option>{{ $i_ddl->option }}</option>
                                                                    @endforeach
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input type="number" class="form-control import_columns_add" id="import_columns_add_size">
                                                            </td>
                                                            <td class="import_not_reference_columns">
                                                                <input type="text" class="form-control import_columns_add" id="import_columns_add_default">
                                                            </td>
                                                            <td class="import_not_reference_columns">
                                                                <input type="checkbox" class="form-control import_columns_add" id="import_columns_add_required">
                                                            </td>
                                                            <td>
                                                                <input type="button" class="btn btn-primary" onclick="import_add_table_row()" value="Add">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    
                                                    
                                                    <table class="table table-striped import_reference_columns" style="width: 35%; display: none; float: left;">
                                                        <thead>
                                                        <tr>
                                                            <th colspan="3" style="text-align: center;">Referencing</th>
                                                        </tr>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Reference Table</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>

                                                        <tbody id="import_table_ref_tab_body">
                                                        @foreach($importReferences as $hdr)
                                                            <tr id="import_columns_ref_tab_{{ $loop->index }}" class="import_row_colors">
                                                                <td>
                                                                    <a onclick="show_import_ref_columns({{ $loop->index }})" class="btn-tower-id" ><span class="font-icon">`</span><b>{{ $loop->index+1 }}</b></a>
                                                                </td>
                                                                <td>
                                                                    <select id="import_columns_ref_table_{{ $loop->index }}" class="form-control" disabled>
                                                                        @foreach($tablesDropDown as $tb)
                                                                            <option {{ $hdr->ref_tb == $tb->db_tb ? 'selected="selected"' : '' }} value="{{ $tb->db_tb }}">{{ $tb->name }}</option>
                                                                        @endforeach
                                                                    </select>
                                                                </td>
                                                                <td>
                                                                    <button type="button" class="btn btn-default" onclick="import_del_row_ref({{ $loop->index }})">&times;</button>
                                                                    |
                                                                    <button type="button" class="btn btn-default" onclick="partially_import_ref_table('{{ $hdr->ref_tb }}', 0)"><span class="fa fa-arrow-right"></span></button>
                                                                </td>
                                                            </tr>
                                                        @endforeach
                                                        <tr id="import_columns_ref_table_add_row">
                                                            <td>auto</td>
                                                            <td>
                                                                <select id="import_columns_ref_table_add" class="form-control">
                                                                    <option></option>
                                                                    @foreach($tablesDropDown as $tb)
                                                                        <option value="{{ $tb->db_tb }}">{{ $tb->name }}</option>
                                                                    @endforeach
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <input type="button" class="btn btn-primary" onclick="import_add_ref_table_row()" value="Add">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <table class="table table-striped import_reference_columns" style="width: 14%; display: none; float: left;">
                                                        <thead>
                                                        <tr>
                                                            <th style="text-align: center;">Referencing</th>
                                                        </tr>
                                                        <tr>
                                                            <th>Reference Field</th>
                                                        </tr>
                                                        </thead>

                                                        <tbody id="import_table_ref_col_body">
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xs-12">
                                                <div class="form-group">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    @endif

                </div>

            </div>

        </section>
        <!-- End main content -->


        <!-- Filters -->
        <section class="menu" id="showHideMenuBody" role="complementary" style="position:fixed;top: 59px;bottom: 0;right: -1px;width: 0;">
            <div class="menu-content" style="position:absolute;top: 0;bottom: 0;right: 0;left: 0;">
                <header>
                    Filter Results
                    <a class="open-menu menu-hidden" id="showHideMenuBtn" onclick="showHideMenu()"><span></span></a>
                </header>
                <dl class="accordion white-bg with-mid-padding" id="acd-filter-menu" style="position:absolute;top: 38px;bottom: 0;right: 0;left: 0;overflow: hidden;">
                </dl>
            </div>
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

        <div style="position: fixed;top: 94px;bottom: 10px;z-index: 1500;right: 420px;display: none;" class="js-filterMenuHide_2" id="showHideColumnsList">
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

        {{-- Table edit from sidebar form --}}
        <div class="editSidebarTableForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 180px);display: none;">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap">
                        <h1>Edit table</h1>
                        <div style="width: 350px;">
                            <input type="hidden" id="sidebar_table_id">
                            <input type="hidden" id="sidebar_table_action">
                            <input type="hidden" id="sidebar_table_tab">
                            <input type="hidden" id="sidebar_menutree_id">

                            <div class="form-group input-icon">
                                <label for="sidebar_table_name">Table name</label>
                                <input type="text" id="sidebar_table_name" class="form-control" placeholder="Table name" required>
                            </div>

                            <div class="form-group input-icon">
                                <label for="sidebar_table_db">Database name</label>
                                <input type="text" id="sidebar_table_db" class="form-control" disabled>
                            </div>

                            <div class="form-group input-icon">
                                <label for="sidebar_table_nbr">Entries per page</label>
                                <select id="sidebar_table_nbr" class="form-control">
                                    <option>100</option>
                                    <option>200</option>
                                    <option>500</option>
                                </select>
                            </div>

                            <div class="form-group input-icon">
                                <label for="sidebar_table_notes">Notes</label>
                                <input type="text" id="sidebar_table_notes" class="form-control">
                            </div>

                            <div class="form-group">
                                <button type="button" class="btn btn-custom btn-lg btn-block" onclick="popup_sidebar_table()">
                                    Save
                                </button>
                                <a href="javascript:void(0)" onclick="$('.editSidebarTableForm').hide();" class="btn btn-default btn-lg btn-block">
                                    Cancel
                                </a>
                            </div>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-xs-12" style="text-align: center;font-size: 12px;">
                            <p>@lang('app.copyright') © - {{ settings('app_name') }} {{ date('Y') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="editSidebarTableForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;display: none;" onclick="$('.editSidebarTableForm').hide()"></div>
    </div>
    <div id="ctxMenu_tablebar"></div>

    <div class="div-print" id="div-print"></div>
@endsection

@push('scripts')
    <script>
        authUser = {{ Auth::user() ? Auth::user()->id : 0 }};
        userOwner = {{ (int)$owner }};
        isAdmin = {{ (Auth::user() && Auth::user()->role_id == 1 ? 1 : 0) }};
        importTypesDDL = JSON.parse('{!! json_encode($importTypesDDL) !!}');
        importConnections = JSON.parse('{!! json_encode($importConnections) !!}');
        table_meta = JSON.parse('{!! json_encode($tableMeta) !!}');
        $importReferences = JSON.parse('{!! json_encode($importReferences) !!}');
        tablesDropDown = JSON.parse('{!! preg_replace('/\'/i', '`', json_encode($tablesDropDown)) !!}');
    </script>
@endpush
