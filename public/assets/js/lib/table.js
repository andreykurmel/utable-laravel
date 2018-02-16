/* Page loading */
$(document).ready(function () {
    if (selectedTableName == "st") {
        $('.js_tableNameST').css('top', '50px');
    }

    $('#tableChanger').val( (selectedTableGroup ? selectedTableGroup+"/" : "") + selectedTableName );

    if (selectedTableName) {
        selectTable(selectedTableName);
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
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key,
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;

    for(var i = 0; i < data.length; i++) {
        if (canEdit) {
            tableData += "<tr>";
            for(key in data[i]) {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + headers[key].input_type + '"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    (key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (key == 'id') {
                    tableData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a></td>';
                } else {
                    tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
                }
            }
            tableData += "</tr>";

            if (i == 0) {
                tbAddRow += "<tr style='height: 53px;'>";
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

                tbAddRow_h += "<tr style='visibility: hidden;height: 53px'>";
                for(key in data[i]) {
                    tbAddRow_h += '<td></td>';//(key == 'id' ? '<button class="btn btn-success">Save</button>' : '')
                }
                tbAddRow_h += "</tr>";
            }
        }

        tbHiddenData += "<tr>";
        for(key in data[i]) {
            tbHiddenData +=
                '<td ' +
                'data-key="' + headers[key].field + '"' +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            if (key == 'id' && canEdit) {
                tbHiddenData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a></td>';
            } else {
                tbHiddenData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
        }
        tbHiddenData += "</tr>";
    }
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

    if (inp_t == 'input') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    }
    if (inp_t == 'date') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'data-date-time-picker' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    }
    if (inp_t == 'ddl') {
        var html = '<select ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for(var i in ltableDDls[key]) {
            html += '<option val="'+ltableDDls[key][i]+'">'+ltableDDls[key][i]+'</option>';
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







/* ------------------ Settings table functions -------------------- */

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
            if (key == 'id') {
                tableData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
            } else {
                tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        for(key in data[i]) {
            tbHiddenData +=
                '<td ' +
                'data-key="' + headers[key].field + '"' +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            if (key == 'id' && canEditSettings) {
                tbHiddenData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
            } else {
                tbHiddenData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
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
    }
}

function settingsTabShowDDL() {
    $('#div_settings_display').hide();
    $('#div_settings_ddl').show();
    $('#li_settings_display').removeClass('active');
    $('#li_settings_ddl').addClass('active');
}

function settingsTabShowDisplay() {
    $('#div_settings_ddl').hide();
    $('#div_settings_display').show();
    $('#li_settings_ddl').removeClass('active');
    $('#li_settings_display').addClass('active');
}