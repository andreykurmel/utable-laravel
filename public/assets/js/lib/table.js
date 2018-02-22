function setAllNullObj(obj) {
    var resObj = Object.assign({}, obj);
    Object.keys(resObj).forEach(function(k) {
        resObj[k] = null;
    });
    return resObj;
}

/* Page loading */
$(document).ready(function () {
    if (selectedTableName == "st") {
        $('.js_tableNameST').css('top', '50px');
    }

    $('#tableChanger').val( (selectedTableGroup ? selectedTableGroup+"/" : "") + selectedTableName );

    if (selectedTableName) {
        selectTable(selectedTableName);
        if (canEditSettings) {
            getDDLdatas(selectedTableName);
            getRightsDatas(selectedTableName);
        }
    }

    $(".table_body_viewport").mCustomScrollbar({
        scrollbarPosition: "outside",
        theme: "3d",
        scrollInertia: 300,
        axis: "y"
    });

    $('body').show();
});

/* --------------------- Variables ---------------------- */

var baseHttpUrl = "/api",
    selectedTableName = $('#inpSelectedTable').val(),
    selectedTableGroup = $('#inpSelectedTableGroup').val(),
    selectedEntries = $('#inpSelectedEntries').val(),
    selectedPage = 0,
    rowsCount = 0,
    filtersData = [],
    tableData = [],
    tableHeaders = [],
    tableDDLs = [],
    filterMaxHeight = 150,
    changedFilter = changedSearchKeyword = false,
    searchKeyword = "",
    filterMenuHide = false,
    markerBounds = {top:0, left:0, right:0, bottom:0},
    tower_types = {'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png'};

var curFilter = "";

var settingsTableName = 'tb_settings_display',
    settingsEntries = $('#inpSettingsEntries').val(),
    settingsPage = 0,
    settingsRowsCount = 0,
    settingsTableData = [],
    settingsTableHeaders = [],
    settingsTableDDLs = [],
    settingsChangedSearchKeyword = false,
    settingsSearchKeyword = "";

/* -------------------- Functions ---------------------- */

function selectTable(tableName) {
    $('.loadingFromServer').show();
    selectedPage = 0;
    searchKeyword = "";
    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
        data: {
            getfilters: true,
            p: 0,
            c: selectedEntries
        },
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            rowsCount = response.rows;
            tableData = response.data;
            tableHeaders = response.headers;
            tableDDLs = response.ddls;
            showDataTable(tableHeaders, tableData);
            showFiltersList(response.filters);
            showTableFooter();
            $('.loadingFromServer').hide();

            selectSettingsTable();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showTableFooter() {
    var lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;
    $('#showing_from_span').html((selectedPage)*lselectedEntries + 1);
    $('#showing_to_span').html((selectedPage+1)*selectedEntries < rowsCount ? (selectedPage+1)*lselectedEntries : rowsCount);
    $('#showing_all_span').html(rowsCount);


    var maxPage = lselectedEntries ? Math.ceil(rowsCount/lselectedEntries) : 1;
    var paginateBtns = [], pbtn;
    if (selectedPage+1 < 5) {
        var idx = 1;
        var maxStep = Math.min(5, maxPage);
        while (idx <= maxStep) {
            paginateBtns.push(idx);
            idx++;
        }
        if (idx < maxPage) {
            paginateBtns.push('...');
            paginateBtns.push(maxPage);
        }
    } else {
        if (selectedPage+1 > (maxPage-5)) {
            if (maxPage > 5) {
                paginateBtns.push(1);
                paginateBtns.push('...');
            }
            var idx = maxPage-5;
            while (idx <= maxPage) {
                paginateBtns.push(idx);
                idx++;
            }
        } else {
            paginateBtns.push(1);
            paginateBtns.push('...');
            paginateBtns.push(selectedPage);
            paginateBtns.push(selectedPage + 1);
            paginateBtns.push(selectedPage + 2);
            paginateBtns.push('...');
            paginateBtns.push(maxPage);
        }
    }

    var paginateHTML = '';
    for(var i = 0; i < paginateBtns.length; i++) {
        if (pbtn == '...') {
            paginateHTML += '<span>...</span>';
        } else {
            paginateHTML += '<a class="paginate_button" tabindex="0" onclick="changePage('+paginateBtns[i]+')">'+paginateBtns[i]+'</a>';
        }
    }
    $('#paginate_btns_span').html(paginateHTML);
}

function changePage(page) {
    $('.loadingFromServer').show();
    selectedPage = page-1;

    var query = {};
    if (searchKeyword) {
        query.searchKeyword = searchKeyword;
    }
    if (selectedTableName == 'st') {
        if ($('#frm-search-address').is(':visible')) {
            query.opt = 'address';
            query.street = $("#frm-address").val();
            query.city = $("#frm-city").val();
            query.state = $("#frm-state").val();
            query.county = $("#frm-county").val();
        } else if ($('#frm-search-latlng').is(':visible')) {
            query.opt = 'lat';
            query.lat_dec = $("#frm-dec-lat").val();
            query.long_dec = $("#frm-dec-lng").val();
            query.distance = $("#frm-dec-radius").val();
        }
    }
    query.changedKeyword = changedSearchKeyword;
    changedSearchKeyword = false;

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            tableName: selectedTableName,
            getfilters: true,
            p: selectedPage,
            c: selectedEntries,
            q: JSON.stringify(query),
            fields: JSON.stringify(tableHeaders),
            filterData: JSON.stringify(filtersData),
            changedFilter: JSON.stringify(changedFilter)
        },
        success: function (response) {
            changedFilter = false;
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            rowsCount = response.rows;
            tableData = response.data;
            tableHeaders = response.headers;
            showDataTable(tableHeaders, tableData);
            showFiltersList(response.filters);
            showTableFooter();
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    })
}

function showDataTable(headers, data) {
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key, tbDataHeaders = "", visibleColumns = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;

    for(var i = 0; i < data.length; i++) {
        if (canEdit) {
            tableData += "<tr>";
            tableData += '<td><a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a></td>';
            for(key in data[i]) {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + headers[key].input_type + '"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    (key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
            tableData += "</tr>";

            if (i == 0) {
                tbAddRow += "<tr style='height: 53px;'>";
                tbAddRow += '<td></td>';
                for(key in data[i]) {
                    tbAddRow +=
                        '<td ' +
                        'id="' + headers[key].field + i + headers[key].input_type + '_addrow"' +
                        'data-key="' + headers[key].field + '"' +
                        'data-input="' + headers[key].input_type + '"' +
                        'data-idx="' + i + '"' +
                        (key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '_addrow\', 0)"' : '') +
                        'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '"></td>';
                    /*if (key == 'id') {
                        tbAddRow += '<button class="btn btn-success" onclick="addRowInline()">Save</button></td>';
                    } else {
                        tbAddRow += '</td>';
                    }*/
                }
                tbAddRow += "</tr>";

                tbAddRow_h += "<tr style='visibility: hidden;height: 53px'><td></td>";
                for(key in data[i]) {
                    tbAddRow_h += '<td></td>';//(key == 'id' ? '<button class="btn btn-success">Save</button>' : '')
                }
                tbAddRow_h += "</tr>";
            }
        }

        tbHiddenData += "<tr>";
        if (canEdit) {
            tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a></td>';
        } else {
            tbHiddenData += '<td></td>';
        }
        for(key in data[i]) {
            tbHiddenData +=
                '<td ' +
                'data-key="' + headers[key].field + '"' +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            tbHiddenData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
        }
        tbHiddenData += "</tr>";
    }

    tbDataHeaders += "<tr><td class='sorting nowrap'><b>#</b></td>";
    for(var $hdr in headers) {
        tbDataHeaders += '<th class="sorting nowrap" data-key="' + headers[$hdr].field + '" style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">' + headers[$hdr].name + '</th>';

        visibleColumns += '<li style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">';
        visibleColumns +=   '<input id="' + headers[$hdr].field + '_visibility" onclick="showHideColumn(\'' + headers[$hdr].field + '\')" class="checkcols" type="checkbox" checked > ' +
                            '<label class="labels" for="{{ $hdr->field }}_visibility"> ' + headers[$hdr].name + ' </label>';
        visibleColumns += '</li>';
    }
    tbDataHeaders += "</tr>";

    $('#tbAddRow_header').html(tbDataHeaders);
    $('#tbHeaders_header').html(tbDataHeaders);
    $('#tbData_header').html(tbDataHeaders);

    $('#ul-cols-list').html(visibleColumns);

    $('#tbAddRow_body').html(tbAddRow + tbHiddenData);
    $('#tbHeaders_body').html(tbHiddenData);
    $('#tbData_body').html(canEdit ? tableData : tbHiddenData);

    if (selectedTableName == 'st') {
        for (var k = 0; k < data.length;k++) {
            if (data[k].lat_dec) {
                if (markerBounds.top == 0 || markerBounds.top < data[k].lat_dec) {
                    markerBounds.top = data[k].lat_dec
                }
                if (markerBounds.bottom == 0 || markerBounds.bottom > data[k].lat_dec) {
                    markerBounds.bottom = data[k].lat_dec
                }
            }
            if (data[k].long_dec) {
                if (markerBounds.left == 0 || markerBounds.left < data[k].long_dec) {
                    markerBounds.left = data[k].long_dec
                }
                if (markerBounds.right == 0 || markerBounds.right > data[k].long_dec) {
                    markerBounds.right = data[k].long_dec
                }
            }
        }
    }
}

function showFiltersList(filters) {
    filtersData = filters;
    filterMaxHeight = $("#acd-filter-menu").height() - filtersData.length * 40;
    var filtersHTML = '';
    for (var i = 0; i < filtersData.length; i++) {
        if (filtersData[i]) {
            filtersHTML += '<div>' +
                '<dt onclick="showFilterTabs('+i+')">'+filtersData[i].name+'</dt>' +
                '<dd class="acd-filter-elem" data-idx="'+i+'" style="position:relative;max-height: '+filterMaxHeight+'px;overflow: auto;'+(filtersData[i].name != curFilter ? 'display: none;' : '')+'">' +
                    '<div class="with-small-padding">' +
                        '<div class="blue-bg with-small-padding filterheader">' +
                            '<span class="checkbox replacement '+(filtersData[i].checkAll ? 'checked' : '')+'" tabindex="0" onclick="curFilter=filtersData['+i+'].name;filtersData['+i+'].checkAll=!filtersData['+i+'].checkAll;filterCheckAll('+i+', filtersData['+i+'].checkAll)">' +
                                '<span class="check-knob"></span>' +
                                '<input id="" checked="" class="" name="County" type="checkbox" value="County" tabindex="-1">' +
                            '</span>Check/Uncheck All' +
                        '</div>' +
                        '<ul class="list">';
            for (var j = 0; j < filtersData[i].val.length; j++) {
                filtersHTML += '<li>' +
                                '<span class="checkbox replacement mr5 '+(filtersData[i].val[j].checked ? 'checked' : '')+'" onclick="curFilter=filtersData['+i+'].name;filtersData['+i+'].val['+j+'].checked=!filtersData['+i+'].val['+j+'].checked;filterTable('+i+', filtersData['+i+'].val['+j+'].value, filtersData['+i+'].val['+j+'].checked)">' +
                                    '<span class="check-knob"></span><input type="checkbox" />' +
                                '</span>' +
                                '<span>' + filtersData[i].val[j].value + '</span>' +
                            '</li>';
            }
            filtersHTML += '</ul></div></dd></div>';
        }
    }
    $('#acd-filter-menu').html(filtersHTML);
}

function showFilterTabs(idx) {
    if ($('.acd-filter-elem[data-idx='+idx+']').is(':visible')) {
        $('.acd-filter-elem').hide();
    } else {
        $('.acd-filter-elem').hide();
        $('.acd-filter-elem[data-idx='+idx+']').show();
    }
}

function filterTable(idx, name, status) {
    var allStatus = status;
    if (allStatus) {
        filtersData[idx].val.forEach(function(item){
            if (!item.checked) {
                allStatus = false;
            }
        })
    }
    filtersData[idx].checkAll = allStatus;

    //get filtered data
    changedFilter = {
        name: filtersData[idx].key,
        val: name,
        status: status
    };
    changePage(1);
}

function filterCheckAll(idx, status) {
    filtersData[idx].val.forEach(function(item){
        item.checked = status;
    });

    //get filtered data
    changedFilter = {
        name: filtersData[idx].key,
        val: "all",
        status: status
    };
    changePage(1);
}

function showHideMenu() {
    filterMenuHide = !filterMenuHide;
    var right_scr = filterMenuHide ? "26px" : "286px";
    var right = filterMenuHide ? "20px" : "280px";
    var right_2 = filterMenuHide ? "570px" : "830px";
    $(".table_body_viewport > .mCSB_scrollTools").css("right", right_scr);
    $(".js-filterMenuHide").css("right", right);
    $(".js-filterMenuHide_2").css("right", right_2);
}

function toggleSearchType() {
    if ($('.js-showSearchType').is(':visible')) {
        $('.js-showSearchType').hide();
    } else {
        $('.js-showSearchType').show();
    }
}

function showLatSearch() {
    $("#search_type_address").removeClass("selected");
    $("#search_type_lat").addClass("selected");
    $("#frm-search-address").hide();
    $("#frm-search-latlng").show();
    $(".js-showSearchType_list").css('left','356px');
    $(".js-showSearchType").hide();
}

function showAddressSearch() {
    $("#search_type_address").addClass("selected");
    $("#search_type_lat").removeClass("selected");
    $("#frm-search-address").show();
    $("#frm-search-latlng").hide();
    $(".js-showSearchType_list").css('left','466px');
    $(".js-showSearchType").hide();
}

function showHideColumnsList() {
    if ($('#showHideColumnsList').is(':visible')) {
        $('#showHideColumnsList').hide();
    } else {
        $('#showHideColumnsList').show();
    }
}

function showHideColumn(fieldKey) {
    if (!$('#'+fieldKey+'_visibility').is(':checked')) {
        $('#tbAddRow th[data-key="'+fieldKey+'"], #tbAddRow td[data-key="'+fieldKey+'"]').hide();
        $('#tbHeaders th[data-key="'+fieldKey+'"], #tbHeaders td[data-key="'+fieldKey+'"]').hide();
        $('#tbData th[data-key="'+fieldKey+'"], #tbData td[data-key="'+fieldKey+'"]').hide();
    } else {
        $('#tbAddRow th[data-key="'+fieldKey+'"], #tbAddRow td[data-key="'+fieldKey+'"]').show();
        $('#tbHeaders th[data-key="'+fieldKey+'"], #tbHeaders td[data-key="'+fieldKey+'"]').show();
        $('#tbData th[data-key="'+fieldKey+'"], #tbData td[data-key="'+fieldKey+'"]').show();
    }
}

function favouriteToggle() {
    if ($('#favourite_star').hasClass('fa-star')) {
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/favouriteToggle?tableName=' + selectedTableName + '&status=Inactive'
        });
        $('#favourite_star').removeClass('fa-star').addClass('fa-star-o');
    } else {
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/favouriteToggle?tableName=' + selectedTableName + '&status=Active'
        });
        $('#favourite_star').removeClass('fa-star-o').addClass('fa-star');
    }
}

function showMap() {
    $("#li_list_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#li_map_view").addClass("active");
    $("#list_view").hide();
    $("#settings_view").hide();
    $("#map_view").show();
    initMap();
    $('.showhidemenu').hide();
    $('#showHideColumnsList').hide();
}

function showList() {
    $("#li_list_view").addClass("active");
    $("#li_map_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#list_view").show();
    $("#map_view").hide();
    $("#settings_view").hide();
    $('.showhidemenu').show();
}

function showSettings() {
    $("#li_settings_view").addClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#settings_view").show();
    $("#list_view").hide();
    $("#map_view").hide();
    $('.showhidemenu').hide();
    $('#showHideColumnsList').hide();
}

function detailsShowMap() {
    $("#details_li_list_view").removeClass("active");
    $("#details_li_map_view").addClass("active");
    $("#details_lview").hide();
    $("#details_gmap").show();
    initDetailsMap();
}

function detailsShowList() {
    $("#details_li_list_view").addClass("active");
    $("#details_li_map_view").removeClass("active");
    $("#details_lview").show();
    $("#details_gmap").hide();
}

function initMap() {
    var avg_lat = (Number(markerBounds.top) + Number(markerBounds.bottom)) / 2;
    var avg_lng = (Number(markerBounds.left) + Number(markerBounds.right)) / 2;
    var optionsMap = {
        zoom: 6,
        center: {lat: avg_lat, lng: avg_lng}
    };

    mapapp = new google.maps.Map(document.getElementById('map-google'), optionsMap);

    markers = [];
    var iconbasepath = "/assets/img/tables/", icon_path;
    for (var i=0; i<tableData.length; i++) {
        if (tableData[i].lat_dec && tableData[i].long_dec) {
            if (tableData[i].twr_type && tower_types[tableData[i].twr_type]) {
                icon_path = iconbasepath + tower_types[tableData[i].twr_type];
            } else {
                icon_path = iconbasepath + "cell_id.png";
            }
            markers[i] = new google.maps.Marker({
                position: {lat: Number(tableData[i].lat_dec), lng: Number(tableData[i].long_dec)},
                map: mapapp,
                icon: icon_path
            });
        }
    }
}

function initDetailsMap() {
    var avg_lat = (Number(markerBounds.top) + Number(markerBounds.bottom)) / 2;
    var avg_lng = (Number(markerBounds.left) + Number(markerBounds.right)) / 2;
    var optionsMap = {
        zoom: 6,
        center: {lat: avg_lat, lng: avg_lng}
    };

    mapapp = new google.maps.Map(document.getElementById('map-details'), optionsMap);

    var icon_path = "/assets/img/tables/";
    var edit_twr_type = $('#modals_inp_twr_type').val();
    if (edit_twr_type && tower_types[edit_twr_type]) {
        icon_path += tower_types[edit_twr_type];
    } else {
        icon_path += "cell_id.png";
    }
    detailsMarker = new google.maps.Marker({
        position: {lat: Number($('#modals_inp_lat_dec').val()), lng: Number($('#modals_inp_long_dec').val())},
        map: mapapp,
        icon: icon_path
    });
}

function downloaderGo(method) {
    var query = {};

    if (searchKeyword) {
        query.searchKeyword = searchKeyword;
    }

    if (selectedTableName == 'st') {
        if ($('#frm-search-address').is(':visible')) {
            query.opt = 'address';
            query.street = $("#frm-address").val();
            query.city = $("#frm-city").val();
            query.state = $("#frm-state").val();
            query.county = $("#frm-county").val();
        } else if ($('#frm-search-latlng').is(':visible')) {
            query.opt = 'lat';
            query.lat_dec = $("#frm-dec-lat").val();
            query.long_dec = $("#frm-dec-lng").val();
            query.distance = $("#frm-dec-radius").val();
        }
    }

    $('#downloader_tableName').val(selectedTableName);
    $('#downloader_method').val(method);
    $('#downloader_query').val(JSON.stringify(query));
    $('#downloader_fields').val(JSON.stringify(tableHeaders));
    $('#downloader_filters').val(JSON.stringify(filtersData));
    $('#downloader_form').submit();
}

function openPrintDialog() {
    $('.loadingFromServer').show();

    var query = {};

    if (searchKeyword) {
        query.searchKeyword = searchKeyword;
    }

    if (selectedTableName == 'st') {
        if ($('#frm-search-address').is(':visible')) {
            query.opt = 'address';
            query.street = $("#frm-address").val();
            query.city = $("#frm-city").val();
            query.state = $("#frm-state").val();
            query.county = $("#frm-county").val();
        } else if ($('#frm-search-latlng').is(':visible')) {
            query.opt = 'lat';
            query.lat_dec = $("#frm-dec-lat").val();
            query.long_dec = $("#frm-dec-lng").val();
            query.distance = $("#frm-dec-radius").val();
        }
    }

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            tableName: selectedTableName,
            getfilters: true,
            p: 0,
            c: 0,
            q: JSON.stringify(query),
            fields: JSON.stringify(tableHeaders),
            filterData: JSON.stringify(filtersData),
            changedFilter: JSON.stringify(changedFilter)
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }

            var html = "<table style='border-collapse: collapse;' width=\"100%\" page-break-inside: auto;>";
            var tableHeaders = response.headers;
            var tableData = response.data;
            var key;

            html += "<thead><tr>";
            for (var m = 0; m < tableHeaders.length; m++) {
                html += '<th style="border: solid 1px #000;padding: 3px 5px;background-color: #AAA; ' + (tableHeaders[key].web == 'No' ? 'display: none;' : '') + '">'+tableHeaders[m].name+'</th>';
            }
            html += "</tr></thead>";

            html += "<tbody>";
            for(var i = 0; i < tableData.length; i++) {
                html += "<tr>";
                for(key in tableData[i]) {
                    html += '<td style="border: solid 1px #000;padding: 3px 5px; ' + (tableHeaders[key].web == 'No' ? 'display: none;' : '') + '">' + (tableData[i][key] !== null ? tableData[i][key] : '') + '</td>';
                }
                html += "</tr>";
            }
            html += "</tbody>";
            html += "</table>";

            $("#div-print").html(html);

            $('.loadingFromServer').hide();
            window.print();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function changeEntries(val) {
    selectedEntries = val;
    $('.js-selected_entries_span').html(val);
    changePage(1);
    $('.entry-elem').removeClass('selected');
    $('.entry'+val).addClass('selected');
}

function searchKeywordChanged() {
    searchKeyword = $('#searchKeywordInp').val();
    changedSearchKeyword = true;
    changePage(1);
}

function showInlineEdit(id, instant) {
    var lv = $('#list_view').is(':visible'),
        ltableDDls = (lv ? tableDDLs : settingsTableDDLs);

    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var inp_t = $('#'+id).data('input'),
        idx = $('#'+id).data('idx'),
        key = $('#'+id).data('key');

    var not_instant_func = $('#'+id).data('settings') ?
        'onchange="updateSettingsRowLocal('+idx+',\''+key+'\',\''+id+'_inp\')"' :
        'onchange="updateAddRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ';

    if (key == 'ddl_id') {
        var html = '<select ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for(var i in settingsDDLs) {
            html += '<option value="'+settingsDDLs[i].id+'">'+settingsDDLs[i].name+'</option>';
        }
        html += '</select>';
    } else
    if (inp_t == 'input') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    } else
    if (inp_t == 'date') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'data-date-time-picker' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    } else
    if (inp_t == 'ddl') {
        var html = '<select ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for(var i in ltableDDls[key]) {
            html += '<option value="'+ltableDDls[key][i]+'">'+ltableDDls[key][i]+'</option>';
        }
        html += '</select>';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function hideInlineEdit(id) {
    $('#'+id)
        .html( $('#'+id).data('innerHTML') )
        .data('innerHTML', '');
}

function deleteRow(params) {
    var lv = $('#list_view').is(':visible'),
        lselectedTableName = (lv ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteTableRow?tableName=' + lselectedTableName + '&id=' + params.id,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.data.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
    if (lv) {
        showDataTable(tableHeaders, tableData);
    } else {
        showSettingsDataTable(settingsTableHeaders, settingsTableData);
    }
}

function addRow(params) {
    var lv = $('#list_view').is(':visible'),
        lselectedTableName = (lv ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        strParams += key + '=' + params[key] + '&';
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=' + lselectedTableName + '&' + strParams,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
    if (lv) {
        showDataTable(tableHeaders, tableData);
    } else {
        showSettingsDataTable(settingsTableHeaders, settingsTableData);
    }
}

function updateRow(params) {
    var lv = $('#list_view').is(':visible'),
        lselectedTableName = (lv ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        strParams += key + '=' + params[key] + '&';
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=' + lselectedTableName + '&' + strParams,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
    if (lv) {
        showDataTable(tableHeaders, tableData);
    } else {
        showSettingsDataTable(settingsTableHeaders, settingsTableData);
        changePage(1);
    }
}

function updateRowData(idx, key, id) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData);

    ltableData[idx][key] = $('#'+id).val();

    var par_id = id.substr(0, id.length-4);
    $('#'+id).data('innerHTML', ltableData[idx][key]);

    updateRow(ltableData[idx]);
}

function updateAddRowData(idx, key, id) {
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());
}

function updateRowModal() {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData);

    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx');
    for(var key in ltableData[idx]) {
        ltableData[idx][key] = $('#modals_inp_'+key).val();
    }

    updateRow(ltableData[idx]);
}

function addRowModal() {
    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx');
    for(var key in emptyDataObject) {
        emptyDataObject[key] = $('#modals_inp_'+key).val();
    }
    tableData.push(emptyDataObject);

    addRow(emptyDataObject);
}

function deleteRowModal() {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData);

    $('.js-editmodal').hide();
    var idx = $('.js-editmodal').data('idx');
    deleteRow(ltableData[idx]);
}

function editSelectedData(idx) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData),
        ltableHeaders = (lv ? tableHeaders : settingsTableHeaders),
        ltableDDLs = (lv ? tableDDLs : settingsTableDDLs);

    if (idx > -1) {
        $('#modal_btn_delete, #modal_btn_update').show();
        $('#modal_btn_add').hide();
    } else {
        $('#modal_btn_delete, #modal_btn_update').hide();
        $('#modal_btn_add').show();
    }
    var idx_loc = idx > -1 ? idx : 0;

    var html = "";
    for(var key in ltableData[idx_loc]) {
        if (key != 'id') {
            html += "<tr>";
            html +=
                '<td><label>' + ltableHeaders[key].name + '</label></td>' +
                '<td>';
            if (ltableHeaders[key].input_type == 'input') {
                html += '<input id="modals_inp_'+key+'" type="text" class="form-control" />';
            } else
            if (ltableHeaders[key].input_type == 'date') {
                html += '<input id="modals_inp_'+key+'" type="text" class="form-control" data-date-time-picker/>';
            } else
            if (ltableHeaders[key].input_type == 'ddl') {
                html += '<select id="modals_inp_'+key+'" class="form-control" style="margin-bottom: 5px">';
                for(var i in ltableDDLs[key]) {
                    html += '<option val="'+ltableDDLs[key][i]+'">'+ltableDDLs[key][i]+'</option>';
                }
                html += '</select>';
            }
            else {
                html += '<input id="modals_inp_'+key+'" type="text" class="form-control" readonly/>';
            }
            html += '</td>';
            html += "</tr>";
        }
    }
    $('#modals_rows').html(html);

    //set current values for editing
    if (idx > -1) {
        for(var key in ltableData[idx]) {
            $('#modals_inp_'+key).val( ltableData[idx][key] );
        }
    }

    $('.js-editmodal').data('idx', idx);
    if (!$('#addingIsInline').is(':checked') || idx > -1 || !lv) {
        $('.js-editmodal').show();
    }
}

function addData() {
    if ($('#addingIsInline').is(':checked')) {
        addRowInline();
    } else {
        var lv = $('#list_view').is(':visible'),
            ltableHeaders = (lv ? tableHeaders : settingsTableHeaders);

        emptyDataObject = {};
        for (var key in ltableHeaders) {
            emptyDataObject[key] = "";
        }

        editSelectedData(-1);
    }
}

function addRowInline() {
    emptyDataObject = {};
    for(var key in tableHeaders) {
        emptyDataObject[key] = $('#' + tableHeaders[key].field + 0 + tableHeaders[key].input_type + '_addrow').html();
    }
    tableData.push(emptyDataObject);

    addRow(emptyDataObject);
    editSelectedData(-1);
}

function checkboxAddToggle() {
    if ($('#addingIsInline').is(':checked')) {
        var lv = $('#list_view').is(':visible'),
            ltableHeaders = (lv ? tableHeaders : settingsTableHeaders);

        emptyDataObject = {};
        for (var key in ltableHeaders) {
            emptyDataObject[key] = "";
        }

        $('#tbAddRow').show();
        $('#tbHeaders').css('top', '53px');
        $('#divTbData').css('top', '90px');

        editSelectedData(-1);
    } else {
        $('#tbAddRow').hide();
        $('#tbHeaders').css('top', '0');
        $('#divTbData').css('top', '37px');
    }
}







/* ------------------------ Settings / tab 'Display' ----------------------------*/

function selectSettingsTable() {
    $('.loadingFromServer').show();
    settingsPage = 0;
    settingsSearchKeyword = "";

    for(var key in tableHeaders) {
        var tb_id = tableHeaders[key]['tb_id'];
        break;
    }

    var query = {'opt': 'settings', 'tb_id': tb_id};

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable?tableName=' + settingsTableName,
        data: {
            getfilters: true,
            p: 0,
            c: settingsEntries,
            q: JSON.stringify(query)
        },
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            settingsRowsCount = response.rows;
            settingsTableData = response.data;
            settingsTableHeaders = response.headers;
            settingsTableDDLs = response.ddls;
            showSettingsDataTable(settingsTableHeaders, settingsTableData);
            showSettingsTableFooter();
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function changeSettingsPage(page) {
    $('.loadingFromServer').show();
    settingsPage = page-1;

    for(var key in tableHeaders) {
        var tb_id = tableHeaders[key]['tb_id'];
        break;
    }

    var query = {'opt': 'settings', 'tb_id': tb_id};
    if (settingsSearchKeyword) {
        query.searchKeyword = settingsSearchKeyword;
    }
    query.changedKeyword = settingsChangedSearchKeyword;
    settingsChangedSearchKeyword = false;

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            tableName: settingsTableName,
            getfilters: true,
            p: settingsPage,
            c: settingsEntries,
            q: JSON.stringify(query),
            fields: JSON.stringify(settingsTableHeaders)
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            settingsRowsCount = response.rows;
            settingsTableData = response.data;
            settingsTableHeaders = response.headers;
            settingsTableDDLs = response.ddls;
            showSettingsDataTable(settingsTableHeaders, settingsTableData);
            showSettingsTableFooter();
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    })
}

function showSettingsDataTable(headers, data) {
    var tableData = "", tbHiddenData = "", key,
        lsettingsEntries = settingsEntries == 'All' ? 0 : settingsEntries;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td><a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        for(key in data[i]) {
            tableData +=
                '<td ' +
                'id="' + headers[key].field + i + headers[key].input_type + '"' +
                'data-key="' + headers[key].field + '"' +
                'data-input="' + headers[key].input_type + '"' +
                'data-idx="' + i + '"' +
                'data-settings="true"' +
                (key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '\', '+canEditSettings+')"' : '') +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        if (canEditSettings) {
            tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        } else {
            tbHiddenData += '<td></td>';
        }
        for(key in data[i]) {
            tbHiddenData +=
                '<td ' +
                'data-key="' + headers[key].field + '"' +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            tbHiddenData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
        }
        tbHiddenData += "</tr>";
    }
    $('#tbSettingsHeaders_body').html(tbHiddenData);
    $('#tbSettingsData_body').html(tableData);
}

function showSettingsTableFooter() {
    var lsettingsEntries = settingsEntries == 'All' ? 0 : settingsEntries;
    $('#showing_settings_from_span').html((settingsPage)*lsettingsEntries + 1);
    $('#showing_settings_to_span').html((settingsPage+1)*settingsEntries < settingsRowsCount ? (settingsPage+1)*lsettingsEntries : settingsRowsCount);
    $('#showing_settings_all_span').html(settingsRowsCount);


    var maxPage = lsettingsEntries ? Math.ceil(settingsRowsCount/lsettingsEntries) : 1;
    var paginateBtns = [], pbtn;
    if (settingsPage+1 < 5) {
        var idx = 1;
        var maxStep = Math.min(5, maxPage);
        while (idx <= maxStep) {
            paginateBtns.push(idx);
            idx++;
        }
        if (idx < maxPage) {
            paginateBtns.push('...');
            paginateBtns.push(maxPage);
        }
    } else {
        if (settingsPage+1 > (maxPage-5)) {
            if (maxPage > 5) {
                paginateBtns.push(1);
                paginateBtns.push('...');
            }
            var idx = maxPage-5;
            while (idx <= maxPage) {
                paginateBtns.push(idx);
                idx++;
            }
        } else {
            paginateBtns.push(1);
            paginateBtns.push('...');
            paginateBtns.push(settingsPage);
            paginateBtns.push(settingsPage + 1);
            paginateBtns.push(settingsPage + 2);
            paginateBtns.push('...');
            paginateBtns.push(maxPage);
        }
    }

    var paginateHTML = '';
    for(var i = 0; i < paginateBtns.length; i++) {
        if (pbtn == '...') {
            paginateHTML += '<span>...</span>';
        } else {
            paginateHTML += '<a class="paginate_button" tabindex="0" onclick="changeSettingsPage('+paginateBtns[i]+')">'+paginateBtns[i]+'</a>';
        }
    }
    $('#paginate_settings_btns_span').html(paginateHTML);
}

function searchSettingsKeywordChanged() {
    settingsSearchKeyword = $('#searchSettingsKeywordInp').val();
    settingsChangedSearchKeyword = true;
    changeSettingsPage(1);
}

function changeSettingsEntries(val) {
    settingsEntries = val;
    $('.js-selected_settings_entries_span').html(val);
    changeSettingsPage(1);
    $('.entry-elem-s').removeClass('selected');
    $('.entry-s-'+val).addClass('selected');
}

function updateSettingsRowLocal(idx, key, id) {
    //update val in settings table
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    var val = $('#'+id).val();
    var header_key = settingsTableData[idx]['field'];
    if (key == "sum") {
        /*$scope.sumArr = [];
        for (var l = 0; l < $scope.uTableSettings.length; l++) {
            if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].sum == 'Yes') {
                $scope.sumArr.push({ "key": $scope.uTableSettings[l].field, "total": 0 });
            }
        }
        for (var k = 0; k < $scope.selectedTableData.length;k++) {
            for (var m = 0; m < $scope.sumArr.length;m++) {
                if ($scope.selectedTableData[k][$scope.sumArr[m].key] && !isNaN($scope.selectedTableData[k][$scope.sumArr[m].key])) {
                    $scope.sumArr[m].total += Number($scope.selectedTableData[k][$scope.sumArr[m].key]);
                }
            }
        }*/
    } else if (key == "filter") {
        if (val == "Yes") {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/loadFilter?tableName=' + selectedTableName + '&field='+ tableHeaders[header_key].field +'&name='+ tableHeaders[header_key].name,
                success: function (response) {
                    filtersData.push(response);
                    showFiltersList(filtersData);
                }
            });
        } else {
            for (var l = 0; l < filtersData.length; l++) {
                if (filtersData[l].key == header_key) {
                    delete filtersData[l];
                    break;
                }
            }
            showFiltersList(filtersData);
        }
    } else if (key == "web") {
        if (val == "No") {
            $('#tbAddRow th[data-key="'+header_key+'"], #tbAddRow td[data-key="'+header_key+'"]').hide();
            $('#tbHeaders th[data-key="'+header_key+'"], #tbHeaders td[data-key="'+header_key+'"]').hide();
            $('#tbData th[data-key="'+header_key+'"], #tbData td[data-key="'+header_key+'"]').hide();
        } else {
            $('#tbAddRow th[data-key="'+header_key+'"], #tbAddRow td[data-key="'+header_key+'"]').show();
            $('#tbHeaders th[data-key="'+header_key+'"], #tbHeaders td[data-key="'+header_key+'"]').show();
            $('#tbData th[data-key="'+header_key+'"], #tbData td[data-key="'+header_key+'"]').show();
        }
    }
}

function settingsTabShowRights() {
    $('#div_settings_ddl').hide();
    $('#div_settings_display').hide();
    $('#div_settings_rights').show();
    $('#li_settings_display').removeClass('active');
    $('#li_settings_ddl').removeClass('active');
    $('#li_settings_rights').addClass('active');
}

function settingsTabShowDDL() {
    $('#div_settings_rights').hide();
    $('#div_settings_display').hide();
    $('#div_settings_ddl').show();
    $('#li_settings_rights').removeClass('active');
    $('#li_settings_display').removeClass('active');
    $('#li_settings_ddl').addClass('active');
}

function settingsTabShowDisplay() {
    $('#div_settings_rights').hide();
    $('#div_settings_ddl').hide();
    $('#div_settings_display').show();
    $('#li_settings_rights').removeClass('active');
    $('#li_settings_ddl').removeClass('active');
    $('#li_settings_display').addClass('active');
}











/* ------------------------ Settings / tab 'DDL' ----------------------------*/

var settingsDDLs,
    settingsDDL_hdr,
    settingsDDL_items_hdr,
    settingsDDL_Obj,
    settingsDDL_ItemsObj,
    settingsDDL_selectedIndex = -1,
    settingsDDL_TableMeta;

function getDDLdatas(tableName) {
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/getDDLdatas?tableName=' + tableName,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            settingsDDLs = response.data;
            settingsDDL_hdr = response.DDL_hdr;
            settingsDDL_items_hdr = response.DDL_items_hdr;
            settingsDDL_TableMeta = response.table_meta;
            availableDDL = response.available_DDL;
            settingsDDL_Obj = setAllNullObj(settingsDDL_hdr);
            settingsDDL_ItemsObj = setAllNullObj(settingsDDL_items_hdr);
            showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showSettingsDDLDataTable(headers, data, idx) {
    var tableData = "", tbHiddenData = "", tbAddRow = "", key;

    if (settingsDDL_selectedIndex > -1) {
        $('#row_' + settingsDDL_selectedIndex + '_settings_ddl').css('background-color', '#FFA');
    }

    if (idx > -1) {
        data = settingsDDLs[idx].items;
        $('.settings_ddl_rows').css('background-color', '#FFF');
        $('#row_' + idx + '_settings_ddl').css('background-color', '#FFA');
        $('#add_settings_ddl_item_btn').show();
        settingsDDL_selectedIndex = idx;
    }

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr id='row_" + i + "_settings_ddl' class='settings_ddl_rows'>";
        tableData += '<td><a '+(idx == -1 ? 'onclick="showSettingsDDLDataTable(settingsDDL_items_hdr, \'\', '+i+')"' : '')+' class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1) +'</b></a></td>';
        for(key in data[i]) {
            if (key != 'items') {
                tableData +=
                    '<td ' +
                    'id="' + key + i + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '"' +
                    'data-key="' + key + '"' +
                    'data-idx="' + i + '"' +
                    'data-table="' + (idx == -1 ? 'ddl' : 'ddl_items') + '"' +
                    'data-table_idx="' + idx + '"' +
                    ((key == 'name' || key == 'option' || key == 'notes') ? 'onclick="showInlineEdit_SDDL(\'' + key + i + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
        }
        tableData += "<td><button onclick='deleteSettingsDDL(\""+(idx == -1 ? 'ddl' : 'ddl_items')+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
        tableData += "</tr>";

        tbHiddenData += "<tr style='visibility: hidden;'>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        for(key in data[i]) {
            if (key != 'items') {
                tbHiddenData += '<td style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    (data[i][key] !== null ? data[i][key] : '') +
                    '</td>';
            }
        }
        tbHiddenData += "<td><button><i class='fa fa-trash-o'></i></button></td>";
        tbHiddenData += "</tr>";
    }

    tbAddRow += "<tr style='height: 37px;'><td></td>";
    for(key in headers) {
        if (key != 'items') {
            tbAddRow += '<td ' +
                'id="add_' + key + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '"' +
                'data-key="' + key + '"' +
                'data-table="' + (idx == -1 ? 'ddl' : 'ddl_items') + '"' +
                ((key == 'name' || key == 'option' || key == 'notes') ? 'onclick="showInlineEdit_SDDL(\'add_' + key + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '\', 0)"' : '') +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    (key == 'list_id' ? settingsDDLs[settingsDDL_selectedIndex].id : '') +
                    (key == 'id' ? 'auto' : '') +
                '</td>';
        }
    }
    tbAddRow += "<td></td>";
    tbAddRow += "</tr>";

    if (idx > -1) {
        $('#tbSettingsDDL_Items_addrow').html(tbAddRow+tbHiddenData);
        $('#tbSettingsDDL_Items_headers').html(tbHiddenData);
        $('#tbSettingsDDL_Items_data').html(tableData);
    } else {
        $('#tbSettingsDDL_addrow').html(tbAddRow+tbHiddenData);
        $('#tbSettingsDDL_headers').html(tbHiddenData);
        $('#tbSettingsDDL_data').html(tableData);
    }
}

function showInlineEdit_SDDL(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var inp_t = $('#'+id).data('input'),
        idx = $('#'+id).data('idx'),
        key = $('#'+id).data('key');

    var html = '<input ' +
        'id="'+id+'_inp" ' +
        'data-key="' + $('#'+id).data('key') + '"' +
        'data-idx="' + $('#'+id).data('idx') + '"' +
        'data-table="' + $('#'+id).data('table') + '"' +
        'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
        'onblur="hideInlineEdit(\''+id+'\')" ' +
        'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
        'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function updateSettingsDDL(id) {
    //update in the table view
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    var table = $('#'+id).data('table'),
        idx = $('#'+id).data('idx'),
        table_idx = $('#'+id).data('table_idx'),
        key_name = $('#'+id).data('key'),
        tableName, params;
    if (table === 'ddl') {
        settingsDDLs[idx][key_name] = $('#'+id).val();
        tableName = 'ddl';
        params = settingsDDLs[idx];
    } else {
        settingsDDLs[table_idx].items[idx][key_name] = $('#'+id).val();
        tableName = 'ddl_items';
        params = settingsDDLs[table_idx].items[idx];
    }

    var strParams = "";
    for (var key in params) {
        if (key != 'items' && params[key] !== null) {
            strParams += key + '=' + params[key] + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=' + tableName + '&' + strParams,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function addSettingsDDL(id) {
    //update in the table view
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    var table = $('#'+id).data('table'),
        key_name = $('#'+id).data('key');

    if (table == 'ddl') {
        settingsDDL_Obj[key_name] = $('#'+id).val();
    } else {
        settingsDDL_ItemsObj[key_name] = $('#'+id).val();
    }
}

function deleteSettingsDDL(tableName, rowId, idx) {
    if (tableName == 'ddl') {
        settingsDDLs.splice(idx, 1);
        showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
    } else {
        settingsDDLs[settingsDDL_selectedIndex].items.splice(idx, 1);
        showSettingsDDLDataTable(settingsDDL_items_hdr, settingsDDLs[settingsDDL_selectedIndex].items, settingsDDL_selectedIndex);
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteTableRow?tableName=' + tableName + '&id=' + rowId,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function saveSettingsDDLRow(tableName) {
    if (tableName == 'ddl') {
        settingsDDL_Obj['items'] = [];
        settingsDDL_Obj['tb_id'] = settingsDDL_TableMeta.id;
    } else {
        settingsDDL_ItemsObj['list_id'] = settingsDDLs[settingsDDL_selectedIndex].id;
    }

    var params = (tableName == 'ddl' ? settingsDDL_Obj : settingsDDL_ItemsObj);
    var strParams = "";
    for (var key in params) {
        if (key != 'items' && params[key] !== null) {
            strParams += key + '=' + params[key] + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=' + tableName + '&' + strParams,
        success: function (response) {
            //console.log(response);

            if (tableName == 'ddl') {
                settingsDDL_Obj.id = response.last_id;
                settingsDDLs.push(settingsDDL_Obj);
                settingsDDL_Obj = setAllNullObj(settingsDDL_hdr);
                showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
            } else {
                settingsDDL_ItemsObj.id = response.last_id;
                settingsDDLs[settingsDDL_selectedIndex].items.push(settingsDDL_ItemsObj);
                settingsDDL_ItemsObj = setAllNullObj(settingsDDL_items_hdr);
                showSettingsDDLDataTable(settingsDDL_items_hdr, '', settingsDDL_selectedIndex);
            }

            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}











/* ------------------------ Settings / tab 'Rights' ----------------------------*/

var settingsRights,
    settingsRights_hdr,
    settingsRights_Obj;

function getRightsDatas(tableName) {
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/getRightsDatas?tableName=' + tableName,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);
            settingsRights = response.data;
            settingsRights_hdr = response.data_hdr;
            settingsRights_Obj = setAllNullObj(settingsRights_hdr);
            showSettingsRightsDataTable(settingsRights_hdr, settingsRights);
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showSettingsRightsDataTable(headers, data) {
    var tableData = "", tbAddRow = "", key;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        for(key in data[i]) {
            if (key !== 'username') {
                tableData += '<td style="' + (headers[key].web === 'No' ? 'display: none;' : '') + '">';
                if (key === 'user_id') {
                    tableData += (data[i].username !== null ? data[i].username : '');
                } else {
                    tableData += (data[i][key] !== null ? data[i][key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "<td><button onclick='deleteSettingsRight("+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
        tableData += "</tr>";
    }

    tbAddRow += "<tr style='height: 37px;'><td></td>";
    for(key in headers) {
        if (key != 'username') {
            tbAddRow += '<td ' +
                'id="add_' + key + '_settings_rights"' +
                'data-key="' + key + '"' +
                ((key == 'user_id' || key == 'right') ? 'onclick="showInlineEdit_Rights(\'add_' + key + '_settings_rights\', \'' + key + '\')"' : '') +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    ((key != 'user_id' && key != 'right') ? 'auto' : '') +
                '</td>';
        }
    }
    tbAddRow += "<td></td>";
    tbAddRow += "</tr>";

    $('#tbSettingsRights_addrow').html(tbAddRow+tableData);
    $('#tbSettingsRights_headers').html(tableData);
    $('#tbSettingsRights_data').html(tableData);
}

function showInlineEdit_Rights(id, key) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    var html;
    if (key == 'user_id') {
        html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="addSettingsRight(\''+id+'_inp\', \'user_id\')" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    } else {
        html = '<select class="form-control" ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="addSettingsRight(\''+id+'_inp\', \'right\')" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        html += '<option>All</option>';
        html += '<option>View</option>';
        html += '</select>';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function addSettingsRight(id, key) {
    //update in the table view
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    settingsRights_Obj[key] = $('#'+id).val();
}

function saveSettingsRightRow() {
    settingsRights_Obj['table_id'] = settingsDDL_TableMeta.id;

    var strParams = "";
    for (var key in settingsRights_Obj) {
        if (key !== 'username' && settingsRights_Obj[key] !== null) {
            strParams += key + '=' + settingsRights_Obj[key] + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addRightsDatas?tableName=rights&' + strParams,
        success: function (response) {
            //console.log(response);

            settingsRights_Obj.id = response.last_id;
            settingsRights.push(settingsRights_Obj);
            settingsRights_Obj = setAllNullObj(settingsRights_hdr);
            showSettingsRightsDataTable(settingsRights_hdr, settingsRights);

            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function deleteSettingsRight(rowId, idx) {
    settingsRights.splice(idx, 1);
    showSettingsRightsDataTable(settingsRights_hdr, settingsRights);

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteRightsDatas?id=' + rowId,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}