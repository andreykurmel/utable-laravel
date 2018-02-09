<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('page-title') | {{ settings('app_name') }}</title>

    <link href="https://fonts.googleapis.com/css?family=Roboto:400,300,100,500,700,900" rel="stylesheet" type="text/css">

    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="{{ url('assets/img/icons/apple-touch-icon-144x144.png') }}" />
    <link rel="apple-touch-icon-precomposed" sizes="152x152" href="{{ url('assets/img/icons/apple-touch-icon-152x152.png') }}" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-32x32.png') }}" sizes="32x32" />
    <link rel="icon" type="image/png" href="{{ url('assets/img/icons/favicon-16x16.png') }}" sizes="16x16" />
    <meta name="application-name" content="{{ settings('app_name') }}"/>
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="{{ url('assets/img/icons/mstile-144x144.png') }}" />

    {!! HTML::style('css/vendor.css') !!}
    {!! HTML::style('assets/css/app.css') !!}
    {!! HTML::style('css/table.css') !!}

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
</head>
<body class="clearfix with-menu"  ng-app="myApp" ng-controller="myCtrl" style="display: none;">
    <div class="div-screen">
        <input type="hidden" id="inpSelectedTable" value="{{ isset($tableName) ? $tableName : "" }}">
        <input type="hidden" id="inpSelectedTableGroup" value="{{ isset($group) ? $group : "" }}">
        <!-- Prompt IE 6 users to install Chrome Frame -->
        <!--[if lt IE 7]><p class="message red-gradient simpler">Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->

        <!-- Button to open/hide menu -->
        <a href="" id="open-menu" ng-click="showHideMenu()" style="top: 15px;"><span>Menu</span></a>
        <!-- Main content -->
        <nav class="navbar navbar-default" style="position: fixed;width: 100%;z-index: 999">
            <div class="container-fluid">
                <div id="navbar" class="navbar-collapse">
                    <ul class="nav navbar-nav navbar-left" style="float: left;">
                        <li style="display: inline-block">
                            <a href="{{ route("landing") }}" style="padding: 10px 0;height: 30px;">
                                <img src="{{ url('assets/img/vanguard-logo-no-text.png') }}" alt="{{ settings('app_name') }}" style="height: 30px;">
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
                                <a href="javascript:void(0)" ng-click="showLoginForm = true">
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
                <div class="colvisopts with-small-padding" ng-style="filterMenuHide ? {'right': '20px'} : {'right': '280px'}" style="position: fixed; top: 54px; font-size:14px;z-index:1000">
                    <div class="showhidemenu" style='width:150px;display:inline-block' ng-show="showedColumns()">
                        <a href="javascript:void(0)" class="button blue-gradient glossy" ng-click="toggleColumns()">Show/Hide Columns</a>
                    </div>
                    <div style="padding: 5px;display: inline-block;">
                        <select class="selectcustom" ng-model="selectedTableWWW" ng-change="changeTable(selectedTableWWW)" ng-options="tableObj.www_add as tableObj.name for tableObj in uTables" style="width: 100%">
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
                            <input type="hidden" name="visibleColumns" id="downloader_visibleColumns" value="">
                            <button type="button" class="btn btn-default" ng-click="openPrintDialog()">Print</button>
                            <button type="button" class="btn btn-default" ng-click="downloaderGo('CSV')">CSV</button>
                            <button type="button" class="btn btn-default" ng-click="downloaderGo('PDF')">PDF</button>
                            <button type="button" class="btn btn-default" ng-click="downloaderGo('XLS')">Excel</button>
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
                        <li class="active" id="li_list_view"><a href="" ng-click="showList()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">i</span></i> List View</a></li>
                        <li ng-if="selectedTableName == 'st'" id="li_map_view"><a href="" ng-click="showMap()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-size2"><span class="font-icon">0</span></i> Map View</a></li>
                        @if(Auth::user())
                            <li id="li_settings_view"><a href="" ng-click="showSettings()" class='with-med-padding' style="padding-bottom:12px;padding-top:12px"><i class="icon-settings icon-size2"> </i> Settings</a></li>
                        @endif
                    </ul>

                    <!-- Content -->
                    <div class="tabs-content" ng-style="filterMenuHide ? {'right': '20px'} : {'right': '280px'}" style="position: fixed; left: 20px; bottom: 10px; top: 100px;">

                        <div id="list_view" style='padding:5px 20px 20px 20px; position: absolute; bottom: 0; top: 0; left: 0; right: 0;'>
                            <h2 style='font-size:14px;' id='main-search-wrapper' ng-if="selectedTableName == 'st'">
                                <span class="input ">
                                   <form method="post" action="#" id='frm-search-latlng' style='padding-bottom: 2px;'>
                                      <span class="info-spot on-left"><span class="font-icon">`</span><span class="info-bubble">Click <span class="font-icon">`</span> to show search options</span></span>
                                      <input name="dec-lat" id="frm-dec-lat" class="input-unstyled input-sep validate[required]" placeholder="Latitude" value="" maxlength="50" style='width:100px' type="text">
                                      <input name="dec-lng" id="frm-dec-lng" class="input-unstyled input-sep validate[required]" placeholder="Longitude" value="" maxlength="50" style='width:100px' type="text">
                                      <input name="dec-radius" id="frm-dec-radius" class="input-unstyled validate[required]" placeholder="Radius MI" style='width:70px' value=""  maxlength="2" type="text">
                                      <select id='tower-owners-latlng' name="tower-owners" class="selectcustom   auto-open mid-margin-left mid-margin-right " style='width:100px'>
                                            <option value="all">Owner:All</option>
                                                                  </select>
                                      <a href="javascript:void(0)" class="button blue-gradient glossy" id='btn-search-latlng' ng-click="changePage(1, 'lat')">Search </a>
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
                                      <a href="javascript:void(0)" class="button blue-gradient glossy" id='btn-search-address' ng-click="changePage(1, 'address')">Search </a>
                                   </form>
                                </span>
                                <a href="javascript:void(0)" id='btn-search-type' class='button blue-gradient' ng-click="toggleSearchType()">
                                    <i class="icon-size1"><span class="font-icon" style="margin:0;">l</span></i>
                                </a>
                                <div id="block-search-type" ng-show="showSearchType" style="position:relative;">
                                    <span class="selectMultiple multiple white-gradient check-list replacement" style="width: 178px;position: absolute;z-index: 1500;" ng-style="frmSearchAddresIsVisible() ? {'left': '466px'} : {'left': '356px'}" tabindex="0">
                                        <span class="drop-down">
                                            <span class="selected" ng-click="showLatSearch()" id="search_type_lat">
                                                <span class="check"></span>Latitude/Longitude
                                            </span>
                                            <span ng-click="showAddressSearch()" id="search_type_address">
                                                <span class="check"></span>Address/Location
                                            </span>
                                        </span>
                                    </span>
                                </div>
                            </h2>

                            <div class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; right: 20px; left: 20px;" ng-style="selectedTableName == 'st' ? {'top': '50px'} : {'top': '10px'}">

                                <div class="dataTables_header">
                                    <div class="dataTables_length">
                                        <label>
                                            Show
                                            <span class="select blue-gradient glossy replacement" tabindex="0">
                                            <span class="select-value" style="height: inherit">[[ selectedEntries ]]</span>
                                                <span class="select-arrow"></span>
                                                <span class="drop-down custom-scroll">
                                                    <span ng-class="selectedEntries == val ? 'selected' : ''" ng-repeat="val in showEntries" ng-click="changeEntries(val)">[[ val ]]</span>
                                                </span>
                                            </span>
                                            entries
                                        </label>
                                    </div>
                                    @if(Auth::user() && $canEdit)
                                        <a style="margin-top:11px" href="javascript:void(0)" class="button blue-gradient glossy" ng-click="addData()">Add</a>
                                        <input type="checkbox" style="margin-left: 10px;position:relative;top: 4px;width: 20px;height: 20px;" ng-model="showAddRow">
                                    @endif
                                    <div class="dataTables_filter"><label>Search by Keyword:<input ng-model="searchKeyword" ng-change="changedKeyword=true;changePage(1, '')" ng-model-options="{debounce:1000}" type="search" class="" placeholder="Within listed entries"></label></div>
                                </div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                    <table class="table dataTable" style="margin-bottom: 0;">
                                        <thead ng-if="$index == 0" ng-repeat="tableObj in selectedTableData">
                                        <tr>
                                            <th class="sorting nowrap" ng-repeat="(key,value) in tableObj"  ng-click="sort(key)" ng-if="checkWeb(key) && checkVisible(key)">[[getColumnName(key)]]</th>
                                        </tr>
                                        </thead>

                                        <tbody style="visibility: hidden;">
                                        <tr ng-repeat="tableObj in selectedTableData | orderBy:sortType:false ">
                                            <td ng-if="checkWeb(key) && checkVisible(key)" ng-repeat="(key,value) in tableObj" style="height: 0;line-height: 0;">
                                                @if(Auth::user() && $canEdit)
                                                    <a ng-click="editSelectedData(tableObj,$parent.$parent.$parent.$index)" ng-if="!isEditable(key,selectedTableName)" class="btn-tower-id" ><span class="font-icon">`</span>
                                                        <b>[[$parent.$parent.$parent.$index+1 + selectedPage*selectedEntries]]</b>
                                                    </a>
                                                    <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                @else
                                                    <span ng-if="!isEditable(key,selectedTableName)">[[$parent.$parent.$parent.$index+1 + selectedPage*selectedEntries]]</span>
                                                    <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                @endif
                                            </td>
                                        </tr>

                                        @if(Auth::user() && $canEdit)
                                            <tr ng-if="selectedTableData && showAddRow">
                                                <td ng-if="checkWeb(key) && checkVisible(key)" ng-repeat="(key,value) in addObj" style="height: 0;line-height: 0">
                                                    <button ng-if="!isEditable(key,selectedTableName)" class="btn btn-success">
                                                        Save
                                                    </button>
                                                    <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                </td>
                                            </tr>
                                        @endif

                                        </tbody>
                                    </table>
                                    <div style="top: 37px; position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -37px;">
                                            <thead ng-if="$index == 0" ng-repeat="tableObj in selectedTableData">
                                            <tr>
                                                <th class="sorting nowrap" ng-repeat="(key,value) in tableObj"  ng-click="sort(key)" ng-if="checkWeb(key) && checkVisible(key)">[[getColumnName(key)]]</th>
                                            </tr>
                                            </thead>

                                            <tbody >
                                            <tr ng-repeat="tableObj in selectedTableData | orderBy:sortType:false | filter: searchKeyword ">
                                                @if(Auth::user() && $canEdit)
                                                    <td ng-if="checkWeb(key) && checkVisible(key)" ng-repeat="(key,value) in tableObj" style="position:relative;" ng-click="showInlineEdit(selectedTableName+'_'+key+'_'+tableObj.id, key)">
                                                        <a ng-click="editSelectedData(tableObj,$parent.$parent.$parent.$index)" ng-if="!isEditable(key,selectedTableName)" class="btn-tower-id" ><span class="font-icon">`</span>
                                                            <b>[[$parent.$parent.$parent.$index+1 + selectedPage*selectedEntries]]</b>
                                                        </a>
                                                        <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                        <input
                                                                ng-if="getColumnInputType(key) == 'input' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(tableObj, key, selectedTableName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateRow(tableObj,true)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[selectedTableName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <input
                                                                ng-if="getColumnInputType(key) == 'date' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(tableObj, key, selectedTableName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateRow(tableObj,true)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                data-date-time-picker
                                                                id="[[selectedTableName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <select
                                                                ng-if="getColumnInputType(key) == 'ddl' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(tableObj, key, selectedTableName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateRow(tableObj,true)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[selectedTableName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                                class="form-control"
                                                                ng-options="Option as Option for Option in tableDDLs[key]"
                                                        ></select>
                                                    </td>
                                                @else
                                                    <td ng-if="checkWeb(key) && checkVisible(key)" ng-repeat="(key,value) in tableObj" style="position:relative;">
                                                        <span ng-if="!isEditable(key,selectedTableName)">[[$parent.$parent.$parent.$index+1 + selectedPage*selectedEntries]]</span>
                                                        <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                    </td>
                                                @endif
                                            </tr>

                                            @if(Auth::user() && $canEdit)
                                                <tr ng-if="selectedTableData && showAddRow">
                                                    <td ng-if="checkWeb(key) && checkVisible(key)" ng-repeat="(key,value) in addObj" style="position:relative;" ng-click="showInlineEdit(selectedTableName+'_'+key+'_'+addObj.id, key)">
                                                        <button ng-if="!isEditable(key,selectedTableName)" class="btn btn-success" ng-click="addRowInline(addObj)">
                                                            Save
                                                        </button>
                                                        <span ng-if="isEditable(key,selectedTableName)">[[value]]</span>
                                                        <input
                                                                ng-if="getColumnInputType(key) == 'input' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(addObj, key, selectedTableName+'_'+key+'_'+addObj.id)"
                                                                ng-model="addObj[key]"
                                                                id="[[selectedTableName+'_'+key+'_'+addObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <input
                                                                ng-if="getColumnInputType(key) == 'date' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(addObj, key, selectedTableName+'_'+key+'_'+addObj.id)"
                                                                ng-model="addObj[key]"
                                                                data-date-time-picker
                                                                id="[[selectedTableName+'_'+key+'_'+addObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <select
                                                                ng-if="getColumnInputType(key) == 'ddl' && isEditable(key,selectedTableName)"
                                                                ng-blur="inlineUpdate(addObj, key, selectedTableName+'_'+key+'_'+addObj.id)"
                                                                ng-model="addObj[key]"
                                                                id="[[selectedTableName+'_'+key+'_'+addObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                                class="form-control"
                                                                ng-options="Option as Option for Option in tableDDLs[key]"
                                                        ></select>
                                                    </td>
                                                </tr>
                                            @endif


                                            <tr ng-show="$index == 0" ng-if="sumArr.length > 0" ng-repeat="tableObj in selectedTableData">
                                                <td ng-repeat="(key,value) in tableObj" ng-if="checkWeb(key) && checkVisible(key)"><span ng-if="ifSum(key)" >[[getSum(key)]]</span></td>
                                            </tr>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dataTables_footer" style="position: absolute; bottom: 0px; right: 0; left: 0">
                                    <div class="dataTables_info" role="status" aria-live="polite">
                                        Showing [[selectedPage*selectedEntries + 1 < selectedTableRows ? selectedPage*selectedEntries + 1 : selectedTableRows]]
                                        to [[(selectedPage+1)*selectedEntries < selectedTableRows ? (selectedPage+1)*selectedEntries : selectedTableRows]]
                                        of [[ selectedTableRows ]] entries</div>
                                    <div class="dataTables_paginate paging_full_numbers">
                                        <a class="paginate_button first" data-dt-idx="0" tabindex="0" ng-click="changePage(1, '')">First
                                        </a><a class="paginate_button previous" data-dt-idx="1" tabindex="0" ng-click="changePage(selectedPage>1 ? selectedPage : 1, '')">Previous
                                        </a><span ng-repeat="btn in paginateBtns"><span ng-show="btn == '...' || btn == '....'">...</span><a ng-show="btn != '...' && btn != '....'" class="paginate_button" tabindex="0" ng-click="changePage(btn, '')">[[btn]]
                                        </a></span><a class="paginate_button next" data-dt-idx="2" tabindex="0" ng-click="changePage((selectedPage+1)<(selectedTableRows/selectedEntries) ? selectedPage+2 : (selectedTableRows/selectedEntries), '')">Next
                                        </a><a class="paginate_button last" data-dt-idx="3" tabindex="0" ng-click="changePage(selectedTableRows/selectedEntries, '')">Last</a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="map_view" class="with-padding" style="display:none; position: absolute; bottom: 20px; top: 20px; left: 20px; right: 20px;">
                            <div id="map-google" style="position: absolute; bottom: 0; top: 0; left: 0; right: 0;"></div>
                        </div>

                        @if(Auth::user())
                        <div id="settings_view" style="display:none; padding:5px 20px 20px 20px; position: absolute; bottom: 0; top: 0; left: 0; right: 0;">

                            <div class="dataTables_wrapper no-footer" style="position: absolute; bottom: 10px; top: 10px; right: 20px; left: 20px;">
                                <div class="dataTables_header">
                                    <div class="dataTables_length">
                                        <label>
                                            Show
                                            <span class="select blue-gradient glossy replacement" tabindex="0">
                                            <span class="select-value" style="height: inherit">[[ selectedEntries ]]</span>
                                                <span class="select-arrow"></span>
                                                <span class="drop-down custom-scroll">
                                                    <span ng-class="selectedEntries == val ? 'selected' : ''" ng-repeat="val in showEntries" ng-click="changeEntries(val)">[[ val ]]</span>
                                                </span>
                                            </span>
                                            entries
                                        </label>
                                    </div>
                                    <!--<a style="margin-top:11px" href="javascript:void(0)" class="button blue-gradient glossy" ng-click="addData()">Add</a>-->
                                    <div class="dataTables_filter"><label>Search by Keyword:<input ng-model="searchSettingsKeyword" ng-change="changeSettingsPage(1)" ng-model-options="{debounce:1000}" type="search" class="" placeholder="Within listed entries"></label></div>
                                </div>
                                <div class="dataTables_body" style="overflow-x: auto; overflow-y: hidden; position: absolute; top: 52px; bottom: 52px; right: 0; left: 0;">
                                    <table class="table dataTable" style="margin-bottom: 0;">
                                        <thead ng-if="$index == 0" ng-repeat="tableObj in settingsData">
                                        <tr>
                                            <th class="sorting nowrap" ng-repeat="(key,value) in tableObj" ng-click="sortSettings(key)" ng-if="checkSettingsWeb(key)">[[getSettingsName(key)]]</th>
                                        </tr>
                                        </thead>

                                        <tbody >
                                        <tr ng-repeat="tableObj in settingsData | orderBy:sortSettingsType:false | filter: searchSettingsKeyword" ng-if="$index >= settingsPage*selectedEntries && $index < (settingsPage+1)*selectedEntries">
                                            <td ng-repeat="(key,value) in tableObj" ng-if="checkSettingsWeb(key)" style="height: 0;line-height: 0">
                                                @if($canEdit)
                                                    <a ng-if="!isEditable(key,uTableSettingsName)" class="btn-tower-id" ><span class="font-icon">`</span>
                                                        <b>[[value]]</b>
                                                    </a>
                                                    <span ng-if="isEditable(key,uTableSettingsName)">[[value]]</span>
                                                @else
                                                    <span>[[value]]</span>
                                                @endif
                                            </td>
                                        </tr>

                                        </tbody>
                                    </table>
                                    <div style="top: 37px; position: absolute; z-index: 100; bottom: 0; overflow: auto; min-width:100%;" class="table_body_viewport">
                                        <table class="table responsive-table responsive-table-on dataTable" style="margin-bottom: 0; margin-top: -37px;">
                                            <thead ng-if="$index == 0" ng-repeat="tableObj in settingsData">
                                            <tr>
                                                <th class="sorting nowrap" ng-repeat="(key,value) in tableObj" ng-click="sortSettings(key)" ng-if="checkSettingsWeb(key)">[[getSettingsName(key)]]</th>
                                            </tr>
                                            </thead>

                                            <tbody >
                                            <tr ng-repeat="tableObj in settingsData | orderBy:sortSettingsType:false | filter: searchSettingsKeyword" ng-if="$index >= settingsPage*selectedEntries && $index < (settingsPage+1)*selectedEntries">
                                                @if($canEdit)
                                                    <td ng-repeat="(key,value) in tableObj" ng-if="checkSettingsWeb(key)" style="position:relative;" ng-click="showInlineEdit(uTableSettingsName+'_'+key+'_'+tableObj.id, key)">
                                                        <a ng-if="!isEditable(key,uTableSettingsName)" class="btn-tower-id" ><span class="font-icon">`</span>
                                                            <b>[[value]]</b>
                                                        </a>
                                                        <span ng-if="isEditable(key,uTableSettingsName)">[[value]]</span>
                                                        <input
                                                                ng-if="getSettingsInputType(key) == 'input' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRow(tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <input
                                                                ng-if="getSettingsInputType(key) == 'date' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRow(tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                data-date-time-picker
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <select
                                                                ng-if="getSettingsInputType(key) == 'ddl' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRow(tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                                class="form-control"
                                                                ng-options="Option as Option for Option in settingsDDLs[key]"
                                                        ></select>
                                                    </td>
                                                @else
                                                    <td ng-repeat="(key,value) in tableObj" ng-if="checkSettingsWeb(key)" style="position:relative;" ng-click="showInlineEdit(uTableSettingsName+'_'+key+'_'+tableObj.id, key)">
                                                        <span>[[value]]</span>
                                                        <input
                                                                ng-if="getSettingsInputType(key) == 'input' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRowLocal(key, tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <input
                                                                ng-if="getSettingsInputType(key) == 'date' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRowLocal(key, tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                data-date-time-picker
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                        >
                                                        <select
                                                                ng-if="getSettingsInputType(key) == 'ddl' && isEditable(key,uTableSettingsName)"
                                                                ng-blur="inlineUpdate(tableObj, key, uTableSettingsName+'_'+key+'_'+tableObj.id)"
                                                                ng-change="updateSettingsRowLocal(key, tableObj)"
                                                                ng-model-options="{debounce:1000}"
                                                                ng-model="tableObj[key]"
                                                                id="[[uTableSettingsName+'_'+key+'_'+tableObj.id]]"
                                                                style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;"
                                                                class="form-control"
                                                                ng-options="Option as Option for Option in settingsDDLs[key]"
                                                        ></select>
                                                    </td>
                                                @endif
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="dataTables_footer" style="position: absolute; bottom: 0px; right: 0; left: 0">
                                    <div class="dataTables_info" role="status" aria-live="polite">
                                        Showing [[settingsPage*selectedEntries + 1 < settingsData.length ? settingsPage*selectedEntries + 1 : settingsData.length]]
                                        to [[(settingsPage+1)*selectedEntries < settingsData.length ? (settingsPage+1)*selectedEntries : settingsData.length]]
                                        of [[ settingsData.length ]] entries</div>
                                    <div class="dataTables_paginate paging_full_numbers">
                                        <a class="paginate_button first" data-dt-idx="0" tabindex="0" ng-click="changeSettingsPage(1)">First
                                        </a><a class="paginate_button previous" data-dt-idx="1" tabindex="0" ng-click="changeSettingsPage(settingsPage>1 ? settingsPage : 1)">Previous
                                        </a></span><a class="paginate_button next" data-dt-idx="2" tabindex="0" ng-click="changeSettingsPage((settingsPage+1)<(settingsData.length/selectedEntries) ? settingsPage+2 : (settingsData.length/selectedEntries))">Next
                                        </a><a class="paginate_button last" data-dt-idx="3" tabindex="0" ng-click="changeSettingsPage(settingsData.length/selectedEntries)">Last</a>
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
                    <div ng-repeat="filterObj in filterData" ng-if="filterObj">
                        <dt ng-click="showTabToggle($index)">[[filterObj.name]]</dt>
                        <dd class="acd-filter-elem" ng-show="showFilterTabs[$index] == true" style="position:relative;max-height: [[filterMaxHeight]]px;overflow: auto;">
                            <div class="with-small-padding">
                                <div class="blue-bg with-small-padding filterheader">
                                    <span class="checkbox  replacement" tabindex="0" ng-class="{'checked':filterObj.checkAll}" ng-click="filterObj.checkAll=!filterObj.checkAll;filterCheckAll(filterObj)">
                                        <span class="check-knob"></span>
                                        <input id="" checked="" class="" name="County" type="checkbox" value="County" tabindex="-1">
                                    </span>
                                    Check/Uncheck All
                                </div>
                                <ul class="list">
                                    <li ng-repeat="names in filterObj.val | unique: names" >
                                        <!-- addValuesToFilters(filterObj.key,names.value,names.checked) -->
                                        <span class="checkbox replacement mr5" ng-class="{'checked':names.checked}"  ng-click="names.checked=!names.checked;filterTable(filterObj,names.value,names.checked)">
                                                <span class="check-knob"></span>
                                                <input type="checkbox"  />
                                            </span>
                                        <span>[[names.value]]</span>
                                    </li>
                                </ul>
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>
            <!-- End content wrapper -->

            <!-- This is optional -->
            <footer id="menu-footer">
                <!-- Any content -->
            </footer>

        </section>

        <!-- Pop Up Modal -->
        <div id="modals " class="with-blocker editable-modal" ng-if="showModal">

            <div class="modal-blocker visible"></div>
            <div class="modal" style="display:block;left: 20%;right: 30%; top: 23px; bottom: 23px; opacity: 1; margin-top: 0; max-height: 650px;">
                <ul class="modal-actions children-tooltip">
                    <li class="red-hover"><a href="" title="Close" ng-click="closeModal()">Close</a></li>
                </ul>
                <div class="modal-bg" style="height: 100%; position:relative;">
                    <div class="modal-content custom-scroll" style="box-shadow: none;border: none;position: absolute;top: 20px;left: 20px;right: 20px;bottom: 50px;">
                        <input class="details-latlng" type="hidden" value=":">
                        <div class="standard-tabs tabs-active" style="position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
                            <!-- Tabs -->
                            <ul class="tabs same-height" style="margin-top: 10px">
                                <li class="active" id="details_li_list_view"><a href="" class="with-small-padding" ng-click="detailsShowList()"> Details</a></li>
                                <li ng-if="selectedTableName == 'st' && editItemIndex > -1" id="details_li_map_view"><a href="" class="with-small-padding" ng-click="detailsShowMap()"> Google Map</a></li>
                            </ul>
                            <!-- Content -->
                            <div class="tabs-content" id="details-tabs-content" style="position: absolute;top: 33px;left: 0;right: 0;bottom: 0;overflow: auto;">
                                <span class="tabs-back with-left-arrow top-bevel-on-light dark-text-bevel">Back</span>
                                <div id="details_lview" class="tab-active">
                                    <div class="with-padding">
                                        <table align="center" border="1" cellspacing="0" style="background:white;color:black;width:80%;">
                                            <tbody>
                                            <tr ng-repeat="(key,value) in editData" ng-if="checkIfVisible(key)">
                                                <td><label>[[getColumnName(key)]]</label></td>
                                                <td>
                                                    <input ng-if="getColumnInputType(key) == 'auto'" type="text" class="form-control" value="[[getColumnValue(key)]]" readonly/>
                                                    <input ng-if="getColumnInputType(key) == 'input'" type="text" class="form-control" value="[[value]]" ng-model="editData[key]"/>
                                                    <input ng-if="getColumnInputType(key) == 'date'" type="text" class="form-control" ng-model="editData[key]" data-date-time-picker/>
                                                    <select ng-if="getColumnInputType(key) == 'ddl'" class="form-control" ng-model="editData[key]" ng-options="Option as Option for Option in tableDDLs[key]" style="margin-bottom: 5px;">
                                                    </select>
                                                </td>
                                            </tr>
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
                        <button ng-if="editItemIndex > -1" class="btn btn-danger" ng-click="deleteRow(editData)" style="float: left;">Delete</button>
                        <button ng-if="editItemIndex == -1" class="btn btn-success" ng-click="addRow(editData)" style="float: left;">Add</button>
                        <button ng-if="editItemIndex > -1" class="btn btn-info" ng-click="updateRow(editData,false)" style="float: left; margin-left: 40px;">Update</button>
                        <button type="button" ng-click="closeModal()" class="button small" style="float: right;">Close</button>
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

        <div ng-show="loadingfromserver" style="position: fixed; top: 10px; left: 10px;z-index: 1500; padding: 10px; background: #fff; border-radius: 10px;">
            <span class="loader working"></span> <span id="modal-status" style="color: #333;">Contacting server.. :)</span>
        </div>
        <div ng-show="loadingfromserver" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;"></div>

        <div style="position: fixed;top: 94px;bottom: 10px;z-index: 1500;" ng-style="filterMenuHide ? {'right': '570px'} : {'right': '830px'}">
            <div class="message tooltip  tracking" style="position: absolute; top: 0; opacity: 1; max-height: 100%; overflow: auto;" ng-show="showColumnsMenu" id="accesstestscroll">
                <div id='block-cols-list'></div>
            </div>
        </div>

        {{-- Login form --}}
        <div ng-show="showLoginForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap" id="login">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <img src="{{ url('assets/img/vanguard-logo.png') }}" alt="{{ settings('app_name') }}">
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
                                    <a href="<?= url('password/remind') ?>" class="forgot" style="top: 9px;">@lang('app.i_forgot_my_password')</a>
                                @endif
                            </div>
                            <div style="margin-bottom:20px;">

                                @if (settings('remember_me'))
                                    <input type="checkbox" name="remember" id="remember" value="1"/>
                                    <label for="remember" style="font-weight: 400;">@lang('app.remember_me')</label>
                                @endif

                                @if (settings('reg_enabled'))
                                    <a href="javascript:void(0)" ng-click="showLoginForm=false;showRegisterForm=true" style="float: right;color: #337ab7;">@lang('app.dont_have_an_account')</a>
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
        <div ng-show="showLoginForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;" ng-click="showLoginForm = false"></div>

        {{-- Register form --}}
        <div ng-show="showRegisterForm" style="position: fixed; top: 0; z-index: 1500;left: calc(50% - 240px);">
            <div class="auth" style="font-size: 14px;">
                <div class="auth-form" style="padding: 15px 15px 5px 15px;">
                    <div class="form-wrap">
                        <div style="text-align: center; margin-bottom: 25px;">
                            <img src="{{ url('assets/img/vanguard-logo.png') }}" alt="{{ settings('app_name') }}">
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
                            <div class="form-group input-icon">
                                <i class="fa fa-lock"></i>
                                <input type="password" name="password" class="form-control" placeholder="@lang('app.password')">
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
                                <a href="javascript:void(0)" ng-click="showRegisterForm=false;showLoginForm=true" style="color: #337ab7;">Already have account?</a>
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
        <div ng-show="showRegisterForm" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; opacity: 0.3; z-index: 1000; background: #000;" ng-click="showRegisterForm = false"></div>
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

    {!! HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js') !!}
    {!! HTML::script('https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular-route.js') !!}
    {!! HTML::script('https://maps.googleapis.com/maps/api/js?key=AIzaSyAGaaPdBTpcf_z_lLmhwxNwHESJhFQ4MGM&hl=en&language=en') !!}
    {!! HTML::script('assets/js/lib/jquery.mCustomScrollbar.concat.min.js') !!}
    {!! HTML::script('assets/js/lib/lodash.min.js') !!}
    {!! HTML::script('assets/js/lib/setup.js') !!}
    {!! HTML::script('assets/js/lib/developr.auto-resizing.js') !!}
    {!! HTML::script('assets/js/lib/developr.modal.js') !!}
    {!! HTML::script('assets/js/lib/developr.input.js') !!}
    {!! HTML::script('assets/js/lib/developr.scroll.js') !!}
    {!! HTML::script('assets/js/lib/angular-filter.min.js') !!}
    {!! HTML::script('assets/js/lib/route.js') !!}
    {!! HTML::script('assets/js/lib/API.js') !!}
    {!! HTML::script('assets/js/lib/mainController.js') !!}

    {{-- Login scripts --}}
    {!! HTML::script('assets/js/as/login.js') !!}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\LoginRequest', '#login-form') !!}

    {{-- Register scripts --}}
    {!! JsValidator::formRequest('Vanguard\Http\Requests\Auth\RegisterRequest', '#registration-form') !!}
</body>
</html>
