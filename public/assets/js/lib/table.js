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
    filterMaxHeight = 150,
    changedFilter = changedSearchKeyword = false,
    searchKeyword = "",
    filterMenuHide = false,
    markerBounds = {top:0, left:0, right:0, bottom:0},
    tower_types = {'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png'};

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
            showDataTable(tableHeaders, tableData);
            showFiltersList(response.filters);
            showTableFooter();
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showTableFooter() {
    $('#showing_from_span').html((selectedPage)*selectedEntries + 1);
    $('#showing_to_span').html((selectedPage+1)*selectedEntries < rowsCount ? (selectedPage+1)*selectedEntries : rowsCount);
    $('#showing_all_span').html(rowsCount);


    var maxPage = Math.ceil(rowsCount/selectedEntries);
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
    var tableData = "", tbHiddenData = "", key;
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
                    (key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '\')"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (key == 'id') {
                    tableData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*selectedEntries)) +'</b></a></td>';
                } else {
                    tableData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
                }
            }
            tableData += "</tr>";
        }

        tbHiddenData += "<tr>";
        for(key in data[i]) {
            tbHiddenData +=
                '<td ' +
                'data-key="' + headers[key].field + '"' +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
            if (key == 'id' && canEdit) {
                tbHiddenData += '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*selectedEntries)) +'</b></a></td>';
            } else {
                tbHiddenData += (data[i][key] !== null ? data[i][key] : '') + '</td>';
            }
        }
        tbHiddenData += "</tr>";
    }
    $('#tbAddrow_body').html(tbHiddenData);
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
        filtersHTML += '<div>' +
            '<dt onclick="showFilterTabs('+i+')">'+filtersData[i].name+'</dt>' +
            '<dd class="acd-filter-elem" data-idx="'+i+'" style="position:relative;max-height: '+filterMaxHeight+'px;overflow: auto;display: none;">' +
                '<div class="with-small-padding">' +
                    '<div class="blue-bg with-small-padding filterheader">' +
                        '<span class="checkbox replacement '+(filtersData[i].checkAll ? 'checked' : '')+'" tabindex="0" onclick="filtersData['+i+'].checkAll=!filtersData['+i+'].checkAll;filterCheckAll('+i+', filtersData['+i+'].checkAll)">' +
                            '<span class="check-knob"></span>' +
                            '<input id="" checked="" class="" name="County" type="checkbox" value="County" tabindex="-1">' +
                        '</span>Check/Uncheck All' +
                    '</div>' +
                    '<ul class="list">';
        for (var j = 0; j < filtersData[i].val.length; j++) {
            filtersHTML += '<li>' +
                            '<span class="checkbox replacement mr5 '+(filtersData[i].val[j].checked ? 'checked' : '')+'" onclick="filtersData['+i+'].val['+j+'].checked=!filtersData['+i+'].val['+j+'].checked;filterTable('+i+', filtersData['+i+'].val['+j+'].value, filtersData['+i+'].val['+j+'].checked)">' +
                                '<span class="check-knob"></span><input type="checkbox" />' +
                            '</span>' +
                            '<span>' + filtersData[i].val[j].value + '</span>' +
                        '</li>';
        }
        filtersHTML += '</ul></div></dd></div>';
    }
    $('#acd-filter-menu').html(filtersHTML);
}

function showFilterTabs(idx) {
    $('.acd-filter-elem').hide();
    $('.acd-filter-elem[data-idx='+idx+']').show();
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

/*function initDetailsMap() {
    var avg_lat = (Number(markerBounds.top) + Number(markerBounds.bottom)) / 2;
    var avg_lng = (Number(markerBounds.left) + Number(markerBounds.right)) / 2;
    var optionsMap = {
        zoom: 6,
        center: {lat: avg_lat, lng: avg_lng}
    };

    mapapp = new google.maps.Map(document.getElementById('map-details'), optionsMap);

    var icon_path = "assets/img/tables/";
    if (editData.twr_type && tower_types[editData.twr_type]) {
        icon_path += tower_types[editData.twr_type];
    } else {
        icon_path += "cell_id.png";
    }
    detailsMarker = new google.maps.Marker({
        position: {lat: Number(editData.lat_dec), lng: Number(editData.long_dec)},
        map: mapapp,
        icon: icon_path
    });
}*/

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
    changePage(1);
    $('#selected_entries_span').html(val);
    $('.entry-elem').removeClass('selected');
    $('.entry'+val).addClass('selected');
}

function searchKeywordChanged() {
    searchKeyword = $('#searchKeywordInp').val();
    changedSearchKeyword = true;
    changePage(1);
}

function showInlineEdit(id) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var inp_t = $('#'+id).data('input'),
        idx = $('#'+id).data('idx'),
        key = $('#'+id).data('key');

    if (inp_t == 'input') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;"' +
            'value="' + $('#'+id).html() + '">';
    }
    if (inp_t == 'date') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'data-date-time-picker' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            'value="' + $('#'+id).html() + '">';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').focus();
}

function hideInlineEdit(id) {
    $('#'+id)
        .html( $('#'+id).data('innerHTML') )
        .data('innerHTML', '');
}

function deleteRow(params) {
    $('.loadingFromServer').show();

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteTableRow?tableName=' + selectedTableName + '&id=' + params.id,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.data.msg);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function addRow(params) {
    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        strParams += key + '=' + params[key] + '&';
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=' + selectedTableName + '&' + strParams,
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

function updateRow(params) {
    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        strParams += key + '=' + params[key] + '&';
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=' + selectedTableName + '&' + strParams,
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

function updateRowData(idx, key, id) {
    tableData[idx][key] = $('#'+id).val();

    var par_id = id.substr(0, id.length-4);
    $('#'+id).data('innerHTML', tableData[idx][key]);

    updateRow(tableData[idx]);
}

function updateRowModal() {
    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx');
    for(var key in tableData[idx]) {
        tableData[idx][key] = $('#modals_inp_'+key).val();
    }

    showDataTable(tableHeaders, tableData);
    updateRow(tableData[idx]);
}

function addRowModal() {
    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx');
    for(var key in tableData[idx]) {
        tableData[idx][key] = $('#modals_inp_'+key).val();
    }

    showDataTable(tableHeaders, tableData);
    addRow(tableData[idx]);
}

function deleteRowModal() {
    $('.js-editmodal').hide();
    var idx = $('.js-editmodal').data('idx');
    showDataTable(tableHeaders, tableData);
    deleteRow(tableData[idx]);
}

function editSelectedData(idx) {
    if (idx > -1) {
        $('#modal_btn_delete, #modal_btn_update').show();
        $('#modal_btn_add').hide();
    } else {
        $('#modal_btn_delete, #modal_btn_update').hide();
        $('#modal_btn_add').show();
    }

    var html = "";
    for(var key in tableData[idx]) {
        html += "<tr>";
        html +=
            '<td><label>' + tableHeaders[key].name + '</label></td>' +
            '<td>';
        if (tableHeaders[key].input_type == 'input') {
            html += '<input id="modals_inp_'+key+'" type="text" class="form-control" value="'+tableData[idx][key]+'"/>';
        } else
        if (tableHeaders[key].input_type == 'date') {
            html += '<input id="modals_inp_'+key+'" type="text" class="form-control" value="'+tableData[idx][key]+'" data-date-time-picker/>';
        }
        else {
            html += '<input id="modals_inp_'+key+'" type="text" class="form-control" value="'+tableData[idx][key]+'" readonly/>';
        }
        html += '</td>';
        html += "</tr>";
    }
    $('#modals_rows').html(html);

    $('.js-editmodal').data('idx', idx);
    $('.js-editmodal').show();
}