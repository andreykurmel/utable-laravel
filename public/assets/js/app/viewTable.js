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

    $('#tableChanger').val( window.location.href  );

    if (view_id) {
        selectView(view_id);
    } else {
        if (selectedTableName) {
            selectTable(selectedTableName);
            if (authUser) {//canEditSettings
                getDDLdatas(selectedTableName);
                getRightsDatas(selectedTableName);
            }
        }
    }


    $(".table_body_viewport").mCustomScrollbar({
        scrollbarPosition: "outside",
        theme: "3d",
        scrollInertia: 0,
        axis: "y"
    });

    $('#selectUserSearch, #transferUserSearch').select2({
        ajax: {
            url: baseHttpUrl+'/ajaxSearchUser',
            dataType: 'json',
            delay: 250
        },
        minimumInputLength: 3,
        width: '100%',
        height: '100%'
    });

    $('body').show();

    $(document).keyup(function (e) {
        if (e.ctrlKey && e.keyCode == 39) {
            $('#open-menu').trigger("click");
        }
    });

    $(document).keydown(function (e) {
        if (e.keyCode == 27) {
            //hide popups by pressing 'esc'
            $('.loginForm, .registerForm, .passResetForm').hide();
            $('#modals, .editSidebarTableForm, .transferTableForm').hide();
            hideEditPopUp();
        }
        if (e.keyCode == 37) {
            if (e.ctrlKey) {//ctrl+left arrow (show/hide menutree)
                showHideTableLib();
            } else {//left arrow (horizontal table scroll)
                var left = document.getElementById('div_for_horizontal_scroll');
                left.scrollLeft -= 40;
            }
        }
        if (e.keyCode == 38 && e.ctrlKey) {//ctrl+up arrow (show/hide navbar)
            if ($('.navbar').is(':visible')) {
                $('.navbar').hide();
                $('.div-screen').css('top', '0');
            } else {
                $('.navbar').show();
                $('.div-screen').css('top', '50px');
            }
            $('.table_body_viewport > .mCSB_scrollTools').css('top', getGlobalOffset('offsetTop','')+'px');
        }
        if (e.keyCode == 39) {
            if (e.ctrlKey) {//ctrl+right arrow (show/hide filters)
                showHideMenu();
            } else {//left arrow (horizontal table scroll)
                var left = document.getElementById('div_for_horizontal_scroll');
                left.scrollLeft += 40;
            }
        }
        if (e.keyCode == 40 && e.ctrlKey) {//ctrl+down arrow (show/hide tables pagination)
            if ($('._tables_pagination').is(':visible')) {
                $('._tables_pagination').hide();
            } else {
                $('._tables_pagination').show();
            }
        }
    });

    //show filters
    if (localStorage.getItem('filter_hide') == 0) {
        $('#showHideMenuBtn').removeClass('menu-hidden');
        $('#showHideMenuBody').css('width', '260px');
        $(".table_body_viewport > .mCSB_scrollTools").css("right", '262px');
        $(".js-filterMenuHide").css("right", '265px');
    }
    //hide menutree
    if (localStorage.getItem('menutree_hide') == 1) {
        $('#showTableLibBtn').addClass('menu-hidden');
        $('#showTableLibBody').css('width', '0');
        $(".js-table_lib_hide").css("left", '10px');
        $("#tables_btns").css("left", "490px");
        $("#showTableLibBody .standard-tabs").css("display", "none");
    }

    if (MenutreeTab) {
        if (MenutreeTab == 'public') tablebar_show_public();
        if (MenutreeTab == 'private') tablebar_show_private();
        if (MenutreeTab == 'favorite') tablebar_show_favorite();
    }

    if (authUser) {
        jsTreeBuild('favorite');
    } else {
        jsTreeBuild('public');
    }

    changeImportStyle();

    changeDataTableRowHeight( localStorage.getItem('row_height') );
});

/* --------------------- Variables ---------------------- */

var baseHttpUrl = "/web",
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
    filterMenuHide = true,
    MenutreeHide = false,
    MenutreeTab = localStorage.getItem('menutree_tab'),
    markerBounds = {top:0, left:0, right:0, bottom:0},
    tower_types = {'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png'},
    system_fields = ['id','refer_tb_id','createdBy','createdOn','modifiedBy','modifiedOn'];

var curFilter = "",
    arrAddFieldsInData = ['is_favorited'],
    selectedForChangeOrder = -1,
    sidebarPrevSelected = '';

var settingsTableName = 'tb_settings_display',
    settingsEntries = $('#inpSettingsEntries').val(),
    settingsPage = 0,
    settingsRowsCount = 0,
    settingsTableData = [],
    settingsTableHeaders = [],
    settingsTableDDLs = [],
    settingsChangedSearchKeyword = false,
    settingsSearchKeyword = "",
    ddl_names_for_settings = [],
    changePageWhenList = false,
    sortCol = '', sortASC = false,
    currentTheme = '',
    were_uploaded_files = false,
    listViewNeedToUpdate = false;

/* -------------------- Functions ---------------------- */

function selectView(view_id) {
    $('.loadingFromServer').show();
    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable?tableView=' + view_id,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            selectedPage = response.page;
            searchKeyword = response.search;
            rowsCount = response.rows;
            tableData = response.data;
            tableHeaders = response.headers;
            //tableDDLs = response.ddls;
            showDataTable(tableHeaders, tableData);
            showFiltersList(response.filters);
            showTableFooter();
            $('.loadingFromServer').hide();
            $('.colvisopts').show();
            if (rowsCount > selectedEntries) {
                $('._tables_pagination').show();
            }
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function selectTable(tableName) {
    $('.loadingFromServer').show();
    selectedPage = 0;
    searchKeyword = "";
    selectedForChangeOrder = -1;
    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
        data: {
            from_main_data: true,
            getfilters: true,
            p: 0,
            c: selectedEntries
        },
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Main Data', response);
            rowsCount = response.rows;
            tableData = response.data;
            tableHeaders = response.headers;
            tableDDLs = response.ddls;
            showDataTable(tableHeaders, tableData);
            showFiltersList(response.filters);
            showTableFooter();
            $('.loadingFromServer').hide();
            $('.colvisopts').show();
            if (rowsCount > selectedEntries) {
                $('._tables_pagination').show();
            }

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
    selectedForChangeOrder = -1;

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

    query.sortCol = sortCol;
    query.sortASC = sortASC;

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            from_main_data: true,
            tableName: selectedTableName,
            getfilters: true,
            p: selectedPage,
            c: selectedEntries,
            q: btoa(JSON.stringify(query)),
            fields: btoa(JSON.stringify(tableHeaders)),
            filterData: btoa(JSON.stringify(filtersData)),
            changedFilter: btoa(JSON.stringify(changedFilter))
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
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key, d_key, tbDataHeaders = "", visibleColumns = "", tbHiddenHeaders = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries, star_class;

    if (!data.length) {
        return;
    }

    for (var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td '+(i === 0 ? 'id="first_data_td"' : '')+'>' +
            '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a>' +
            '</td>';

        //second column ("star")
        if (authUser) {
            if (userOwner && !view_id) {
                tableData +=
                    '<td style="min-width: 65px;font-size: 1.5em; text-align: center;">' +
                        '<a href="javascript:void(0)" onclick="toggleFavoriteRow(' + i + ',this)">' +
                            '<i class="fa ' + (data[i].is_favorited ? 'fa-star' : 'fa-star-o') + '" style="color: #FD0;"></i>' +
                        '</a> | ' +
                        '<a href="javascript:void(0)" onclick="deleteRow(tableData[' + i + '], ' + i + ')">' +
                            '<i class="fa fa-remove" style="color: #039;"></i>' +
                        '</a>' +
                    '</td>';
            } else {
                tableData += '<td style="min-width: 65px;font-size: 1.5em; text-align: center;"><a href="javascript:void(0)" onclick="toggleFavoriteRow('+i+',this)">' +
                    '<i class="fa '+(data[i].is_favorited ? 'fa-star' : 'fa-star-o')+'" style="color: #FD0;"></i>' +
                    '</a></td>';
            }
        } else {
            star_class = 'fa-star-o';
            for (var v = 0; v < favoriteTableData.length; v++) {
                if (favoriteTableData[v].id === data[i].id) {
                    star_class = 'fa-star';
                }
            }
            tableData += '<td style="min-width: 65px;font-size: 1.5em; text-align: center;"><a href="javascript:void(0)" onclick="toggleFavoriteRow('+i+',this)">' +
                '<i class="fa '+(star_class)+'" style="color: #FD0;"></i>' +
                '</a></td>';
        }

        //main table data
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + '_dataT"' +
                    'data-wrapped="true"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    ($.inArray(d_key, system_fields) == -1 && headers[key].f_type != 'Attachment' && headers[key].can_edit && !view_id ?
                        'onclick="showInlineEdit(\'' + headers[key].field + i + '_dataT\', 1)"' :
                        '') +
                    'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">' +
                    '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tableData += (data[i][d_key] > 0 && tableDDLs['x_ddl_id'][data[i][d_key]] !== null ? tableDDLs['x_ddl_id'][data[i][d_key]] : '');
                } else
                if (headers[key].f_type == 'Attachment') {
                    tableData += (String(data[i][d_key]).indexOf('<') > -1 ? data[i][d_key] : '');//'<i class="fa fa-paperclip"></i>';
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tableData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else {
                    tableData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? (headers[key]._u_factor ? getUnitConversion(headers[key], data[i][d_key]) : data[i][d_key]) : '');
                }
                tableData += '</div></td>';
            }
        }
        tableData += "</tr>";

        //add row data
        if (i == 0) {
            tbAddRow += "<tr>";
            tbAddRow += '<td><div class="td_wrap"></div></td>';
            tbAddRow += '<td></td>';
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tbAddRow +=
                        '<td ' +
                        'id="' + headers[key].field + i + headers[key].input_type + '_addrow"' +
                        'data-wrapped="true"' +
                        'data-key="' + headers[key].field + '"' +
                        'data-input="' + headers[key].input_type + '"' +
                        'data-idx="' + i + '"' +
                        ($.inArray(d_key, system_fields) == -1 && headers[key].f_type != 'Attachment' && headers[key].can_edit && !view_id ?
                            'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '_addrow\', 0)"' :
                            '') +
                        'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                        (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                        (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">' +
                        '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                    if (headers[key].f_type == 'Attachment') {
                        tableData += (String(data[i][d_key]).indexOf('<') > -1 ? data[i][d_key] : '');//'<i class="fa fa-paperclip"></i>';
                    }
                    tbAddRow += '</div></td>';
                    /*if (d_key == 'id') {
                     tbAddRow += '<button class="btn btn-success" onclick="addRowInline()">Save</button></td>';
                     } else {
                     tbAddRow += '</td>';
                     }*/
                }
            }
            tbAddRow += "</tr>";

            tbAddRow_h += "<tr style='visibility: hidden;'><td></td>";
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tbAddRow_h += '<td></td>';//(key == 'id' ? '<button class="btn btn-success">Save</button>' : '')
                }
            }
            tbAddRow_h += "</tr>";
        }

        //hidden data for correct columns size
        tbHiddenData += "<tr>";
        tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a></td>';
        tbHiddenData += '<td style="min-width: 65px;font-size: 1.5em; text-align: center;">' +
                '<i class="fa fa-star-o" style="color: #FD0;"></i> | <i class="fa fa-remove" style="color: #05B;"></i>' +
            '</td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">' +
                    '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tbHiddenData += (data[i][d_key] > 0 && tableDDLs['x_ddl_id'][data[i][d_key]] !== null ? tableDDLs['x_ddl_id'][data[i][d_key]] : '');
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tbHiddenData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else
                if (headers[key].f_type == 'Attachment') {
                    tbHiddenData += (String(data[i][d_key]).indexOf('<') > -1 ? data[i][d_key] : '');//'<i class="fa fa-paperclip"></i>';
                } else {
                    tbHiddenData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? (headers[key]._u_factor ? getUnitConversion(headers[key], data[i][d_key]) : data[i][d_key]) : '');
                }
                tbHiddenData += '</div></td>';
            }
        }
        tbHiddenData += "</tr>";
    }

    var rows_in_hdrs = 1, tmp;
    for (var $hdr in headers) {
        tmp = headers[$hdr].name;
        tmp = tmp.split(',');
        if (tmp && tmp.length > rows_in_hdrs) {
            rows_in_hdrs = tmp.length;
        }
    }
    //recreate headers for main data (with multi-headers feature)
    for (var i = 0; i < rows_in_hdrs; i++) {
        tbDataHeaders += "<tr>";
        if (i == 0) {
            tbDataHeaders += "<th rowspan='"+(rows_in_hdrs+1)+"' class='nowrap' style='text-align: center;'><b>#</b></th>";
            tbDataHeaders += "<th rowspan='"+(rows_in_hdrs+1)+"' class='nowrap' title='"+(isAdmin || (authUser && userOwner) ? 'Favorite / Remove' : 'Favorite')+"' style='text-align: center;'><i class='fa fa-info-circle'></i></th>";
        }
        for (var $hdr in headers) {
            tmp = headers[$hdr].name;
            tmp = tmp.split(',');

            tbDataHeaders += '<th ' +
                (!headers[$hdr].unit && i == (rows_in_hdrs-1) ? 'rowspan="2" ' : '') +
                'class="'+(headers[$hdr].field == sortCol ? (sortASC ? 'sorting_asc' : 'sorting_desc') : 'sorting')+' nowrap" ' +
                'data-key="' + headers[$hdr].field + '" ' +
                'data-order="' + $hdr + '" ' +
                'onclick="sortByColumn(this)" ' +
                'style="text-align: center;position: relative; ' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;' : '') +
                (headers[$hdr].min_wth > 0 ? 'min-width: '+headers[$hdr].min_wth+'px;' : '') +
                (headers[$hdr].max_wth > 0 ? 'max-width: '+headers[$hdr].max_wth+'px;' : '') +
                '">' +
                '<span draggable="true" style="text-align: center;white-space: normal;display: inline-block; '+(headers[$hdr].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[$hdr].dfot_wth-27)+'px;' : '')+'">' +
                ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : (tmp[i] ? tmp[i] : '')) +
                '</span>' +
                '<div style="position: absolute; top: 0; bottom: 0; right: 0; width: 5px; cursor: col-resize;"></div>' +
                '</th>';
        }
        tbDataHeaders += "</tr>";
    }
    //unit`s header row
    tbDataHeaders += "<tr>";
    for (var $hdr in headers) {
        if (headers[$hdr].unit) {
            tbDataHeaders += '<th ' +
                'data-key="' + headers[$hdr].field + '" ' +
                'data-idx="' + $hdr + '"' +
                'style="text-align: center;position: relative;' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;"' : '"') +
                'style="position: relative;' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;"' : '"') +
                (headers[$hdr].unit_ddl ? 'onclick="showHeaderInlineEdit(this)"' : '') +
                '>' +
                '<span draggable="true" style="text-align: center;white-space: normal;display: inline-block; '+(headers[$hdr].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[$hdr].dfot_wth-27)+'px;' : '')+'">' +
                (headers[$hdr]._u_factor ? headers[$hdr].unit_display :headers[$hdr].unit) +
                '</span>' +
                '</th>';
        }
    }
    tbDataHeaders += "</tr>";

    for (var $hdr in headers) {
        visibleColumns += '<li style="padding: 4px 8px;' + (headers[$hdr].is_showed ? '' : 'background-color: #ccc;') + '' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">';
        visibleColumns +=   '<input id="' + headers[$hdr].field + '_visibility" onclick="showHideColumn(\'' + headers[$hdr].field + '\', '+$hdr+')" class="checkcols" type="checkbox" '+(headers[$hdr].is_showed ? 'checked' : '')+' > ' +
            '<label class="labels" for="' + headers[$hdr].field + '_visibility"> ' + _.uniq( headers[$hdr].name.split(',') ).join(' ') + ' </label>';
        visibleColumns += '</li>';
    }

    $('#tbHeaders_header').html(tbDataHeaders);
    //span columns (first horizontal, next vertical) if they data are the same for multi-headers
    if (rows_in_hdrs > 1) {
        SpanColumnsWithTheSameData('tbHeaders_header');
    }
    $('#tbAddRow_header').html( $('#tbHeaders_header').html() );
    $('#tbData_header').html( $('#tbHeaders_header').html() );

    $('#ul-cols-list').html(visibleColumns);

    $('#tbAddRow_body').html(tbAddRow + tbHiddenData);
    $('#tbHeaders_body').html(tbHiddenData);
    $('#tbData_body').html(tableData);

    //set rows height
    var rh = ( localStorage.getItem('row_height') == 'Small' ? 37 : ( localStorage.getItem('row_height') == 'Medium' ? 47 : 67 ) );
    $('.table>tbody>tr>td .td_wrap').css('min-height', (rh-7)+'px');

    //show 'add row' if checked
    var hdr_height = document.getElementById('tbHeaders_header').clientHeight;
    $('#tbAddRow').css('top', (-hdr_height)+'px');
    $('#tbData').css('margin-top', (-hdr_height)+'px');
    if ($('#addingIsInline').is(':checked')) {
        $('#tbHeaders').css('top', rh+'px');
        $('#divTbData').css('top', (rh+hdr_height)+'px');
    } else {
        $('#tbHeaders').css('top', '0');
        $('#divTbData').css('top', hdr_height+'px');
    }

    $('.table_body_viewport > .mCSB_scrollTools').css('top', getGlobalOffset('offsetTop','')+'px');

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

    if (authUser) {
        //add drag listeners for table headers
        var cols = document.querySelectorAll('#tbHeaders_header th > span[draggable="true"]');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('dragend', handleDragEnd, false);
            col.addEventListener('drop', handleDrop, false);
        });

        //add resize listeners for table headers
        cols = document.querySelectorAll('#tbHeaders_header th > div');
        [].forEach.call(cols, function(col) {
            col.addEventListener('mousedown', handleStartResize, false);
        });
    }

    changeTheme(currentTheme);
    hideEditPopUp();
    img_preview_activate();
}
document.addEventListener('mousemove', handleElemResize, false);
document.addEventListener('mouseup', handleEndResize, false);

var startX = 0, startWidth = 0, startResizeElem = false;
function handleStartResize(e) {
    startX = 0;
    startWidth = this.parentNode.clientWidth;
    startResizeElem = this;
    this.parentNode.style.minWidth = "0";
    this.parentNode.style.maxWidth = "1000px";
}

function handleElemResize(e) {
    if (startResizeElem) {
        if (startX) {
            var fieldKey = startResizeElem.parentNode.dataset.key;
            startWidth += e.x - startX;
            startX = e.x;
            //resize header
            $('#tbAddRow th[data-key="'+fieldKey+'"] span').css('width', (startWidth-27)+'px');
            $('#tbHeaders th[data-key="'+fieldKey+'"] span').css('width', (startWidth-27)+'px');
            $('#tbData th[data-key="'+fieldKey+'"] span').css('width', (startWidth-27)+'px');
            //resize columns
            $('#tbAddRow td[data-key="'+fieldKey+'"] .td_wrap').css('width', (startWidth-14)+'px');
            $('#tbHeaders td[data-key="'+fieldKey+'"] .td_wrap').css('width', (startWidth-14)+'px');
            $('#tbData td[data-key="'+fieldKey+'"] .td_wrap').css('width', (startWidth-14)+'px');
        } else {
            startX = e.x;
        }
    }
}

function handleEndResize(e) {
    if (startResizeElem) {
        var field_name = startResizeElem.parentNode.dataset.key;
        startResizeElem = false;

        for (var i in tableHeaders) {
            if (tableHeaders[i].field == field_name) {
                tableHeaders[i].dfot_wth = startWidth;
                $.ajax({
                    url: baseHttpUrl + '/updateTableRow?tableName=tb_settings_display&id=' + btoa(tableHeaders[i].id) + '&dfot_wth=' + btoa(startWidth),
                    method: 'get'
                });
                break;
            }
        }
        startWidth = 0;
        showDataTable(tableHeaders, tableData);
    }
}


function showFiltersList(filters) {
    filtersData = filters;
    filterMaxHeight = $("#acd-filter-menu").height() - filtersData.length * 40;
    var filtersHTML = '';
    for (var i = 0; i < filtersData.length; i++) {
        if (filtersData[i]) {
            filtersHTML += '<div>' +
                '<dt onclick="showFilterTabs('+i+')">' + _.uniq( filtersData[i].name.split(',') ).join(' ') + '</dt>' +
                '<dd class="acd-filter-elem" data-idx="'+i+'" style="position:relative;max-height: '+filterMaxHeight+'px;overflow: auto;'+(filtersData[i].name != curFilter ? 'display: none;' : '')+'">' +
                    '<div class="with-small-padding">' +
                        '<div class="blue-bg with-small-padding filterheader">' +
                            '<span class="checkbox replacement '+(filtersData[i].checkAll ? 'checked' : '')+'" tabindex="0" onclick="curFilter=filtersData['+i+'].name;filtersData['+i+'].checkAll=!filtersData['+i+'].checkAll;filterCheckAll('+i+', filtersData['+i+'].checkAll)">' +
                                '<span class="check-knob"></span>' +
                                '<input id="" checked="" class="" name="County" type="checkbox" value="County" tabindex="-1" '+(view_id ? 'disabled' : '')+'>' +
                            '</span>Check/Uncheck All' +
                        '</div>' +
                        '<ul class="list">';
            for (var j = 0; j < filtersData[i].val.length; j++) {
                filtersHTML += '<li>' +
                                '<span class="checkbox replacement mr5 '+(filtersData[i].val[j].checked ? 'checked' : '')+'" '+(view_id ? 'onclick="curFilter=filtersData['+i+'].name;filtersData['+i+'].val['+j+'].checked=!filtersData['+i+'].val['+j+'].checked;filterTable('+i+', filtersData['+i+'].val['+j+'].value, filtersData['+i+'].val['+j+'].checked)"' : '')+'>' +
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

function menutree_show_filter_tab() {
    $('#acd-filter-menu_btn').css('background-color','#f1f2f3');
    $('#acd-menutree_btn').css('background-color','#aaa');
    $('#acd-filter-menu').show();
    $('#acd-menutree').hide();
}

function menutree_show_menu_tab() {
    $('#acd-menutree_btn').css('background-color','#f1f2f3');
    $('#acd-filter-menu_btn').css('background-color','#aaa');
    $('#acd-menutree').show();
    $('#acd-filter-menu').hide();
}

function showHideTableLib() {
    MenutreeHide = !MenutreeHide;
    localStorage.setItem('menutree_hide', MenutreeHide ? '1' : '0');

    if (MenutreeHide) {
        $('#showTableLibBtn').addClass('menu-hidden');
        $('#showTableLibBody').css('width', '0');
    } else {
        $('#showTableLibBtn').removeClass('menu-hidden');
        $('#showTableLibBody').css('width', '260px');
    }

    $(".js-table_lib_hide").css("left", MenutreeHide ? "10px" : "265px");
    $("#tables_btns").css("left", MenutreeHide ? "490px" : "750px");
    $("#showTableLibBody .standard-tabs").css("display", MenutreeHide ? "none" : "");
}

function tablebar_show_public() {
    localStorage.setItem('menutree_tab', 'public');
    $("#tablebar_li_public").addClass("active");
    $("#tablebar_li_private").removeClass("active");
    $("#tablebar_li_favorite").removeClass("active");
    $("#tablebar_public_wrapper").show();
    $("#tablebar_private_wrapper").hide();
    $("#tablebar_favorite_wrapper").hide();
    //sidebarPrevSelected = '';
    if (authUser) {
        jsTreeBuild('public');
    }
}

function tablebar_show_private() {
    localStorage.setItem('menutree_tab', 'private');
    $("#tablebar_li_private").addClass("active");
    $("#tablebar_li_public").removeClass("active");
    $("#tablebar_li_favorite").removeClass("active");
    $("#tablebar_private_wrapper").show();
    $("#tablebar_public_wrapper").hide();
    $("#tablebar_favorite_wrapper").hide();
    //sidebarPrevSelected = '';
    if (authUser) {
        jsTreeBuild('private');
    }
}

function tablebar_show_favorite() {
    localStorage.setItem('menutree_tab', 'favorite');
    $("#tablebar_li_favorite").addClass("active");
    $("#tablebar_li_private").removeClass("active");
    $("#tablebar_li_public").removeClass("active");
    $("#tablebar_favorite_wrapper").show();
    $("#tablebar_private_wrapper").hide();
    $("#tablebar_public_wrapper").hide();
    //sidebarPrevSelected = '';
    if (authUser) {
        jsTreeBuild('favorite');
    }
}

function showHideMenu() {
    filterMenuHide = !filterMenuHide;
    localStorage.setItem('filter_hide', filterMenuHide ? '1' : '0');

    if (filterMenuHide) {
        $('#showHideMenuBtn').addClass('menu-hidden');
        $('#showHideMenuBody').css('width', '0');
    } else {
        $('#showHideMenuBtn').removeClass('menu-hidden');
        $('#showHideMenuBody').css('width', '260px');
    }

    var right_scr = filterMenuHide ? "0" : "262px";
    var right = filterMenuHide ? "10px" : "265px";
    $(".table_body_viewport > .mCSB_scrollTools").css("right", right_scr);
    $(".js-filterMenuHide").css("right", right);
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
        var left_bound = getGlobalOffset('offsetLeft', 'showHideColumnsList_btn');
        $('#showHideColumnsList').css('left', (left_bound-$('#accesstestscroll').width())+'px');
    }
}

function showHideColumn(fieldKey, idx) {
    var status = ($('#'+fieldKey+'_visibility').is(':checked') ? 'Show' : 'Hide');
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/showHideColumnToggle?tableName=' + selectedTableName + '&col_key=' + fieldKey + '&status=' + status,
        success: function() {
            tableHeaders[idx].is_showed = (status == 'Show');
            showDataTable(tableHeaders, tableData);
            if (favoriteTableHeaders[idx]) {
                favoriteTableHeaders[idx].is_showed = (status == 'Show');
                showFavoriteDataTable(favoriteTableHeaders, favoriteTableData);
            }
        }
    });
}

function toggleFavoriteTable(elem) {
    if (authUser) {
        var i = $(elem).find('i');
        if ($(i).hasClass('fa-star')) {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favoriteToggleTable?tableName=' + selectedTableName + '&status=Inactive'
            });
            $(i).removeClass('fa-star').addClass('fa-star-o');
        } else {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favoriteToggleTable?tableName=' + selectedTableName + '&status=Active'
            });
            $(i).removeClass('fa-star-o').addClass('fa-star');
        }
    }
}

function toggleFavoriteRow(idx, elem) {
    if (authUser && table_meta.source != 'remote') {
        var i = $(elem).find('i');
        if ($(i).hasClass('fa-star')) {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favoriteToggleRow?tableName=' + selectedTableName + '&row_id=' + tableData[idx].id + '&status=Inactive'
            });
            $(i).removeClass('fa-star').addClass('fa-star-o');
            tableData[idx].is_favorited = 0;
        } else {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favoriteToggleRow?tableName=' + selectedTableName + '&row_id=' + tableData[idx].id + '&status=Active'
            });
            $(i).removeClass('fa-star-o').addClass('fa-star');
            tableData[idx].is_favorited = 1;
        }
    } else {
        var i = $(elem).find('i');
        if ($(i).hasClass('fa-star')) {
            $(i).removeClass('fa-star').addClass('fa-star-o');
            for(var j = 0; j < favoriteTableData.length; j++) {
                if (favoriteTableData[j].id == tableData[idx].id) {
                    favoriteTableData.splice(j, 1);
                    break;
                }
            }
        } else {
            $(i).removeClass('fa-star-o').addClass('fa-star');
            favoriteTableData.push( Object.assign({}, tableData[idx]) );
        }
    }
}

/* ------------------- change columns order for main table via drag/drop -----------*/
function handleDragStart(e) {
    selectedForChangeOrder = this.parentNode.dataset.order;
    this.parentNode.style.opacity = '0.6';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    return false;
}

function handleDragEnter(e) {
    this.parentNode.classList.add('over');
}

function handleDragLeave(e) {
    this.parentNode.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = this.parentNode.dataset.order;
    if (selectedForChangeOrder > -1 && selectedForChangeOrder !== target) {
        var reoderedArr = [];
        for (var i in tableHeaders) {
            if (i == target) {
                reoderedArr.push(tableHeaders[selectedForChangeOrder]);
                reoderedArr.push(tableHeaders[i]);
            } else
            if (i != selectedForChangeOrder) {
                reoderedArr.push(tableHeaders[i]);
            }
        }
        tableHeaders = reoderedArr;

        showDataTable(tableHeaders, tableData);
        showSettingsDataTable(settingsTableHeaders, settingsTableData);

        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/changeOrder?tableName='+selectedTableName+'&select='+selectedForChangeOrder+'&target='+target+'&replace=0',
            success: function () {
                //
            },
            error: function () {
                alert("Server error");
            }
        });
    }
    selectedForChangeOrder = -1;

    return false;
}

function handleDragEnd(e) {
    var cols = document.querySelectorAll('#tbHeaders_header th > span[draggable="true"]');
    this.parentNode.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}
/* ------------------- end change columns order for main table via drag/drop -----------*/

function showMap() {
    $("#li_list_view").removeClass("active");
    $("#li_import_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_map_view").addClass("active");
    $("#list_view").hide();
    $("#favorite_view").hide();
    $("#settings_view").hide();
    $("#import_view").hide();
    $(".listview_btns").hide();
    $("#favorite_btns").hide();
    $("#map_view").show();
    initMap();
    $('.showhidemenu').hide();
    $('#showHideColumnsList').hide();
}

function showList() {
    $("#li_list_view").addClass("active");
    $("#li_import_view").removeClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#list_view").show();
    $("#favorite_view").hide();
    $("#map_view").hide();
    $("#settings_view").hide();
    $("#import_view").hide();
    $(".listview_btns").show();
    $("#favorite_btns").hide();
    $('.showhidemenu').show();
    selectedForChangeOrder = -1;
    $('.table_body_viewport > .mCSB_scrollTools').css('top', getGlobalOffset('offsetTop','')+'px');
    if (changePageWhenList) {
        changePage(selectedPage+1);
        changePageWhenList = false;
    }
    if (listViewNeedToUpdate) {
        selectTable(selectedTableName);
        listViewNeedToUpdate = false;
    }
}

function showFavorite() {
    $("#li_favorite_view").addClass("active");
    $("#li_import_view").removeClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#favorite_view").show();
    $("#list_view").hide();
    $("#map_view").hide();
    $("#settings_view").hide();
    $("#import_view").hide();
    $(".listview_btns").hide();
    $("#favorite_btns").show();
    $('.showhidemenu').show();
    changeFavoritePage(1);
    $('.table_body_viewport > .mCSB_scrollTools').css('top', getGlobalOffset('offsetTop','')+'px');
}

function showImport() {
    $("#li_import_view").addClass("active");
    $("#li_settings_view").removeClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#import_view").show();
    $("#settings_view").hide();
    $("#favorite_view").hide();
    $("#list_view").hide();
    $("#map_view").hide();
    $(".listview_btns").hide();
    $("#favorite_btns").hide();
    $('.showhidemenu').hide();
    $('#showHideColumnsList').hide();
    selectedForChangeOrder = -1;
}

function showSettings() {
    $("#li_settings_view").addClass("active");
    $("#li_import_view").removeClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#settings_view").show();
    $("#favorite_view").hide();
    $("#list_view").hide();
    $("#map_view").hide();
    $("#import_view").hide();
    $('.showhidemenu').hide();
    $(".listview_btns").hide();
    $("#favorite_btns").hide();
    $('#showHideColumnsList').hide();
    selectedForChangeOrder = -1;
    $('.table_body_viewport > .mCSB_scrollTools').css('top', getGlobalOffset('offsetTop','')+'px');
    showSettingsDataTable(settingsTableHeaders, settingsTableData);
}

function detailsShowMap() {
    $("#details_li_list_view").removeClass("active");
    $("#details_li_map_view").addClass("active");
    $("#details_li_attach").removeClass("active");
    $("#details_lview").hide();
    $("#details_gmap").show();
    $("#details_attach").hide();
    initDetailsMap();
}

function detailsShowList() {
    $("#details_li_list_view").addClass("active");
    $("#details_li_map_view").removeClass("active");
    $("#details_li_attach").removeClass("active");
    $("#details_lview").show();
    $("#details_gmap").hide();
    $("#details_attach").hide();
}

function detailsShowAttach() {
    $("#details_li_attach").addClass("active");
    $("#details_li_list_view").removeClass("active");
    $("#details_li_map_view").removeClass("active");
    $("#details_attach").show();
    $("#details_lview").hide();
    $("#details_gmap").hide();
}
//---------------------------------- in the Attach tab
function detailsShowPictures() {
    $("#details_li_pictures").addClass("active");
    $("#details_li_files").removeClass("active");
    $("#details_li_uploads").removeClass("active");
    $("#details_pictures").show();
    $("#details_files").hide();
    $("#details_uploads").hide();
}

function detailsShowFiles() {
    $("#details_li_files").addClass("active");
    $("#details_li_pictures").removeClass("active");
    $("#details_li_uploads").removeClass("active");
    $("#details_files").show();
    $("#details_pictures").hide();
    $("#details_uploads").hide();
}

function detailsShowUploads() {
    $("#details_li_uploads").addClass("active");
    $("#details_li_pictures").removeClass("active");
    $("#details_li_files").removeClass("active");
    $("#details_uploads").show();
    $("#details_pictures").hide();
    $("#details_files").hide();
}
//---------------------------
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
    var query = {}; //method = $('#downloader_type').val();

    if (method == 'PRINT') {
        openPrintDialog();
        return;
    }

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

    query.sortCol = sortCol;
    query.sortASC = sortASC;

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            tableName: selectedTableName,
            getfilters: true,
            p: 0,
            c: 0,
            q: btoa(JSON.stringify(query)),
            fields: btoa(JSON.stringify(tableHeaders)),
            filterData: btoa(JSON.stringify(filtersData)),
            changedFilter: btoa(JSON.stringify(changedFilter))
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }
            //$('body, html').css('overflow', 'auto');
            $(document).css('overflow', 'auto');

            var html = "", col_per_page = 9;
            var tableHeaders = response.headers;
            var tableData = response.data;
            var d_key, mult = Math.ceil(tableHeaders.length/col_per_page);

            for (var step = 1; step < mult; step++) {
                html += "<table style='border-collapse: collapse;page-break-inside: auto;"+(step < (mult-1) ? 'page-break-after: always;' : '')+"' width=\"100%\">";
                html += "<thead><tr><th style='border: solid 1px #000;padding: 3px 5px;background-color: #AAA;'>Row #</th>";
                for (var m = 0 + (step-1)*col_per_page; m < col_per_page + (step-1)*col_per_page; m++) {
                    html += '<th style="border: solid 1px #000;padding: 3px 5px;background-color: #AAA; ' + (tableHeaders[m].web == 'No' ? 'display: none;' : '') + '">'+_.uniq( tableHeaders[m].name.split(',') ).join(' ')+'</th>';
                }
                html += "</tr></thead>";

                html += "<tbody>";
                for(var i = 0; i < tableData.length; i++) {
                    html += "<tr><td style='border: solid 1px #000;padding: 3px 5px;'>"+(i+1)+"</td>";
                    for (var m = 0 + (step-1)*col_per_page; m < col_per_page + (step-1)*col_per_page; m++) {
                        d_key = tableHeaders[m].field;
                        html += '<td style="border: solid 1px #000;padding: 3px 5px; ' + (tableHeaders[m].web == 'No' ? 'display: none;' : '') + '">' + (tableData[i][d_key] !== null ? tableData[i][d_key] : '') + '</td>';
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";
            }

            $("#div-print").html(html);

            $('.loadingFromServer').hide();
            window.print();
            $(document).css('overflow', 'hidden');
            //$('body, html').css('overflow', 'hidden');
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
    changeFavoritePage(1);
    $('.entry-elem').removeClass('selected');
    $('.entry'+val).addClass('selected');
}

function searchKeywordChanged() {
    searchKeyword = $('#searchKeywordInp').val();
    changedSearchKeyword = true;
    changePage(1);
}

function showHeaderInlineEdit(elem) {
    var idx = $(elem).data('idx'),
        key = $(elem).data('key');

    if ($(elem).data('innerHTML')) {
        return;
    }

    //save current cell data
    $(elem).data('innerHTML', $(elem).find('span').html());

    var html = '<select class="form-control" ' +
        'id="HeaderInlineEdit_inp" ' +
        'onblur="editHeaderBlur(this)" ' +
        'onchange="updateRowData('+idx+',\''+key+'\',\'HeaderInlineEdit_inp\', \'settings\')" ' +
        'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 999;">';
    for (var i in settingsDDLs) {
        if (settingsDDLs[i].id == tableHeaders[idx].unit_ddl) {
            for (var j in settingsDDLs[i].items) {
                html += '<option value="'+settingsDDLs[i].items[j].option+'">'+settingsDDLs[i].items[j].option+'</option>';
            }
        }
    }
    html += '</select>';

    $(elem).html(html);
    $('#HeaderInlineEdit_inp').val( $(elem).data('innerHTML') );
    $('#HeaderInlineEdit_inp').focus();
}

function editHeaderBlur(el) {
    var par = $(el).parent();
    $(par).html( '<span>'+$(par).data('innerHTML')+'</span>' ).data('innerHTML', '');
}

function showInlineEdit(id, instant) {
    var lv = $('#list_view').is(':visible'),
        ltableDDls = (lv ? tableDDLs : settingsTableDDLs);

    var inp_t = $('#'+id).data('input'),
        idx = $('#'+id).data('idx'),
        key = $('#'+id).data('key');



    //------------------ START FREEZERS
    //freeze 'ddl_id' field if 'input_type' no selection (for Settings/Display Tab)
    if (
        id.indexOf('settingsDisplay') > -1
        &&
        key == 'ddl_id'
        &&
        settingsTableData[idx].input_type != 'Selection'
    ) {
        return;
    }

    //freeze 'ddl_id' field if 'input_type' no selection (for Main data)
    if (
        id.indexOf('_dataT') > -1
        &&
        key == 'ddl_id'
        &&
        tableData[idx].input_type != 'Selection'
    ) {
        return;
    }

    //freeze 'unit' and 'unit_display' field if 'unit_ddl' is empty (for Settings/Display Tab)
    if (
        id.indexOf('settingsDisplay') > -1
        &&
        (key == 'unit' || key == 'unit_display')
        &&
        !settingsTableData[idx].unit_ddl
    ) {
        return;
    }
    //------------------ END FREEZERS



    if ($('#'+id).data('innerHTML')) {
        return;
    }

    //save current cell data
    if ($('#'+id).data('wrapped')) {
        $('#'+id).data('innerHTML', $('#'+id+' > .td_wrap').html());
    } else {
        $('#'+id).data('innerHTML', $('#'+id).html());
    }

    var not_instant_func = $('#'+id).data('settings') ?
        'onchange="updateSettingsRowLocal('+idx+',\''+key+'\',\''+id+'_inp\')"' :
        'onchange="updateAddRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ';

    if (inp_t == 'Input') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\', \''+instant+'\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    } else
    if (inp_t == 'Selection' || instant == 'settings') {
        var html = '<select class="form-control" ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\', \''+instant+'\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;z-index: 999;">';
        if (instant == 'settings') {
            for (var i in settingsDDLs) {
                if (settingsDDLs[i].id == tableHeaders[idx].unit_ddl) {
                    for (var j in settingsDDLs[i].items) {
                        html += '<option value="'+settingsDDLs[i].items[j].option+'">'+settingsDDLs[i].items[j].option+'</option>';
                    }
                }
            }
        } else
        if (key == 'ddl_id' || key == 'unit_ddl') {
            for(var i in ltableDDls['x_ddl_id']) {
                html += '<option value="'+i+'">'+ltableDDls['x_ddl_id'][i]+'</option>';
            }
        } else
        if (key == 'unit' || key == 'unit_display') {
            for (var i in settingsDDLs) {
                if (settingsDDLs[i].id == settingsTableData[idx].unit_ddl) {
                    for (var j in settingsDDLs[i].items) {
                        html += '<option value="'+settingsDDLs[i].items[j].option+'">'+settingsDDLs[i].items[j].option+'</option>';
                    }
                }
            }
        }  else
        if (ltableDDls[key] && ltableDDls[key].req_obj) {//if reference ddl which needs request to the server
            var resp = $.ajax({
                url: baseHttpUrl + '/getRefDDL?req=' + btoa(JSON.stringify(ltableDDls[key].req_obj)) + '&row=' + btoa(JSON.stringify(tableData[idx])),
                method: 'get',
                async: false
            }).responseText;
            resp = JSON.parse(resp);
            for (var i in resp) {
                html += '<option value="'+resp[i]+'">'+resp[i]+'</option>';
            }
        } else {
            for (var i in ltableDDls[key]) {
                html += '<option value="'+ltableDDls[key][i]+'">'+ltableDDls[key][i]+'</option>';
            }
        }
        html += '</select>';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function hideInlineEdit(id) {
    if ($('#'+id).data('wrapped')) {
        $('#'+id)
            .html( '<div class="td_wrap">'+$('#'+id).data('innerHTML')+'</div>' )
            .data('innerHTML', '');
    } else {
        $('#'+id)
            .html( $('#'+id).data('innerHTML') )
            .data('innerHTML', '');
    }
}

function deleteRow(params, idx) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData),
        lselectedTableName = (lv ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteTableRow?tableName=' + lselectedTableName + '&id=' + params.id,
        success: function (response) {
            $('.loadingFromServer').hide();
            if (response.msg) {
                alert(response.msg);
            }
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
    ltableData.splice(idx, 1);
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
        if ($.inArray(key, arrAddFieldsInData) == -1) {
            strParams += key + '=' + btoa(params[key]) + '&';
        }
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=' + lselectedTableName + '&' + strParams,
        success: function (response) {
            $('.loadingFromServer').hide();
            tableData[ tableData.length-1 ].id = response.last_id;
            if (response.msg) {
                alert(response.msg);
            }
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

function updateRow(params, idx, to_change) {
    var lv = $('#list_view').is(':visible'),
        lselectedTableName = (lv && to_change != 'settings' ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        if ($.inArray(key, arrAddFieldsInData) == -1) {
            strParams += key + '=' + btoa(params[key]) + '&';
        }
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=' + lselectedTableName + '&' + strParams,
        success: function (response) {
            $('.loadingFromServer').hide();
            if (response.msg) {
                alert(response.msg);
            }
            if (to_change == 'settings') {
                changePage(selectedPage+1);
            } else {
                if (lv) {
                    showDataTable(tableHeaders, tableData);
                } else {
                    showSettingsDataTable(settingsTableHeaders, settingsTableData);
                    changePageWhenList = true;
                }
            }
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function updateRowData(idx, key, id, to_change) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv && to_change != 'settings' ? tableData : settingsTableData),
        ltableHeaders = (lv && to_change != 'settings' ? tableHeaders : settingsTableHeaders);

    if (to_change == 'settings') {
        for (var tb in tableHeaders) {
            if (tableHeaders[tb].field == key) {
                key = 'unit_display';
                tableHeaders[tb].unit_display = $('#'+id).val();
                break;
            }
        }
    }

    if ($('#'+id).prop('type') == 'checkbox') {
        ltableData[idx][key] = $('#'+id).is(':checked') ? 'No' : 'Yes';//reverted because we get previous state
    } else {
        for (var k in ltableHeaders) {
            var d_key = ltableHeaders[k].field;
            if (d_key == key) {
                ltableData[idx][key] = (ltableHeaders[k]._u_factor ? getRevConversion(ltableHeaders[k], $('#'+id).val()) : $('#'+id).val());
            }
        }
    }

    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', ltableData[idx][key]);

    updateRow(ltableData[idx], idx, to_change);
}

function updateAddRowData(idx, key, id) {
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());
}

function updateRowModal() {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData),
        ltableHeaders = (lv ? tableHeaders : settingsTableHeaders);

    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx'), d_key;
    for(var key in ltableHeaders) {
        d_key = ltableHeaders[key].field;
        if ($.inArray(d_key, system_fields) == -1 && $('#modals_inp_'+d_key).length) {
            if ($('#modals_inp_'+d_key).prop('type') == 'checkbox') {
                ltableData[idx][d_key] = $('#modals_inp_'+d_key).is(':checked') ? 'Yes' : 'No';
            } else {
                ltableData[idx][d_key] = (ltableHeaders[key]._u_factor ? getRevConversion(ltableHeaders[key], $('#modals_inp_'+d_key).val()) : $('#modals_inp_'+d_key).val());
            }
        }
    }

    updateRow(ltableData[idx], idx, 0);
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
    deleteRow(ltableData[idx], idx);
}

function editSelectedData(idx) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv ? tableData : settingsTableData),
        ltableHeaders = (lv ? tableHeaders : settingsTableHeaders),
        ltableDDLs = (lv ? tableDDLs : settingsTableDDLs),
        not_editable = (lv ? ['id','is_favorited'] : ['id','is_favorited','field','name']);
    var tmp_ddl_id = ltableDDLs['x_ddl_id'];

    if (idx > -1) {
        lv ? $('#modal_btn_delete').show() : $('#modal_btn_delete').hide();
        $('#modal_btn_update').show();
        $('#modal_btn_add').hide();
    } else {
        $('#modal_btn_delete, #modal_btn_update').hide();
        $('#modal_btn_add').show();
    }

    var html = "", htmlAttach = "", d_key, hide_update = true;
    for (var key in ltableHeaders) {
        if (ltableHeaders[key].web == 'No' || !ltableHeaders[key].is_showed) {
            continue;//show fields only showed in the 'list view'
        }
        if (ltableHeaders[key].can_edit && !view_id) hide_update = false;

        d_key = ltableHeaders[key].field;
        if ($.inArray(d_key, not_editable) == -1) {
            if (ltableHeaders[key].f_type == 'Attachment') {
                htmlAttach += '<tr><td style="text-align: center;">' +
                    '<label style="font-size: 1.7em;margin: 15px 0 5px 0;">' + _.uniq( ltableHeaders[key].name.split(',') ).join(' ')  + '</label>';
                if (idx > -1) {
                    htmlAttach += '<div style="margin-bottom: 5px;">' +
                        '<button class="dropdown_btn" id="modals_dd_[add_info]_'+d_key+'" data-idx="'+idx+'" data-key="'+d_key+'" data-info="[add_info]" data-edit="'+(ltableHeaders[key].can_edit && !view_id  ? '1' : '0')+'" style="display: none;">' +
                        'Files (0)' +
                        '</button>' +
                        '<div data-table="'+ltableHeaders[key].tb_id+'" data-row="'+ltableData[idx].id+'" data-field="'+d_key+'" class="dropdown_body"></div>' +
                        '</div>';
                } else {
                    htmlAttach += '<div style="margin-bottom: 5px;">' +
                        '<button class="dropdown_btn">Files (0) - will be accessible after the row adding</button>';
                }
                htmlAttach += '</td></tr>';
            } else {
                html += "<tr>";
                html +=
                    '<td><label>' + _.uniq( ltableHeaders[key].name.split(',') ).join(' ')  + '</label></td>' +
                    '<td>';
                if ($.inArray(d_key, system_fields) != -1) {
                    html += '<input id="modals_inp_'+d_key+'" type="text" class="form-control" readonly/>';
                } else
                if (!lv && (d_key === 'web' || d_key === 'filter')) {
                    html += '<label class="switch_t">' +
                        '<input type="checkbox" id="modals_inp_'+d_key+'" '+(idx > -1 && ltableData[idx][d_key] == "Yes" ? 'checked' : '')+'>' +
                        '<span class="toggler round"></span>' +
                        '</label>';
                } else
                if (ltableHeaders[key].input_type == 'Input' && ltableHeaders[key].can_edit && !view_id) {
                    html += '<input id="modals_inp_'+d_key+'" type="text" class="form-control" />';
                } else
                if (ltableHeaders[key].input_type == 'Selection' && ltableHeaders[key].can_edit && !view_id) {
                    if (ltableDDLs[d_key]) {
                        var tmp_ddl = ltableDDLs[d_key];
                    }
                    html += '<select class="form-control" id="modals_inp_'+d_key+'" ' +
                        ' data-idx="'+idx+'" ' +
                        ' data-key="'+d_key+'" ' +
                        (tmp_ddl && tmp_ddl.req_obj ? 'onfocus="getRefDDL(this)"' : '') +
                        ' class="form-control" style="margin-bottom: 5px">';
                    if (d_key == 'ddl_id' || d_key == 'unit_ddl') {
                        for(var i in tmp_ddl_id) {
                            html += '<option value="'+i+'">'+tmp_ddl_id[i]+'</option>';
                        }
                    } else
                    if (d_key == 'unit' || d_key == 'unit_display') {
                        for (var i in settingsDDLs) {
                            if (settingsDDLs[i].id == settingsTableData[idx].unit_ddl) {
                                for (var j in settingsDDLs[i].items) {
                                    html += '<option value="'+settingsDDLs[i].items[j].option+'">'+settingsDDLs[i].items[j].option+'</option>';
                                }
                            }
                        }
                    }  else
                    if (tmp_ddl && tmp_ddl.req_obj) {//if reference ddl which needs request to the server
                        if(idx > -1) {
                            var resp = $.ajax({
                                url: baseHttpUrl + '/getRefDDL?req=' + btoa(JSON.stringify(tmp_ddl.req_obj)) + '&row=' + btoa(JSON.stringify(tableData[idx])),
                                method: 'get',
                                async: false
                            }).responseText;
                            resp = JSON.parse(resp);
                            for (var i in resp) {
                                html += '<option value="'+resp[i]+'">'+resp[i]+'</option>';
                            }
                        } else {
                            html += '<option></option>';
                        }
                    } else
                    if (tmp_ddl) {
                        for (var i in tmp_ddl) {
                            html += '<option value="'+tmp_ddl[i]+'">'+tmp_ddl[i]+'</option>';
                        }
                    }
                    html += '</select>';
                }
                else {
                    html += '<input id="modals_inp_'+d_key+'" type="text" class="form-control" readonly/>';
                }
                html += '</td>';
                html += '<td><label style="padding: 0 15px;">' + (ltableHeaders[key].unit ? (ltableHeaders[key]._u_factor ? ltableHeaders[key].unit_display : ltableHeaders[key].unit) : '')  + '</label></td>';
                html += "</tr>";
            }
        }
    }
    $('#modals_rows').html(html);
    if (htmlAttach) {
        $('#modals_pictures').html( htmlAttach.replace(/\[add_info\]/gi, 'is_img') );
        $('#modals_files').html( htmlAttach.replace(/\[add_info\]/gi, 'not_img') );
        $('#modals_uploads').html( htmlAttach.replace(/\[add_info\]/gi, 'upload') );
        $('#details_li_attach').show();
    } else {
        $('#details_li_attach').hide();
    }
    were_uploaded_files = false;

    if (hide_update) $('#modal_btn_update').hide();

    //set current values for editing
    if (idx > -1) {
        bind_dropdown();

        for (var key in ltableHeaders) {
            d_key = ltableHeaders[key].field;
            if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                var usr = allUsers.find(function (el) {
                    return el.id === ltableData[idx][d_key];
                });
                $('#modals_inp_'+d_key).val( (usr && usr.first_name ? usr.first_name : '') + ' ' + (usr && usr.last_name ? usr.last_name : '') );
            } else {
                $('#modals_inp_'+d_key).val( (ltableHeaders[key]._u_factor ? getUnitConversion(ltableHeaders[key], ltableData[idx][d_key]) : ltableData[idx][d_key]) );
            }
        }
    }

    $('.js-editmodal').data('idx', idx);
    if (!$('#addingIsInline').is(':checked') || idx > -1 || !lv) {
        $('.js-editmodal').show();
    }

    detailsShowList();
}

function bind_dropdown() {
    var acc = document.getElementsByClassName("dropdown_btn");
    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() { bind_dropdown_clicked(this); });
        bind_dropdown_clicked(acc[i]);
    }
}

function bind_dropdown_clicked(elem) {
    elem.classList.toggle("dropdown_active");
    var panel = elem.nextElementSibling;

    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        if (elem.dataset.info == 'upload') {
            if (elem.dataset.edit == 0) {
                return;
            }

            var html = '<div style="width: 100%;height:34px;">' +
                    '<select class="form-control" style="width: 150px;float: left;" onchange="change_dd_type(this, \'upload_'+panel.dataset.field+'\')">' +
                        '<option value="file">Browse</option>' +
                        '<option value="link">Link</option>' +
                        '<option value="drag">Drag & Drop</option>' +
                    '</select>' +
                    '<button class="btn btn-primary" style="float: right;" onclick="upload_dd_file('+panel.dataset.table+', '+panel.dataset.row+', \''+panel.dataset.field+'\')">Upload</button>' +
                '</div>' +
                '<div style="width: 100%;margin-top: 5px;">' +
                    '<input id="dd_file_for_upload_'+panel.dataset.field+'" type="file" class="form-control" placeholder="Select a file">' +
                    '<input id="dd_link_for_upload_'+panel.dataset.field+'" type="text" class="form-control" placeholder="Type a link" style="display: none;">' +
                    '<div id="dd_drag_for_upload_'+panel.dataset.field+'" style="position: relative;height: 75px;display: none;border:2px dashed #ccc;">' +
                        '<div style="position: absolute;z-index: 0;width: 100%;height: 75px;display: flex;justify-content: center;align-items: center;">Drag & Drop File Here</div>' +
                    '</div>' +
                '</div>';
            panel.innerHTML = html;
            panel.style.display = "block";
            var dr = new Dropzone("#dd_drag_for_upload_"+panel.dataset.field, {
                url: baseHttpUrl + "/UploadDDFile",
                paramName: 'up_file',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                params: {
                    table: table_meta.db_tb,
                    table_id: panel.dataset.table,
                    row: panel.dataset.row,
                    field: panel.dataset.field
                }
            });
            dr.on("success", function(file, resp) {
                if (!resp.error) {
                    were_uploaded_files = true;
                    var btn = document.getElementById('modals_dd_'+(resp.is_img ? 'is' : 'not')+'_img_'+resp.key);
                    var panel = btn.nextElementSibling;
                    panel.style.display = "none";
                    bind_dropdown_clicked(btn);

                    btn = document.getElementById('modals_dd_upload_'+resp.key);
                    panel = btn.nextElementSibling;
                    panel.style.display = "none";
                    bind_dropdown_clicked(btn);
                }
            });
        } else {
            var is_img = elem.dataset.info == 'is_img' ? '1' : '0';
            $.ajax({
                url: baseHttpUrl + '/getFilesForField?table_id='+panel.dataset.table+'&row_id='+panel.dataset.row+'&field='+panel.dataset.field+'&img='+is_img,
                method: 'get',
                success: function (resp) {
                    var html = '<table class="table">' +
                        '<thead><tr>' +
                        '<th>File</th>' +
                        '<th>Notes</th>' +
                        '<th>Actions</th>' +
                        '</tr></thead>';
                    for (var i in resp) {
                        html += '<tr>' +
                            '<td><a target="_blank" href='+resp[i].filepath+resp[i].filename+'"/storage">';
                        if (is_img == '1') {
                            html += '<img class="_img_preview" src='+resp[i].filepath+resp[i].filename+'"/storage" alt="'+resp[i].filename+'" style="max-width: 250px; max-height: 150px;">';
                        } else {
                            html += resp[i].filename;
                        }
                        html += '</a></td>' +
                            '<td><input class="form-control" '+(elem.dataset.edit == 0 ? 'readonly' : '')+' type="text" value="'+(resp[i].notes ? resp[i].notes : '')+'" onchange="change_dd_file(this, '+panel.dataset.table+', '+panel.dataset.row+', \''+panel.dataset.field+'\', \''+resp[i].filename+'\')"></td>' +
                            '<td style="text-align: center;">' +
                            (
                                elem.dataset.edit == 1 ?
                                '<button class="btn btn-danger" onclick="delete_dd_file('+panel.dataset.table+', '+panel.dataset.row+', \''+panel.dataset.field+'\', \''+resp[i].filename+'\')">&times;</button>' :
                                ''
                            ) +
                            '</td>' +
                            '</tr>';
                    }
                    html += '</table>';
                    panel.innerHTML = html;
                    panel.style.display = "block";
                    if (is_img == '1') img_preview_activate();
                }
            });
        }
    }
}

function change_dd_type(elem, id) {
    if ($(elem).val() == 'file') {
        $('#dd_file_for_'+id).show();
        $('#dd_link_for_'+id).hide();
        $('#dd_drag_for_'+id).hide();
    } else
    if ($(elem).val() == 'link') {
        $('#dd_file_for_'+id).hide();
        $('#dd_link_for_'+id).show();
        $('#dd_drag_for_'+id).hide();
    } else {
        $('#dd_file_for_'+id).hide();
        $('#dd_link_for_'+id).hide();
        $('#dd_drag_for_'+id).show();
    }
}

function upload_dd_file(table, row, field) {
    event.preventDefault();

    var data = new FormData();

    if ($('#dd_link_for_upload_'+field).val()) {
        data.append('file_link', $('#dd_link_for_upload_'+field).val());
    } else {
        jQuery.each(jQuery('#dd_file_for_upload_'+field)[0].files, function(i, file) {
            data.append('up_file', file);
        });
    }
    data.append('table', table_meta.db_tb);
    data.append('table_id', table);
    data.append('row', row);
    data.append('field', field);

    jQuery.ajax({
        url: baseHttpUrl+'/UploadDDFile',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function(resp) {
            if (!resp.error) {
                were_uploaded_files = true;
                var btn = document.getElementById('modals_dd_'+(resp.is_img ? 'is' : 'not')+'_img_'+resp.key);
                var panel = btn.nextElementSibling;
                panel.style.display = "none";
                bind_dropdown_clicked(btn);

                btn = document.getElementById('modals_dd_upload_'+resp.key);
                panel = btn.nextElementSibling;
                panel.style.display = "none";
                bind_dropdown_clicked(btn);
            }
        }
    });
}

function delete_dd_file(table, row, field, filename) {
    event.preventDefault();
    swal({
        title: 'Delete file',
        text: 'Are you sure?',
        showCancelButton: true,
        closeOnConfirm: true
    }, function($confirm) {
        if ($confirm) {
            var data = new FormData();
            data.append('table', table_meta.db_tb);
            data.append('table_id', table);
            data.append('row', row);
            data.append('field', field);
            data.append('filename', filename);

            jQuery.ajax({
                url: baseHttpUrl+'/DeleteDDFile',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                success: function(resp) {
                    if (!resp.error) {
                        if ($('#modals').is(':visible')) {
                            were_uploaded_files = true;
                            var btn = document.getElementById('modals_dd_'+(resp.is_img ? 'is' : 'not')+'_img_'+resp.key);
                            var panel = btn.nextElementSibling;
                            panel.style.display = "none";
                            bind_dropdown_clicked(btn);
                        } else {
                            changePage(selectedPage + 1);
                        }
                    }
                }
            });
        }
    });
}

function change_dd_file(elem, table, row, field, filename) {
    var data = new FormData();
    data.append('table', table_meta.db_tb);
    data.append('table_id', table);
    data.append('row', row);
    data.append('field', field);
    data.append('filename', filename);
    data.append('notes', $(elem).val());

    jQuery.ajax({
        url: baseHttpUrl+'/ChangeDDFile',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST'
    });
}

function getRefDDL(sel) {
    var idx = $(sel).data('idx');
    var key = $(sel).data('key');
    var val = $(sel).val();

    var d_key, row = {};
    for(var i in tableHeaders) {
        d_key = tableHeaders[i].field;
        if ($.inArray(d_key, system_fields) == -1) {
            row[d_key] = $('#modals_inp_'+d_key).val();
        }
    }

    var html = '';
    var resp = $.ajax({
        url: baseHttpUrl + '/getRefDDL?req=' + btoa(JSON.stringify(tableDDLs[key].req_obj)) + '&row=' + btoa(JSON.stringify(row)),
        method: 'get',
        async: false
    }).responseText;
    resp = JSON.parse(resp);
    for (var i in resp) {
        html += '<option '+(val == resp[i] ? 'selected' : '')+' value="'+resp[i]+'">'+resp[i]+'</option>';
    }
    $(sel).html(html);
}

function addData() {
    if ($('#addingIsInline').is(':checked')) {
        addRowInline();
    } else {
        var lv = $('#list_view').is(':visible'),
            ltableHeaders = (lv ? tableHeaders : settingsTableHeaders),
            d_key;

        emptyDataObject = {};
        for (var key in ltableHeaders) {
            d_key = ltableHeaders[key].field;
            emptyDataObject[d_key] = "";
        }

        editSelectedData(-1);
    }
}

function addRowInline() {
    emptyDataObject = {};
    var d_key;
    for(var key in tableHeaders) {
        d_key = tableHeaders[key].field;
        emptyDataObject[d_key] = $('#' + d_key + 0 + tableHeaders[key].input_type + '_addrow > .td_wrap').html();
    }
    tableData.push(emptyDataObject);

    addRow(emptyDataObject);
    editSelectedData(-1);
}

function checkboxAddToggle() {
    var hdr_height = document.getElementById('tbHeaders_header').clientHeight;
    if ($('#addingIsInline').is(':checked')) {
        var lv = $('#list_view').is(':visible'),
            ltableHeaders = (lv ? tableHeaders : settingsTableHeaders),
            d_key;

        emptyDataObject = {};
        for (var key in ltableHeaders) {
            d_key = ltableHeaders[key].field;
            emptyDataObject[d_key] = "";
        }

        var rh = ( localStorage.getItem('row_height') == 'Small' ? 37 : ( localStorage.getItem('row_height') ? 47 : 67 ) );
        $('#tbAddRow').show();
        $('#tbHeaders').css('top', rh+'px');
        $('#divTbData').css('top', (rh+hdr_height)+'px');

        editSelectedData(-1);
    } else {
        $('#tbAddRow').hide();
        $('#tbHeaders').css('top', '0');
        $('#divTbData').css('top', hdr_height+'px');
    }
}

function deleteCurrentTable() {
    swal({
        title: "Are you sure?",
        text: "This action will permanently remove/delete all data associated to current data/table!",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: true
    },
    function () {
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/deleteAllTable',
            data: {
                table_name: selectedTableName
            },
            success: function (response) {
                window.location = '/data/';
            },
            error: function () {
                alert("Server error");
            }
        })
    });
}

function sortByColumn(col) {
    var key = $(col).data('key');
    if (sortCol == key) {
        sortASC = !sortASC
    } else {
        sortCol = key;
        sortASC = true;
    }
    changePage(1);
}
