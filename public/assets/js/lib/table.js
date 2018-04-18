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

    if (selectedTableName) {
        selectTable(selectedTableName);
        if (authUser) {//canEditSettings
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

    $('#selectUserSearch').select2({
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
        if (e.keyCode == 37) {
            if (e.ctrlKey) {
                showHideTableLib();
            } else {
                var left = document.getElementById('div_for_horizontal_scroll');
                left.scrollLeft -= 40;
            }
        }
        if (e.keyCode == 39) {
            if (e.ctrlKey) {
                showHideMenu();
            } else {
                var left = document.getElementById('div_for_horizontal_scroll');
                left.scrollLeft += 40;
            }
        }
    });

    //show filters
    if (localStorage.getItem('filter_hide') == 0) {
        $('#showHideMenuBtn').removeClass('menu-hidden');
        $('#showHideMenuBody').css('width', '260px');
        $(".table_body_viewport > .mCSB_scrollTools").css("right", '276px');
        $(".js-filterMenuHide").css("right", '270px');
        $(".js-filterMenuHide_2").css("right", '680px');
    }
    //hide menutree
    if (localStorage.getItem('menutree_hide') == 1) {
        $('#showTableLibBtn').addClass('menu-hidden');
        $('#showTableLibBody').css('width', '0');
        $(".js-table_lib_hide").css("left", '10px');
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
    filterMenuHide = true,
    MenutreeHide = false,
    MenutreeTab = localStorage.getItem('menutree_tab'),
    markerBounds = {top:0, left:0, right:0, bottom:0},
    tower_types = {'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png'};

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
    ddl_names_for_settings = [];

/* -------------------- Functions ---------------------- */

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

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            from_main_data: true,
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
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key, d_key, tbDataHeaders = "", visibleColumns = "", tbHiddenHeaders = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries, star_class;

    headerHasUnit = false;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td '+(i === 0 ? 'id="first_data_td"' : '')+'>' +
            '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a>' +
            '</td>';

        //second column ("star")
        if (authUser) {
            if (userOwner) {
                tableData +=
                    '<td style="font-size: 1.5em; text-align: center;">' +
                        '<a href="javascript:void(0)" onclick="toggleFavoriteRow(' + i + ',this)">' +
                            '<i class="fa ' + (data[i].is_favorited ? 'fa-star' : 'fa-star-o') + '" style="color: #FD0;"></i>' +
                        '</a> | ' +
                        '<a href="javascript:void(0)" onclick="deleteRow(tableData[' + i + '], ' + i + ')">' +
                            '<i class="fa fa-remove" style="color: #039;"></i>' +
                        '</a>' +
                    '</td>';
            } else {
                tableData += '<td style="font-size: 1.5em; text-align: center;"><a href="javascript:void(0)" onclick="toggleFavoriteRow('+i+',this)">' +
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
            tableData += '<td><a href="javascript:void(0)" onclick="toggleFavoriteRow('+i+',this)">' +
                '<i class="fa '+(star_class)+'" style="font-size: 1.5em;color: #FD0;"></i>' +
                '</a></td>';
        }

        //main table data
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + '_dataT"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    (d_key != 'id' && headers[key].can_edit ? 'onclick="showInlineEdit(\'' + headers[key].field + i + '_dataT\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tableData += (data[i][d_key] > 0 && tableDDLs['ddl_id'][data[i][d_key]] !== null ? tableDDLs['ddl_id'][data[i][d_key]] : '');
                } else {
                    tableData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "</tr>";

        //add row data
        if (i == 0) {
            tbAddRow += "<tr style='height: 53px;'>";
            tbAddRow += '<td></td>';
            tbAddRow += '<td></td>';
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tbAddRow +=
                        '<td ' +
                        'id="' + headers[key].field + i + headers[key].input_type + '_addrow"' +
                        'data-key="' + headers[key].field + '"' +
                        'data-input="' + headers[key].input_type + '"' +
                        'data-idx="' + i + '"' +
                        (d_key != 'id' && headers[key].can_edit ? 'onclick="showInlineEdit(\'' + headers[key].field + i + headers[key].input_type + '_addrow\', 0)"' : '') +
                        'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                        (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                        (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '"></td>';
                    /*if (d_key == 'id') {
                     tbAddRow += '<button class="btn btn-success" onclick="addRowInline()">Save</button></td>';
                     } else {
                     tbAddRow += '</td>';
                     }*/
                }
            }
            tbAddRow += "</tr>";

            tbAddRow_h += "<tr style='visibility: hidden;height: 53px'><td></td>";
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
        tbHiddenData += '<td><i class="fa fa-star-o" style="font-size: 1.5em;color: #FD0;"></i>|<i class="fa fa-remove" style="font-size: 1.5em;color: #05B;"></i></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tbHiddenData += (data[i][d_key] > 0 && tableDDLs['ddl_id'][data[i][d_key]] !== null ? tableDDLs['ddl_id'][data[i][d_key]] : '');
                } else {
                    tbHiddenData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tbHiddenData += '</td>';
            }
        }
        tbHiddenData += "</tr>";
    }

    //recreate headers for main data
    tbDataHeaders += "<tr><th rowspan='2' class='sorting nowrap'><b>#</b></th>";
    tbDataHeaders += "<th rowspan='2' class='sorting nowrap'><b>Actions</b></th>";
    for(var $hdr in headers) {
        tbDataHeaders += '<th ' +
            ' ' +
            (!headers[$hdr].unit ? 'rowspan="2" ' : '') +
            'class="sorting nowrap" ' +
            'data-key="' + headers[$hdr].field + '" ' +
            'data-order="' + $hdr + '" ' +
            'style="position: relative; ' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;' : '') +
            (headers[$hdr].min_wth > 0 ? 'min-width: '+headers[$hdr].min_wth+'px;' : '') +
            (headers[$hdr].max_wth > 0 ? 'max-width: '+headers[$hdr].max_wth+'px;' : '') +
            '">' +
            '<span draggable="true">' + ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : headers[$hdr].name) + '</span>' +
            '<div style="position: absolute; top: 0; bottom: 0; right: 0; width: 5px; cursor: col-resize;"></div>' +
            '<i style="display: block; height:1px; '+(headers[$hdr].min_wth > 0 ? 'width: '+(headers[$hdr].min_wth-20)+'px;' : '')+'"></i>' +
            '</th>';

        visibleColumns += '<li style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">';
        visibleColumns +=   '<input id="' + headers[$hdr].field + '_visibility" onclick="showHideColumn(\'' + headers[$hdr].field + '\')" class="checkcols" type="checkbox" '+(headers[$hdr].is_showed ? 'checked' : '')+' > ' +
                            '<label class="labels" for="' + headers[$hdr].field + '_visibility"> ' + headers[$hdr].name + ' </label>';
        visibleColumns += '</li>';
    }
    tbDataHeaders += "</tr>";
    //second header row
    tbDataHeaders += "<tr>";
    for(var $hdr in headers) {
        if (headers[$hdr].unit) {
            headerHasUnit = true;
            tbDataHeaders += '<th ' +
                'id="' + headers[key].field + $hdr + headers[key].input_type + '_header"' +
                'data-key="' + headers[$hdr].field + '" ' +
                'data-idx="' + (headers[$hdr].rows_ord-1) + '"' +
                'style="position: relative;' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;"' : '"') +
                (headers[$hdr].unit_ddl ? 'onclick="showInlineEdit(\'' + headers[key].field + $hdr + headers[key].input_type + '_header\', \'settings\')"' : '') +
                '>' +
                headers[$hdr].unit +
                '</th>';
        }
    }
    tbDataHeaders += "</tr>";
    tbHiddenHeaders = tbDataHeaders.replace('id=', 'data-hidden=');

    $('#tbAddRow_header').html(tbHiddenHeaders);
    $('#tbHeaders_header').html(tbDataHeaders);
    $('#tbData_header').html(tbHiddenHeaders);

    $('#ul-cols-list').html(visibleColumns);

    $('#tbAddRow_body').html(tbAddRow + tbHiddenData);
    $('#tbHeaders_body').html(tbHiddenData);
    $('#tbData_body').html(tableData);

    $('#tbAddRow').css('top', headerHasUnit ? '-64px' : '-32px');
    $('#tbData').css('margin-top', headerHasUnit ? '-64px' : '-32px');
    $('#divTbData').css('top', headerHasUnit ? '64px' : '32px');

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
        var cols = document.querySelectorAll('#tbHeaders_header th span[draggable="true"]');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('drop', handleDrop, false);
        });

        //add resize listeners for table headers
        cols = document.querySelectorAll('#tbHeaders_header th div');
        [].forEach.call(cols, function(col) {
            col.addEventListener('mousedown', handleStartResize, false);
        });
    }
}
document.addEventListener('mousemove', handleElemResize, false);
document.addEventListener('mouseup', handleEndResize, false);

var startX = 0, startWidth = 0, startResizeElem = false;
function handleStartResize(e) {
    startX = 0;
    startWidth = this.parentNode.clientWidth;
    startResizeElem = this.nextSibling;
    this.parentNode.style.minWidth = "0";
    this.parentNode.style.maxWidth = "1000px";
}

function handleElemResize(e) {
    if (startResizeElem) {
        console.log(startResizeElem);
        if (startX) {
            startWidth += e.x - startX;
            startX = e.x;
            startResizeElem.style.width = (startWidth-20)+'px';
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
                tableHeaders[i].min_wth = startWidth;
                tableHeaders[i].max_wth = startWidth;
                $.ajax({
                    url: baseHttpUrl + '/updateTableRow?tableName=tb_settings_display&id=' + tableHeaders[i].id + '&min_wth=' + startWidth + '&max_wth=' + startWidth,
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

    $(".js-table_lib_hide").css("left", MenutreeHide ? "10px" : "270px");
    $("#showTableLibBody .standard-tabs").css("display", MenutreeHide ? "none" : "");
}

function tablebar_show_public() {
    localStorage.setItem('menutree_tab', 'public');
    $("#tablebar_li_public").addClass("active");
    $("#tablebar_li_private").removeClass("active");
    $("#tablebar_li_favorite").removeClass("active");
    $("#tablebar_public_div").show();
    $("#tablebar_private_div").hide();
    $("#tablebar_favorite_div").hide();
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
    $("#tablebar_private_div").show();
    $("#tablebar_public_div").hide();
    $("#tablebar_favorite_div").hide();
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
    $("#tablebar_favorite_div").show();
    $("#tablebar_private_div").hide();
    $("#tablebar_public_div").hide();
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

    var right_scr = filterMenuHide ? "26px" : "276px";
    var right = filterMenuHide ? "20px" : "270px";
    var right_2 = filterMenuHide ? "420px" : "680px";
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
    var status;
    if (!$('#'+fieldKey+'_visibility').is(':checked')) {
        $('#tbAddRow th[data-key="'+fieldKey+'"], #tbAddRow td[data-key="'+fieldKey+'"]').hide();
        $('#tbHeaders th[data-key="'+fieldKey+'"], #tbHeaders td[data-key="'+fieldKey+'"]').hide();
        $('#tbData th[data-key="'+fieldKey+'"], #tbData td[data-key="'+fieldKey+'"]').hide();

        $('#tbFavoriteHeaders th[data-key="'+fieldKey+'"], #tbFavoriteHeaders td[data-key="'+fieldKey+'"]').hide();
        $('#tbFavoriteData th[data-key="'+fieldKey+'"], #tbFavoriteData td[data-key="'+fieldKey+'"]').hide();
        $('#tbFavoriteCheckRow th[data-key="'+fieldKey+'"], #tbFavoriteCheckRow td[data-key="'+fieldKey+'"]').hide();

        status = 'Hide';
    } else {
        $('#tbAddRow th[data-key="'+fieldKey+'"], #tbAddRow td[data-key="'+fieldKey+'"]').show();
        $('#tbHeaders th[data-key="'+fieldKey+'"], #tbHeaders td[data-key="'+fieldKey+'"]').show();
        $('#tbData th[data-key="'+fieldKey+'"], #tbData td[data-key="'+fieldKey+'"]').show();

        $('#tbFavoriteHeaders th[data-key="'+fieldKey+'"], #tbFavoriteHeaders td[data-key="'+fieldKey+'"]').show();
        $('#tbFavoriteData th[data-key="'+fieldKey+'"], #tbFavoriteData td[data-key="'+fieldKey+'"]').show();
        $('#tbFavoriteCheckRow th[data-key="'+fieldKey+'"], #tbFavoriteCheckRow td[data-key="'+fieldKey+'"]').show();

        status = 'Show';
    }
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/showHideColumnToggle?tableName=' + selectedTableName + '&col_key=' + fieldKey + '&status=' + status
    })
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
            url: baseHttpUrl + '/changeOrder?tableName='+selectedTableName+'&select='+selectedForChangeOrder+'&target='+target,
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
    var cols = document.querySelectorAll('#tbHeaders_header th span[draggable="true"]');
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
    $('.showhidemenu').show();
    selectedForChangeOrder = -1;
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
    $('.showhidemenu').show();
    changeFavoritePage(1);
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
    $('#showHideColumnsList').hide();
    selectedForChangeOrder = -1;
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

function downloaderGo() {
    var query = {}, method = $('#downloader_type').val();

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
            var key, d_key;

            html += "<thead><tr>";
            for (var m = 0; m < tableHeaders.length; m++) {
                html += '<th style="border: solid 1px #000;padding: 3px 5px;background-color: #AAA; ' + (tableHeaders[m].web == 'No' ? 'display: none;' : '') + '">'+tableHeaders[m].name+'</th>';
            }
            html += "</tr></thead>";

            html += "<tbody>";
            for(var i = 0; i < tableData.length; i++) {
                html += "<tr>";
                for(key in tableHeaders) {
                    d_key = tableHeaders[key].field;
                    html += '<td style="border: solid 1px #000;padding: 3px 5px; ' + (tableHeaders[key].web == 'No' ? 'display: none;' : '') + '">' + (tableData[i][d_key] !== null ? tableData[i][d_key] : '') + '</td>';
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
    changeFavoritePage(1);
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

    //freeze 'unit' field if 'unit_ddl' is empty (for Settings/Display Tab)
    if (
        id.indexOf('settingsDisplay') > -1
        &&
        key == 'unit'
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
    $('#'+id).data('innerHTML', $('#'+id).html());

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
        if (key == 'ddl_id' || key == 'unit_ddl') {
            for(var i in ltableDDls['ddl_id']) {
                html += '<option value="'+i+'">'+ltableDDls['ddl_id'][i]+'</option>';
            }
        } else
        if (key == 'unit') {
            for (var i in settingsDDLs) {
                if (settingsDDLs[i].id == settingsTableData[idx].unit_ddl) {
                    for (var j in settingsDDLs[i].items) {
                        html += '<option value="'+settingsDDLs[i].items[j].option+'">'+settingsDDLs[i].items[j].option+'</option>';
                    }
                }
            }
        }  else
        if (ltableDDls[key].req_obj) {//if reference ddl which needs request to the server
            var resp = $.ajax({
                url: baseHttpUrl + '/getRefDDL?req=' + JSON.stringify(ltableDDls[key].req_obj) + '&row=' + JSON.stringify(tableData[idx]),
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
    $('#'+id)
        .html( $('#'+id).data('innerHTML') )
        .data('innerHTML', '');
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
            alert(response.msg);
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
            strParams += key + '=' + params[key] + '&';
        }
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

function updateRow(params, to_change) {
    var lv = $('#list_view').is(':visible'),
        lselectedTableName = (lv && to_change != 'settings' ? selectedTableName : settingsTableName);

    $('.loadingFromServer').show();

    var strParams = "";
    for (var key in params) {
        if ($.inArray(key, arrAddFieldsInData) == -1) {
            strParams += key + '=' + params[key] + '&';
        }
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

function updateRowData(idx, key, id, to_change) {
    var lv = $('#list_view').is(':visible'),
        ltableData = (lv && to_change != 'settings' ? tableData : settingsTableData);

    if (to_change == 'settings') {
        for (var tb in tableHeaders) {
            if (tableHeaders[tb].field == key) {
                key = 'unit';
                tableHeaders[tb].unit = $('#'+id).val();
                break;
            }
        }
    }

    ltableData[idx][key] = $('#'+id).val();

    var par_id = id.substr(0, id.length-4);
    $('#'+id).data('innerHTML', ltableData[idx][key]);

    updateRow(ltableData[idx], to_change);
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
        if (d_key != 'id') {
            ltableData[idx][d_key] = $('#modals_inp_'+d_key).val();
        }
    }

    updateRow(ltableData[idx], 0);
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
        ltableDDLs = (lv ? tableDDLs : settingsTableDDLs);

    if (idx > -1) {
        lv ? $('#modal_btn_delete').show() : $('#modal_btn_delete').hide();
        $('#modal_btn_update').show();
        $('#modal_btn_add').hide();
    } else {
        $('#modal_btn_delete, #modal_btn_update').hide();
        $('#modal_btn_add').show();
    }

    var html = "", d_key;
    for(var key in ltableHeaders) {
        d_key = ltableHeaders[key].field;
        if (d_key != 'id' && d_key != 'is_favorited') {
            html += "<tr>";
            html +=
                '<td><label>' + ltableHeaders[key].name + '</label></td>' +
                '<td>';
            if (ltableHeaders[key].input_type == 'Input' && ltableHeaders[key].can_edit) {
                html += '<input id="modals_inp_'+d_key+'" type="text" class="form-control" />';
            } else
            if (ltableHeaders[key].input_type == 'Selection' && ltableHeaders[key].can_edit) {
                html += '<select class="form-control" id="modals_inp_'+d_key+'" class="form-control" style="margin-bottom: 5px">';
                for(var i in ltableDDLs[key]) {
                    html += '<option val="'+ltableDDLs[key][i]+'">'+ltableDDLs[key][i]+'</option>';
                }
                html += '</select>';
            }
            else {
                html += '<input id="modals_inp_'+d_key+'" type="text" class="form-control" readonly/>';
            }
            html += '</td>';
            html += "</tr>";
        }
    }
    $('#modals_rows').html(html);

    //set current values for editing
    if (idx > -1) {
        for(var key in ltableHeaders) {
            d_key = ltableHeaders[key].field;
            $('#modals_inp_'+d_key).val( ltableData[idx][d_key] );
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
        emptyDataObject[d_key] = $('#' + d_key + 0 + tableHeaders[key].input_type + '_addrow').html();
    }
    tableData.push(emptyDataObject);

    addRow(emptyDataObject);
    editSelectedData(-1);
}

function checkboxAddToggle() {
    if ($('#addingIsInline').is(':checked')) {
        var lv = $('#list_view').is(':visible'),
            ltableHeaders = (lv ? tableHeaders : settingsTableHeaders),
            d_key;

        emptyDataObject = {};
        for (var key in ltableHeaders) {
            d_key = ltableHeaders[key].field;
            emptyDataObject[d_key] = "";
        }

        $('#tbAddRow').show();
        $('#tbHeaders').css('top', '53px');
        $('#divTbData').css('top', headerHasUnit ? '117px' : '85px');

        editSelectedData(-1);
    } else {
        $('#tbAddRow').hide();
        $('#tbHeaders').css('top', '0');
        $('#divTbData').css('top', headerHasUnit ? '64px' : '32px');
    }
}

function deleteCurrentTable() {
    swal({
        title: "Are you sure?",
        text: "This action will permanently remove/delete all data associated to current data/table!",
        type: "warning",
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
                window.location = '/data/all';
            },
            error: function () {
                alert("Server error");
            }
        })
    });
}







/* --------------------------- Favorites tab -----------------------------------*/

var selectedFavoritePage = 0,
    favoriteRowsCount = 0,
    favoriteTableData = [],
    favoriteTableHeaders = [];

function changeFavoritePage(page) {
    $('.loadingFromServer').show();
    selectedFavoritePage = page-1;

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/getFavoritesForTable',
        data: {
            tableName: selectedTableName,
            p: selectedFavoritePage,
            c: selectedEntries
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Favorite', response);
            if (authUser && table_meta.source != 'remote') {
                favoriteRowsCount = response.rows;
                favoriteTableData = response.data;
            } else {
                favoriteRowsCount = 0;
            }
            favoriteTableHeaders = response.headers;
            showFavoriteDataTable(favoriteTableHeaders, favoriteTableData);
            showFavoriteTableFooter();
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    })
}

function showFavoriteDataTable(headers, data) {
    var tableData = "", tbHiddenData = "", tbCheckRow = "", tbAddRow_h = "", key, d_key, tbDataHeaders = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries, headerHasUnit = false;

    for(var i = 0; i < data.length; i++) {
        if (i === 0) { //first row with checkboxes
            tbCheckRow += "<tr>";
            tbCheckRow += '<td></td> <td></td> ';
            tbCheckRow += '<td style="padding: 4px;">' +
                'R:<input type="checkbox" id="favCheckAllRow" onchange="favCheckAll(\'row\')"> ' +
                'H:<input type="checkbox" id="favCheckAllCol" onchange="favCheckAll(\'col\')">' +
                '</td>';
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tbCheckRow += '<td ' +
                        'data-key="' + headers[key].field + '"' +
                        'style="text-align: center;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                            '<input ' +
                            'type="checkbox" ' +
                            'class="js-favoriteColsChecked" ' +
                            'data-key="' + headers[key].field + '"' +
                            'onchange="favTestCheckAll(\'col\')"' +
                            '>' +
                        '</td>';
                }
            }
            tbCheckRow += "</tr>";
        }

        tableData += "<tr>";
        tableData += '<td>' +
            '<span class="font-icon">`</span><b>'+ (i+1+Number(selectedFavoritePage*lselectedEntries)) +'</b>' +
            '</td>';
        //second column ("star")
        tableData += '<td><a href="javascript:void(0)" onclick="removeFavoriteRow('+i+',this)">' +
            '<i class="fa fa-star" style="font-size: 1.5em;color: #FD0;"></i>' +
            '</a></td>';
        //checkbox for selecting
        tableData += '<td style="text-align: center;">' +
            '<input type="checkbox" class="js-favoriteRowsChecked" data-idx="' + i + '" onchange="favTestCheckAll(\'row\')">' +
            '</td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tableData += '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '"' +
                    '>' +
                        (data[i][d_key] !== null ? data[i][d_key] : '') +
                    '</td>';
            }
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1+Number(selectedFavoritePage*lselectedEntries)) +'</b></td>';
        //second column ("star")
        tbHiddenData += '<td>' + '<i class="fa fa-star" style="font-size: 1.5em;color: #FD0;"></i>' + '</td>';
        tbHiddenData += '<td></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tbHiddenData += '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '"' +
                    '>' +
                        (data[i][d_key] !== null ? data[i][d_key] : '') +
                    '</td>';
            }
        }
        tbHiddenData += "</tr>";
    }

    //first header row
    tbDataHeaders += "<tr><th class='sorting nowrap' rowspan='2'><b>#</b></th>";
    tbDataHeaders += "<th class='sorting nowrap' rowspan='2'><b>Favorite</b></th>";
    tbDataHeaders += "<th class='sorting nowrap' rowspan='2'><b>Copy</b></th>";
    for(var $hdr in headers) {
        tbDataHeaders += '<th class="sorting nowrap" ' +
            (!headers[$hdr].unit ? 'rowspan="2" ' : '') +
            'data-key="' + headers[$hdr].field + '" ' +
            'style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">' +
            ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : headers[$hdr].name) +
            '</th>';
    }
    tbDataHeaders += "</tr>";
    //second header row
    tbDataHeaders += "<tr>";
    for(var $hdr in headers) {
        if (headers[$hdr].unit) {
            headerHasUnit = true;
            tbDataHeaders += '<th ' +
                'data-key="' + headers[$hdr].field + '" ' +
                'style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">' +
                    headers[$hdr].unit +
                '</th>';
        }
    }
    tbDataHeaders += "</tr>";

    $('#tbFavoriteHeaders_header').html(tbDataHeaders);
    $('#tbFavoriteData_header').html(tbDataHeaders);
    $('#tbFavoriteCheckRow_header').html(tbDataHeaders);

    $('#tbFavoriteHeaders_body').html(tbHiddenData);
    $('#tbFavoriteData_body').html(tableData);
    $('#tbFavoriteCheckRow_body').html(tbCheckRow + tbHiddenData);

    $('#tbFavoriteCheckRow').css('top', headerHasUnit ? '-64px' : '-32px');
    $('#tbFavoriteDataDiv').css('top', headerHasUnit ? '101px' : '69px');
    $('#tbFavoriteData').css('margin-top', headerHasUnit ? '-65px' : '-33px');
}

function showFavoriteTableFooter() {
    var lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;
    $('#favorite_showing_from_span').html((selectedFavoritePage)*lselectedEntries + 1);
    $('#favorite_showing_to_span').html((selectedFavoritePage+1)*selectedEntries < favoriteRowsCount ? (selectedFavoritePage+1)*lselectedEntries : favoriteRowsCount);
    $('#favorite_showing_all_span').html(favoriteRowsCount);


    var maxPage = lselectedEntries ? Math.ceil(favoriteRowsCount/lselectedEntries) : 1;
    var paginateBtns = [], pbtn;
    if (selectedFavoritePage+1 < 5) {
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
        if (selectedFavoritePage+1 > (maxPage-5)) {
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
            paginateBtns.push(selectedFavoritePage);
            paginateBtns.push(selectedFavoritePage + 1);
            paginateBtns.push(selectedFavoritePage + 2);
            paginateBtns.push('...');
            paginateBtns.push(maxPage);
        }
    }

    var paginateHTML = '';
    for(var i = 0; i < paginateBtns.length; i++) {
        if (pbtn == '...') {
            paginateHTML += '<span>...</span>';
        } else {
            paginateHTML += '<a class="paginate_button" tabindex="0" onclick="changeFavoritePage('+paginateBtns[i]+')">'+paginateBtns[i]+'</a>';
        }
    }
    $('#favorite_paginate_btns_span').html(paginateHTML);
}

function favCheckAll(type) {
    var cls = type == 'row' ? '.js-favoriteRowsChecked' : '.js-favoriteColsChecked',
        id = type == 'row' ? '#favCheckAllRow' : '#favCheckAllCol';
    if ($(id).is(':checked')) {
        $(cls).prop("checked", true);
    } else {
        $(cls).prop("checked", false);
    }
}

function favTestCheckAll(type) {
    var cls = type == 'row' ? '.js-favoriteRowsChecked' : '.js-favoriteColsChecked',
        id = type == 'row' ? '#favCheckAllRow' : '#favCheckAllCol';
    if ($(cls).not(':checked').length) {
        $(id).prop("checked", false);
    } else {
        $(id).prop("checked", true);
    }
}

function removeFavoriteRow(idx, elem) {
    if (authUser) {
        for(var j = 0; j < tableData.length; j++) {
            if (favoriteTableData[idx].id == tableData[j].id) {
                tableData[j].is_favorited = 0;
                break;
            }
        }
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/favouriteToggleRow?tableName=' + selectedTableName + '&row_id=' + favoriteTableData[idx].id + '&status=Inactive'
        });
    }
    favoriteTableData.splice(idx, 1);
    showFavoriteDataTable(favoriteTableHeaders, favoriteTableData);
    showDataTable(tableHeaders, tableData);
}

function favoritesCopyToClipboard() {
    if (authUser) {
        var selectedColumns = [];
        $('.js-favoriteColsChecked:checked:visible').each(function (i, elem) {
            selectedColumns.push( $(elem).data('key') );
        });

        var textToClip = "<table id='tableForCopy'>";
        if ($('#favourite_copy_with_headers').is(':checked')) {
            //first headers row
            textToClip += "<tr>";
            for (var j = 0; j < selectedColumns.length; j++) {
                for (var k = 0; k < favoriteTableHeaders.length; k++) {
                    if (favoriteTableHeaders[k].field == selectedColumns[j]) {
                        textToClip += "<td "+(favoriteTableHeaders[k].unit ? '' : 'rowspan="2"')+">" + favoriteTableHeaders[k].name + "</td>";
                    }
                }
            }
            textToClip += "</tr>";
            //second headers row
            textToClip += "<tr>";
            for (var j = 0; j < selectedColumns.length; j++) {
                for (var k = 0; k < favoriteTableHeaders.length; k++) {
                    if (favoriteTableHeaders[k].field == selectedColumns[j] && favoriteTableHeaders[k].unit) {
                        textToClip += "<td>" + favoriteTableHeaders[k].unit + "</td>";
                    }
                }
            }
            textToClip += "</tr>";
        }
        $('.js-favoriteRowsChecked:checked').each(function (i, elem) {
            var idx = $(elem).data('idx');
            textToClip += "<tr>";
            for (var j = 0; j < selectedColumns.length; j++) {
                textToClip += "<td>" + favoriteTableData[ idx ][ selectedColumns[j] ] + "</td>";
            }
            textToClip += "</tr>";
        });
        textToClip += "</table>";
        console.log(textToClip);

        copyToClipboard(textToClip);
    } else {
        swal({
            title: "Only available to logged in user. Register and login to make full use of all functions and features.",
            type: "warning"
        });
    }
}

function copyToClipboard(text) {
    $(document.body).append(text);
    selectElementContents(tableForCopy);
    document.body.removeChild(tableForCopy);
}

function selectElementContents(el) {
    var body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
        document.execCommand("copy");

    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
        range.execCommand("Copy");
    }
}







/* ------------------------ Display / tab 'Settings' ----------------------------*/

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
            p: 0,
            c: settingsEntries,
            q: JSON.stringify(query),
            tableSelected: selectedTableName
        },
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Settings/Display', response);
            settingsRowsCount = response.rows;
            settingsTableData = response.data;
            settingsTableHeaders = response.headers;
            settingsTableDDLs = response.ddls;
            //ddl_names_for_settings = response.ddl_names_for_settings;
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
    //$('.loadingFromServer').show();
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
            p: settingsPage,
            c: settingsEntries,
            q: JSON.stringify(query),
            fields: JSON.stringify(settingsTableHeaders),
            tableSelected: selectedTableName
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Settings/Display', response);
            settingsRowsCount = response.rows;
            settingsTableData = response.data;
            settingsTableHeaders = response.headers;
            settingsTableDDLs = response.ddls;
            //ddl_names_for_settings = response.ddl_names_for_settings;
            showSettingsDataTable(settingsTableHeaders, settingsTableData);
            showSettingsTableFooter();
            //$('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            //$('.loadingFromServer').hide();
        }
    })
}

function showSettingsDataTable(headers, data) {
    var tableData = "", tbHiddenData = "", key, d_key, tbSettingsHeaders = "",
        lsettingsEntries = settingsEntries == 'All' ? 0 : settingsEntries;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td data-order="'+i+'" draggable="true"><i style="width: 100%;text-align: center;" class="fa fa-bars"></i></td>';
        tableData += '<td><a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'ddl_name') {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + '_settingsDisplay"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    'data-settings="true"' +
                    (d_key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + '_settingsDisplay\', '+authUser+')"' : '') + //canEditSettings
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tableData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else
                if (d_key === 'dfot_odr') {
                    tableData += '<button draggable="true" class="btn btn-sm" style="width: 100%">'
                        + get_calc_odr(data[i].field) +
                        '</button>';
                } else {
                    tableData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        tbHiddenData += "<td></td>";
        tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'ddl_name') {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tbHiddenData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else
                if (d_key === 'dfot_odr') {
                    tbHiddenData += '<button class="btn btn-sm" style="width: 100%">'+ key +'</button>';
                } else {
                    tbHiddenData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tbHiddenData += '</td>';
            }
        }
        tbHiddenData += "</tr>";
    }

    //recreate headers for main data
    tbSettingsHeaders += "<tr> <th class='sorting nowrap'><b>Ord</b></th> <th class='sorting nowrap'><b>#</b> </th>";
    for(var $hdr in headers) {
        tbSettingsHeaders += '<th ' +
            'draggable="true" ' +
            'class="sorting nowrap" ' +
            'data-key="' + headers[$hdr].field + '" ' +
            'data-order="' + $hdr + '" ' +
            'style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') +
            (headers[$hdr].min_wth > 0 ? 'min-width: '+headers[$hdr].min_wth+'px;' : '') +
            (headers[$hdr].max_wth > 0 ? 'max-width: '+headers[$hdr].max_wth+'px;' : '') +
            '">' +
            ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : headers[$hdr].name) +
            '</th>';
    }
    tbSettingsHeaders += "</tr>";

    $('#tbSettingsHeaders_head').html(tbSettingsHeaders);
    $('#tbSettingsData_head').html(tbSettingsHeaders);

    $('#tbSettingsHeaders_body').html(tbHiddenData);
    $('#tbSettingsData_body').html(tableData);

    //add drag listeners for table headers
    if (authUser) {
        var cols = document.querySelectorAll('#tbSettingsHeaders_head th[draggable="true"]');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings, false);
            col.addEventListener('dragend', handleDragEndSettings, false);
        });

        var cols_dfot = document.querySelectorAll('#tbSettingsData_body button[draggable="true"]');
        [].forEach.call(cols_dfot, function(col) {
            col.addEventListener('dragstart', handleDragStartSettings_dfot, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings_dfot, false);
            col.addEventListener('dragend', handleDragEndSettings_dfot, false);
        });

        var rows = document.querySelectorAll('#tbSettingsData_body td[draggable="true"]');
        [].forEach.call(rows, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings_rows, false);
            col.addEventListener('dragend', handleDragEndSettings_rows, false);
        });
    }
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

function get_calc_odr(key) {
    for (var i in tableHeaders) {
        if (tableHeaders[i].field === key) {
            return Number(i)+1;
        }
    }
}

function handleDropSettings(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = this.dataset.order;
    if (selectedForChangeOrder > -1 && selectedForChangeOrder !== target) {
        var reoderedArr = [];
        for (var i in settingsTableHeaders) {
            if (i == target) {
                reoderedArr.push(settingsTableHeaders[selectedForChangeOrder]);
                reoderedArr.push(settingsTableHeaders[i]);
            } else
            if (i != selectedForChangeOrder) {
                reoderedArr.push(settingsTableHeaders[i]);
            }
        }
        settingsTableHeaders = reoderedArr;

        showSettingsDataTable(settingsTableHeaders, settingsTableData);

        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/changeOrder?tableName='+settingsTableName+'&select='+selectedForChangeOrder+'&target='+target,
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

function handleDragEndSettings(e) {
    var cols = document.querySelectorAll('#tbSettingsHeaders_head th[draggable="true"]');
    this.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}

function handleDragStartSettings_dfot(e) {
    selectedForChangeOrder = Number(this.innerHTML)-1;
    this.style.opacity = '0.6';
}

function handleDropSettings_dfot(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = Number(this.innerHTML)-1;
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
            url: baseHttpUrl + '/changeOrder?tableName='+selectedTableName+'&select='+selectedForChangeOrder+'&target='+target,
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

function handleDragEndSettings_dfot(e) {
    var cols = document.querySelectorAll('#tbSettingsData_body button[draggable="true"]');
    this.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}

function handleDropSettings_rows(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = this.dataset.order;
    if (selectedForChangeOrder > -1 && selectedForChangeOrder !== target) {
        var reoderedArr = [];
        for (var i in settingsTableData) {
            if (i == target) {
                reoderedArr.push(settingsTableData[selectedForChangeOrder]);
                reoderedArr.push(settingsTableData[i]);
            } else
            if (i != selectedForChangeOrder) {
                reoderedArr.push(settingsTableData[i]);
            }
        }
        settingsTableData = reoderedArr;

        showSettingsDataTable(settingsTableHeaders, settingsTableData);

        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/changeSettingsRowOrder?tableName='+selectedTableName+'&select='+selectedForChangeOrder+'&target='+target,
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

function handleDragEndSettings_rows(e) {
    var cols = document.querySelectorAll('#tbSettingsData_body td[draggable="true"]');
    this.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
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
                url: baseHttpUrl + '/loadFilter?tableName=' + selectedTableName + '&field='+ header_key +'&name='+ settingsTableData[idx]['name'],
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
    changeSettingsPage(1);
    $('#div_settings_rights').hide();
    $('#div_settings_ddl').hide();
    $('#div_settings_display').show();
    $('#li_settings_rights').removeClass('active');
    $('#li_settings_ddl').removeClass('active');
    $('#li_settings_display').addClass('active');
}











/* ------------------------ DDL / tab 'Settings' ----------------------------*/

var settingsDDLs,
    settingsDDL_hdr,
    settingsDDL_items_hdr,
    settingsDDL_Obj,
    settingsDDL_ItemsObj,
    settingsDDL_REFObj,
    settingsDDL_selectedIndex = -1,
    settingsDDL_TableMeta,
    settingsDDL_cdtns_headers;

function getDDLdatas(tableName) {
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/getDDLdatas?tableName=' + tableName,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Settings/DDL', response);
            settingsDDLs = response.data;
            settingsDDL_hdr = response.DDL_hdr;
            settingsDDL_items_hdr = response.DDL_items_hdr;
            settingsDDL_TableMeta = response.table_meta;
            settingsDDL_cdtns_headers = response.cdtns_headers;
            availableDDL = response.available_DDL;
            settingsDDL_Obj = setAllNullObj(settingsDDL_hdr);
            settingsDDL_ItemsObj = setAllNullObj(settingsDDL_items_hdr);
            settingsDDL_REFObj = setAllNullObj(settingsDDL_cdtns_headers);
            showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showSettingsDDLDataTable(headers, data, idx) {
    var tableData = "", tbHiddenData = "", tbAddRow = "", key, d_key;

    if (settingsDDL_selectedIndex > -1) {
        $('#row_' + settingsDDL_selectedIndex + '_settings_ddl').css('background-color', '#FFA');
    }

    if (idx > -1) {
        $('.settings_ddl_rows').css('background-color', '#FFF');
        $('#row_' + idx + '_settings_ddl').css('background-color', '#FFA');
        settingsDDL_selectedIndex = idx;
        if (settingsDDLs[idx].type == 'referencing') {
            $('#add_settings_references_btn').show();
            data = settingsDDLs[idx].referencing;
            headers = settingsDDL_cdtns_headers;
        } else {
            $('#add_settings_references_btn').hide();
            data = settingsDDLs[idx].items;
        }
    }

    var add_id_name = (idx == -1 ? '_settings_ddl' : (settingsDDLs[idx].type != 'referencing' ? '_settings_items_ddl' : '_settings_references')),
        add_table_name = (idx == -1 ? 'ddl' : (settingsDDLs[idx].type != 'referencing' ? 'ddl_items' : 'cdtns')),
        func_name = (idx == -1 ? 'showInlineEdit_SDDL' : (settingsDDLs[idx].type != 'referencing' ? 'showInlineEdit_SDDL' : 'showInlineEdit_REFDDL')),
        edited_fields = (idx == -1 ? ['name','type','notes'] : (settingsDDLs[idx].type != 'referencing' ? ['option','notes'] : ['use','ref_tb','ref_tb_field','sampleing','logic_opr','comp_ref_field','compare','comp_tar_field','notes']));

    for (var i = 0; i < data.length; i++) {
        tableData += "<tr id='row_" + i + "_settings_ddl' class='settings_ddl_rows'>";
        tableData += '<td><a '+(idx == -1 ? 'onclick="showSettingsDDLDataTable(settingsDDL_items_hdr, \'\', '+i+')"' : '')+' class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1) +'</b></a></td>';
        for (key in headers) {
            d_key = headers[key].field;
            if (d_key != 'items') {
                tableData +=
                    '<td ' +
                    'id="' + d_key + i + add_id_name + '"' +
                    'data-key="' + d_key + '"' +
                    'data-idx="' + i + '"' +
                    'data-table="' + add_table_name + '"' +
                    'data-table_idx="' + idx + '"' +
                    (($.inArray(d_key, edited_fields) > -1) ? 'onclick="'+func_name+'(\'' + d_key + i + add_id_name + '\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'tb_id') {
                    tableData += settingsDDL_TableMeta.name;
                } else if (idx != -1 && d_key === 'list_id') {
                    tableData += settingsDDLs[idx].name;
                } else {
                    tableData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "<td><button onclick='deleteSettingsDDL(\""+add_table_name+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
        tableData += "</tr>";

        tbHiddenData += "<tr style='visibility: hidden;'>";
        if (i == 0) {
            tbHiddenData += '<td><a href=\"javascript:void(0)\" class=\"button blue-gradient glossy\">Add</a></td>';
        } else {
            tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        }
        for (key in headers) {
            d_key = headers[key].field;
            if (d_key != 'items') {
                tbHiddenData += '<td style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'tb_id') {
                    tbHiddenData += settingsDDL_TableMeta.name;
                } else if (idx != -1 && d_key === 'list_id') {
                    tbHiddenData += settingsDDLs[idx].name;
                } else {
                    tbHiddenData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tbHiddenData += '</td>';
            }
        }
        if (i == 0) {
            tbHiddenData += '<td><a href=\"javascript:void(0)\" class=\"button blue-gradient glossy\">Add</a></td>';
        } else {
            tbHiddenData += "<td><button><i class='fa fa-trash-o'></i></button></td>";
        }
        tbHiddenData += "</tr>";
    }

    tbAddRow += "<tr style='height: 37px;'><td><a href=\"javascript:void(0)\" class=\"button blue-gradient glossy\" onclick=\"saveSettingsDDLRow('"+add_table_name+"')\">Add</a></td>";
    for (key in headers) {
        d_key = headers[key].field;
        if (d_key != 'items') {
            tbAddRow += '<td ' +
                'id="add_' + d_key + add_id_name + '"' +
                'data-key="' + d_key + '"' +
                'data-table="' + add_table_name + '"' +
                (($.inArray(d_key, edited_fields) > -1) ? 'onclick="'+func_name+'(\'add_' + d_key + add_id_name + '\', 0)"' : '') +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    (($.inArray(d_key, edited_fields) == -1) ? 'auto' : '') +
                '</td>';
        }
    }
    tbAddRow += "<td><a href=\"javascript:void(0)\" class=\"button blue-gradient glossy\" onclick=\"saveSettingsDDLRow('"+add_table_name+"')\">Add</a></td>";
    tbAddRow += "</tr>";

    if (idx > -1) {
        $('#settings_selected_DDL_name').html('('+settingsDDLs[idx].name+')');

        if (settingsDDLs[idx].type == 'referencing') {
            $('._settings_selected_DDL_reference').show();
            $('._settings_selected_DDL_regular').hide();
            //$('#tbSettingsDDL_References_addrow').html(tbAddRow+tbHiddenData);
            $('#tbSettingsDDL_References_headers').html(tbHiddenData);
            $('#tbSettingsDDL_References_data').html(tableData+tbAddRow);
        } else {
            $('._settings_selected_DDL_regular').show();
            $('._settings_selected_DDL_reference').hide();
            //$('#tbSettingsDDL_Items_addrow').html(tbAddRow+tbHiddenData);
            $('#tbSettingsDDL_Items_headers').html(tbHiddenData);
            $('#tbSettingsDDL_Items_data').html(tableData+tbAddRow);
        }
    } else {
        //$('#tbSettingsDDL_addrow').html(tbAddRow+tbHiddenData);
        $('#tbSettingsDDL_headers').html(tbHiddenData);
        $('#tbSettingsDDL_data').html(tableData+tbAddRow);
    }
}

function showInlineEdit_REFDDL(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var key = $('#'+id).data('key'),
        idx = $('#'+id).data('idx'),
        html, options;

    if (key == 'use') {
        options = '<option>DDL</option><option>Permission</option>';
    } else
    if (key == 'sampleing') {
        options = '<option>Distinctive</option><option>Full</option>';
    } else
    if (key == 'logic_opr') {
        options = '<option>AND</option><option>OR</option>';
    } else
    if (key == 'compare') {
        options = '<option><</option><option>=</option><option>></option>';
    }

    if (key == 'use' || key == 'sampleing' || key == 'logic_opr' || key == 'compare') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            options +
            '</select>';
    } else
    if (key == 'ref_tb') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for (var i in tablesDropDown) {
            html += '<option value="'+tablesDropDown[i].db_tb+'">'+tablesDropDown[i].name+'</option>';
        }
        html += '</select>';
    } else
    if (key == 'ref_tb_field' || key == 'comp_ref_field') {
        var table_name = (idx !== undefined ? settingsDDLs[settingsDDL_selectedIndex].referencing[idx]['ref_tb'] : settingsDDL_REFObj.ref_tb);
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for (var i in tablesDropDown) {
            if (tablesDropDown[i].db_tb == table_name) {
                for (var j in tablesDropDown[i].items) {
                    html += '<option value="'+tablesDropDown[i].items[j].field+'">'+tablesDropDown[i].items[j].name+'</option>';
                }
                break;
            }
        }
        html += '</select>';
    } else
    if (key == 'comp_tar_field') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for (var i in tablesDropDown) {
            if (tablesDropDown[i].id == settingsDDL_TableMeta.id) {
                for (var j in tablesDropDown[i].items) {
                    html += '<option value="'+tablesDropDown[i].items[j].field+'">'+tablesDropDown[i].items[j].name+'</option>';
                }
            }
        }
        html += '</select>';
    } else {
        html = '<input ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function showInlineEdit_SDDL(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var inp_t = $('#'+id).data('input'),
        idx = $('#'+id).data('idx'),
        key = $('#'+id).data('key'),
        html;

    if (key == 'type') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            '<option>regular</option>' +
            '<option>referencing</option>' +
            '</select>';
    } else {
        html = '<input ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    }

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
        if (settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
            settingsDDLs[table_idx].referencing[idx][key_name] = $('#'+id).val();
            tableName = 'cdtns';
            params = settingsDDLs[table_idx].referencing[idx];
        } else {
            settingsDDLs[table_idx].items[idx][key_name] = $('#'+id).val();
            tableName = 'ddl_items';
            params = settingsDDLs[table_idx].items[idx];
        }
    }

    var strParams = "";
    for (var key in params) {
        if (key != 'items' && key != 'referencing' && params[key] !== null) {
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
        if (settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
            settingsDDL_REFObj[key_name] = $('#'+id).val();
        } else {
            settingsDDL_ItemsObj[key_name] = $('#'+id).val();
        }
    }
}

function deleteSettingsDDL(tableName, rowId, idx) {
    if (tableName == 'ddl') {
        settingsDDLs.splice(idx, 1);
        showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
        $('#tbSettingsDDL_References_data').html('');
        $('#tbSettingsDDL_Items_data').html('');
    } else {
        if (settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
            settingsDDLs[settingsDDL_selectedIndex].referencing.splice(idx, 1);
        } else {
            settingsDDLs[settingsDDL_selectedIndex].items.splice(idx, 1);
        }
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
        settingsDDL_Obj['referencing'] = [];
        settingsDDL_Obj['tb_id'] = settingsDDL_TableMeta.id;
    } else {
        if (settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
            settingsDDL_REFObj['ddl_id'] = settingsDDLs[settingsDDL_selectedIndex].id;
            settingsDDL_REFObj['tb_id'] = settingsDDL_TableMeta.id;
            settingsDDL_REFObj['user_id'] = authUser;
        } else {
            settingsDDL_ItemsObj['list_id'] = settingsDDLs[settingsDDL_selectedIndex].id;
        }
    }

    var params = (tableName == 'ddl' ? settingsDDL_Obj : (tableName == 'ddl_items' ? settingsDDL_ItemsObj : settingsDDL_REFObj));
    var strParams = "";
    for (var key in params) {
        if (key != 'items' && key != 'referencing' && params[key] !== null) {
            strParams += key + '=' + params[key] + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=' + tableName + '&' + strParams,
        success: function (response) {
            if (tableName == 'ddl') {
                settingsDDL_Obj.id = response.last_id;
                settingsDDLs.push(settingsDDL_Obj);
                settingsDDL_Obj = setAllNullObj(settingsDDL_hdr);
                //redraw table
                showSettingsDDLDataTable(settingsDDL_hdr, settingsDDLs, -1);
            } else {
                if (settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
                    settingsDDL_REFObj.id = response.last_id;
                    settingsDDLs[settingsDDL_selectedIndex].referencing.push(settingsDDL_REFObj);
                    settingsDDL_REFObj = setAllNullObj(settingsDDL_cdtns_headers);
                } else {
                    settingsDDL_ItemsObj.id = response.last_id;
                    settingsDDLs[settingsDDL_selectedIndex].items.push(settingsDDL_ItemsObj);
                    settingsDDL_ItemsObj = setAllNullObj(settingsDDL_items_hdr);
                }
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











/* ------------------------ Permissions / tab 'Settings' ----------------------------*/

var settingsRights,
    settingsRights_hdr,
    settingsRights_Fields_hdr,
    settingsRights_Obj,
    settingsRights_FieldsObj,
    settingsRights_selectedIndex = -1,
    settingsRights_TableMeta,
    settingsUsersNames;

function getRightsDatas(tableName) {
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/getRightsDatas?tableName=' + tableName,
        success: function(response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log('Settings/Rights', response);
            settingsRights = response.data;
            settingsRights_hdr = response.Rights_hdr;
            settingsRights_Fields_hdr = response.Rights_Fields_hdr;
            settingsRights_TableMeta = response.table_meta;
            settingsUsersNames = response.users_names;
            settingsRights_Obj = setAllNullObj(settingsRights_hdr);
            settingsRights_FieldsObj = setAllNullObj(settingsRights_Fields_hdr);
            showSettingsRightsDataTable(settingsRights_hdr, settingsRights, -1);
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    });
}

function showSettingsRightsDataTable(headers, data, idx) {
    var tableData = "", tbHiddenData = "", tbAddRow = "", key, d_key;
    var edit = true, view = true;

    if (idx > -1) {
        data = settingsRights[idx].fields;
        $('.settings_Rights_rows').css('background-color', '#FFF');
        $('#row_' + idx + '_settings_Rights').css('background-color', '#FFA');
        $('#add_settings_Rights_item_btn').show();
        settingsRights_selectedIndex = idx;
    }

    for(var i = 0; i < data.length; i++) {
        if (idx === -1) {
            var all = true;
            for(var j = 0; j < data[i].fields.length; j++) {
                if(data[i].fields[j].view == 0 || data[i].fields[j].edit == 0) {
                    all = false;
                    break;
                }
            }
            var check_btn = all ?
                "<button onclick='toggleAllrights("+i+", "+(data[i].user_id ? '"all"' : '"view"')+", false)'><i class='fa fa-close'></i></button>" :
                "<button onclick='toggleAllrights("+i+", "+(data[i].user_id ? '"all"' : '"view"')+", true)'><i class='fa fa-check'></i></button>";
        } else {
            if (data[i].view == 0) {
                view = false;
            }
            if (data[i].edit == 0) {
                edit = false;
            }
        }

        tableData += "<tr id='row_" + i + (idx == -1 ? '_settings_Rights' : '_settings_Fields_Rights') + "' class='settings_Rights_rows'>";
        tableData += '<td><a '+(idx == -1 ? 'onclick="showSettingsRightsDataTable(settingsRights_Fields_hdr, \'\', '+i+')"' : '')+' class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1) +'</b></a></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'fields') {
                tableData +=
                    '<td ' +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'table_id') {
                    tableData += settingsRights_TableMeta.name;
                } else
                if (idx == -1 && d_key === 'user_id') {
                    tableData += (settingsUsersNames[data[i][d_key]] ? settingsUsersNames[data[i][d_key]] : 'Visitor');
                } else
                if (idx != -1 && (d_key === 'view' || d_key === 'edit')) {
                    tableData += '<input ' +
                        'id="inp_' + d_key + i + '_settings_rights_field"' +
                        'type="checkbox" ' +
                        (d_key === 'edit' && !settingsRights[idx].user_id ? ' disabled ' : '') +
                        'onclick="updateSettingsRightsItem(\'' + d_key + '\', ' + i + ', \'inp_' + d_key + i + '_settings_rights_field\')" ' +
                        (data[i][d_key] ? 'checked>' : '>');
                } else {
                    tableData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "<td>" +
            (idx == -1 ? check_btn : "") +
            "<button onclick='deleteSettingsRights(\""+(idx == -1 ? 'permissions' : 'permissions_fields')+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button>" +
            "</td>";
        tableData += "</tr>";

        tbHiddenData += "<tr style='visibility: hidden;'>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'fields') {
                tbHiddenData += '<td style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'table_id') {
                    tbHiddenData += settingsRights_TableMeta.name;
                } else
                if (idx == -1 && d_key === 'user_id') {
                    tbHiddenData += (settingsUsersNames[data[i][d_key]] ? settingsUsersNames[data[i][d_key]] : 'Visitor');
                } else {
                    tbHiddenData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tbHiddenData += '</td>';
            }
        }
        tbHiddenData += "<td><button><i class='fa fa-trash-o'></i></button></td>";
        tbHiddenData += "</tr>";
    }

    if (idx > -1) {
        $('#tbSettingsRights_Fields_headers').html(tbHiddenData);
        $('#tbSettingsRights_Fields_data').html(tableData);

        $('.rights_fields_check_edit').html('<input type="checkbox" '+(edit ? 'checked' : '')+(!settingsRights[idx].user_id ? ' disabled ' : '')+' onclick="toggleAllrights('+settingsRights_selectedIndex+', \'edit\', '+(!edit ? true : false)+')">');
        $('.rights_fields_check_view').html('<input type="checkbox" '+(view ? 'checked' : '')+' onclick="toggleAllrights('+settingsRights_selectedIndex+', \'view\', '+(!view ? true : false)+')">');
    } else {
        $('#tbSettingsRights_headers').html(tbHiddenData);
        $('#tbSettingsRights_data').html(tableData);
    }

    if (settingsRights_selectedIndex > -1) {
        $('#row_' + settingsRights_selectedIndex + '_settings_Rights').css('background-color', '#FFA');
        if (idx === -1) {
            showSettingsRightsDataTable(settingsRights_Fields_hdr, '', settingsRights_selectedIndex);
        }
    }
}

function updateSettingsRightsItem(key, idx, id) {
    var val = $('#'+id).is(':checked') ? 1 : 0;

    settingsRights[settingsRights_selectedIndex].fields[idx][key] = val;

    idx = settingsRights[settingsRights_selectedIndex].fields[idx].id;

    showSettingsRightsDataTable(settingsRights_hdr, settingsRights, -1);

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateRightsDatas?id=' + idx + '&fieldname=' + key + '&val=' + val,
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

function deleteSettingsRights(tableName, rowId, idx) {
    if (tableName == 'permissions') {
        settingsRights.splice(idx, 1);
        settingsRights_selectedIndex = -1;
        showSettingsRightsDataTable(settingsRights_hdr, settingsRights, -1);
        $('#tbSettingsRights_Fields_data').html('');
    } else {
        settingsRights[settingsRights_selectedIndex].fields.splice(idx, 1);
        showSettingsRightsDataTable(settingsRights_Fields_hdr, settingsRights[settingsRights_selectedIndex].fields, settingsRights_selectedIndex);
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteRightsDatas?tableName=' + tableName + '&id=' + rowId,
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

function addSettingsRights() {
    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addRightsDatas?tableName=permissions&table_id=' + settingsRights_TableMeta.id + '&user_id=' + $('#selectUserSearch').val(),
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);

            getRightsDatas(selectedTableName);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function toggleAllrights(idx, type, status) {
    settingsRights_selectedIndex = idx;
    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/toggleAllrights?permissions_id=' + settingsRights[idx].id + '&r_status=' + (status ? 1 : 0)+ '&type=' + type,
        success: function (response) {
            $('.loadingFromServer').hide();
            alert(response.msg);

            getRightsDatas(selectedTableName);
        },
        error: function () {
            $('.loadingFromServer').hide();
            alert("Server error");
        }
    });
}

function settingsPermissionsTabShowColumns() {
    $('#settings_permissions_cols_tab').show();
    $('#settings_permissions_rows_tab').hide();
    $('#li_settings_permissions_cols_tab').addClass('active');
    $('#li_settings_permissions_rows_tab').removeClass('active');
}

function settingsPermissionsTabShowRows() {
    $('#settings_permissions_rows_tab').show();
    $('#settings_permissions_cols_tab').hide();
    $('#li_settings_permissions_rows_tab').addClass('active');
    $('#li_settings_permissions_cols_tab').removeClass('active');
}



















/* ------------------- Import tab ----------------------- */
var ddl_col_numbers = [],
    selected_import_reference_table = 0;

function import_show_type_group() {
    if ($('#import_type_group_check').is(':checked')) {
        $('#import_type_group').find('select').val('existing');
        $('#import_type_group').show();
        $('#import_exist_group').show();
    } else {
        $('#import_type_group').hide();
        $('#import_exist_group').hide();
        $('#import_new_group').hide();
    }
}

function import_changed_type_group() {
    if ($('#import_type_group').find('select').val() == 'existing') {
        $('#import_exist_group').show();
        $('#import_new_group').hide();
    } else {
        $('#import_exist_group').hide();
        $('#import_new_group').show();
    }
}

function sent_csv_to_backend(is_upload) {
    var data = new FormData();
    var data_csv = $('#import_data_csv').val();
    var file_link = $('#import_file_link').val();

    if (!is_upload && !data_csv) {
        //if no file for upload and file didn`t uploaded before - return
        return false;
    }

    if (is_upload) {
        $('.js-import_chb').each(function (i, elem) {
            $(elem).prop('disabled', false);
        });

        jQuery.each(jQuery('#import_csv')[0].files, function(i, file) {
            data.append('csv', file);
        });

        data.append('file_link', file_link);
    } else {
        data.append('data_csv', data_csv);
        data.append('filename', $('#import_table_name').val());
    }

    if($('#import_csv_c1').is(':checked')) { data.append('check_1', 'on'); }
    if($('#import_csv_c2').is(':checked')) { data.append('check_2', 'on'); }
    if($('#import_csv_c3').is(':checked')) { data.append('check_3', 'on'); }
    if($('#import_csv_c4').is(':checked')) { data.append('check_4', 'on'); }
    if($('#import_csv_c5').is(':checked')) { data.append('check_5', 'on'); }
    if($('#import_csv_c6').is(':checked')) { data.append('check_6', 'on'); }

    jQuery.ajax({
        url: baseHttpUrl+'/settingsForCreate',
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        success: function(resp) {
            $('#import_data_csv').val(resp.data_csv);
            if ($('#import_action_type').val() != '/modifyTable') {
                if ($('#import_action_type').val() == '/createTable') {
                    $('#import_table_name').val(resp.filename);
                    $('#import_table_db_tb').val(resp.filename);
                }

                var fieldlist = [];
                fieldlist.push({'name':'ID', 'field':'id', 'type':'Auto Number', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                $.each(resp.headers, function(i, hdr) {
                    fieldlist.push({'name':hdr.header, 'field':hdr.field, 'type':hdr.type, 'auto':0, 'size':hdr.size, 'default':hdr.default, 'required':hdr.required});
                });
                fieldlist.push({'name':'Created By', 'field':'createdBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Created On', 'field':'createdOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Modified By', 'field':'modifiedBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Modified On', 'field':'modifiedOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});

                var html = '', imp_type = $('#import_type_import').val();
                $.each(fieldlist, function(i, hdr) {
                    html += '<tr id="import_columns_'+i+'" '+(hdr.field == 'createdBy' ? 'class="js-import-col-createdBy"' : '')+'>'+
                        '<td><input type="text" class="form-control" name="columns['+i+'][header]" value="'+hdr.name+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                            '<input type="text" class="form-control" name="columns['+i+'][field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                            '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td class="js-import_column-orders" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
                            '<select class="form-control" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()" '+(hdr.auto ? 'readonly' : '')+'></select>' +
                        '</td>' +
                        '<td><select class="form-control" name="columns['+i+'][type]" '+(hdr.auto ? 'readonly' : '')+'>';
                    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
                        html += '<option '+(hdr.type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
                    }
                    html += '</select></td>' +
                        '<td><input type="number" class="form-control" name="columns['+i+'][size]" value="'+(hdr.size ? hdr.size : '')+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="text" class="form-control" name="columns['+i+'][default]" value="'+hdr.default+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="checkbox" class="form-control" name="columns['+i+'][required]" '+(hdr.required ? 'checked' : '')+' '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                            '<input type="hidden" id="import_columns_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
                            '<button type="button" class="btn btn-default" onclick="import_del_row('+i+')">&times;</button>' +
                        '</td>' +
                        '</tr>';
                });
                $('#import_table_body').html(html);
            }
            if (file_link) {
                import_show_col_tab();
            }

            if (!resp.error) {
                ddl_col_numbers = [];
                $.each(resp.headers, function(i, hdr) {
                    ddl_col_numbers.push(hdr.field);
                });
            }
        }
    });
}

function import_test_db_connect() {
    jQuery.ajax({
        url: baseHttpUrl+'/settingsForCreateMySQL',
        data: {
            'host': $('#import_mysql_host').val(),
            'user': $('#import_mysql_lgn').val(),
            'pass': $('#import_mysql_pwd').val(),
            'db': $('#import_mysql_db').val(),
            'table': $('#import_mysql_table').val(),
            'name_conn': $('#import_name_conn').val(),
            'save_conn': $('#import_save_conn').is(':checked') ? 1 : 0
        },
        method: 'GET',
        success: function(resp) {
            if (!resp.error && $('#import_action_type').val() != '/modifyTable') {
                if ($('#import_action_type').val() == '/createTable') {
                    $('#import_table_name').val(resp.filename);
                    $('#import_table_db_tb').val(resp.filename);
                }

                var fieldlist = [];
                fieldlist.push({'name':'ID', 'field':'id', 'type':'Auto Number', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                $.each(resp.headers, function(i, hdr) {
                    fieldlist.push({'name':hdr.header, 'field':hdr.field, 'type':hdr.type, 'auto':0, 'size':hdr.size, 'default':hdr.default, 'required':hdr.required});
                });
                fieldlist.push({'name':'Created By', 'field':'createdBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Created On', 'field':'createdOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Modified By', 'field':'modifiedBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                fieldlist.push({'name':'Modified On', 'field':'modifiedOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});

                var html = '', imp_type = $('#import_type_import').val();
                $.each(fieldlist, function(i, hdr) {
                    html += '<tr id="import_columns_'+i+'" '+(hdr.field == 'createdBy' ? 'class="js-import-col-createdBy"' : '')+'>'+
                        '<td><input type="text" class="form-control" name="columns['+i+'][header]" value="'+hdr.name+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                            '<input type="text" class="form-control" name="columns['+i+'][field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                            '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                        '</td>' +
                        '<td class="js-import_column-orders" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
                            '<select class="form-control" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()" '+(hdr.auto ? 'readonly' : '')+'></select>' +
                        '</td>' +
                        '<td><select class="form-control" name="columns['+i+'][type]" '+(hdr.auto ? 'readonly' : '')+'>';
                    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
                        html += '<option '+(hdr.type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
                    }
                    html += '</select></td>' +
                        '<td><input type="number" class="form-control" name="columns['+i+'][size]" value="'+(hdr.size ? hdr.size : '')+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="text" class="form-control" name="columns['+i+'][default]" value="'+hdr.default+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="checkbox" class="form-control" name="columns['+i+'][required]" '+(hdr.required ? 'checked' : '')+' '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                            '<input type="hidden" id="import_columns_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
                            '<button type="button" class="btn btn-default" onclick="import_del_row('+i+')">&times;</button>' +
                        '</td>' +
                        '</tr>';
                });
                $('#import_table_body').html(html);

                swal("Success!", "", "success");
            } else {
                if (resp.error) {
                    swal("Connection error!", "", "error");
                }
            }

            if (!resp.error) {
                ddl_col_numbers = [];
                $.each(resp.headers, function(i, hdr) {
                    ddl_col_numbers.push(hdr.field);
                });
                import_show_col_tab();
            }
        },
        error: function (e) {
            swal("Connection error!", "", "error");
        }
    });
}

function import_add_table_row() {
    var i = 0, html = '',
        imp_type = $('#import_type_import').val(),
        inputed_type = $('#import_columns_add_type').val(),
        option_col = '',
        inputed_col = $('#import_columns_add_col').val();

    $.each(ddl_col_numbers, function(i, hdr) {
        if (inputed_col == (i+1)) {
            option_col = '<option value="'+(i+1)+'">'+hdr+'</option>';
        }
    });

    i = Number( $('#import_row_count').val() );

    html = '<tr id="import_columns_'+i+'">'+
        '<td>' +
            '<input type="text" class="form-control" name="columns['+i+'][header]" value="'+$('#import_columns_add_header').val()+'">' +
        '</td>' +
        '<td>' +
            '<input type="text" class="form-control" id="import_columns_'+i+'_field_val" name="columns['+i+'][field]" value="'+$('#import_columns_add_field').val()+'">' +
            '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="">' +
        '</td>' +
        '<td class="js-import_column-orders import_not_reference_columns" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
            '<select class="form-control" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()">'+option_col+'</select>' +
        '</td>' +
        '<td><select class="form-control" name="columns['+i+'][type]">';
    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
        html += '<option '+(inputed_type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
    }
    html += '</select></td>' +
        '<td>' +
            '<input type="number" class="form-control" name="columns['+i+'][size]" value="'+$('#import_columns_add_size').val()+'">' +
        '</td>' +
        '<td class="import_not_reference_columns" '+(imp_type != 'ref' ? '' : 'style="display:none;"')+'>' +
            '<input type="text" class="form-control" name="columns['+i+'][default]" value="'+$('#import_columns_add_default').val()+'">' +
        '</td>' +
        '<td class="import_not_reference_columns" '+(imp_type != 'ref' ? '' : 'style="display:none;"')+'>' +
            '<input type="checkbox" class="form-control" name="columns['+i+'][required]" '+($('#import_columns_add_required').is(':checked') ? 'checked="checked"' : '')+'>' +
        '</td>' +
        '<td>' +
            '<input type="hidden" id="import_columns_ref_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
            '<button type="button" class="btn btn-default" onclick="import_del_row('+i+')">&times;</button>' +
        '</td>' +
        '</tr>';
    $('#import_columns_row_add').before(html);
    $('#import_row_count').val(i+1);
    
    $('.import_columns_add').val('');
    $('#import_table_ref_col_body').html('');
    $('.import_row_colors').css('background-color', '#FFF');
}

function import_add_ref_table_row() {
    var i = $importReferences.length, html = '',
        inputed_tb = $('#import_columns_ref_table_add').val();

    if (!inputed_tb) {
        return;
    }

    html = '<tr id="import_columns_ref_tab_'+i+'" class="import_row_colors">'+
        '<td>' +
            '<a onclick="show_import_ref_columns('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+(i+1)+'</b></a>' +
        '</td>' +
        '<td><select id="import_columns_ref_table_'+i+'" class="form-control" disabled">';
    for (var jdx = 0; jdx < tablesDropDown.length; jdx++) {
        html += '<option '+(inputed_tb == tablesDropDown[jdx].db_tb ? 'selected="selected"' : '')+'>'+tablesDropDown[jdx].name+'</option>';
    }
    html += '</select></td>' +
        '<td>' +
            '<button type="button" class="btn btn-default" onclick="import_del_row_ref('+i+')">&times;</button> | ' +
            '<button type="button" class="btn btn-default" onclick="partially_import_ref_table(\''+inputed_tb+'\',0)"><span class="fa fa-arrow-right"></span></button>' +
        '</td>' +
        '</tr>';
    $('#import_columns_ref_table_add_row').before(html);

    $('#import_columns_ref_table_add').val('');


    $importReferences.push({
        tb_id: table_meta.id,
        ref_tb: inputed_tb,
        items: {}
    });
}

function show_import_ref_columns(idx) {
    var len = Number( $('#import_table_body > tr').length ), html = '', fld, found_field;

    for (var i = 0; i< len; i++) {
        found_field = false;
        fld = $('#import_columns_'+i+'_field_val').val();
        if (!$('#import_columns_'+i+'_field_val').is(':visible') || $.inArray(fld, ['id','refer_tb_id','createdBy','createdOn','modifiedBy','modifiedOn']) > -1) {
            continue;
        }

        html += '<tr id="import_columns_ref_col_'+i+'" style="height: 35px;">' +
            '<td>' +
            '<select id="import_columns_ref_field_'+i+'" data-idx="'+i+'" class="form-control" onchange="save_import_references_field(this, '+idx+', \''+fld+'\')">';
        for (var t in tablesDropDown) {
            if ($importReferences[idx].ref_tb == tablesDropDown[t].db_tb) {
                html += '<option></option>';
                for (var tb in tablesDropDown[t].items) {
                    if (tablesDropDown[t].items[tb].field == $importReferences[idx].items[fld]) {
                        found_field = tablesDropDown[t].items[tb];
                    }
                    html += '<option ' +
                        (tablesDropDown[t].items[tb].field == $importReferences[idx].items[fld] ? ' selected="true" ' : ' ') +
                        ' value="'+tablesDropDown[t].items[tb].field+'">' +
                            tablesDropDown[t].items[tb].name +
                        '</option>';
                }
            }
        }
        html += '</select></td>' +
            '<td><input id="import_columns_ref_type_'+i+'" disabled class="form-control" type="text" value="'+(found_field ? found_field.type : '')+'"></td>' +
            '<td><input id="import_columns_ref_maxlen_'+i+'" disabled class="form-control" type="text" value="'+(found_field ? found_field.maxlen : '')+'"></td>' +
            '</tr>';
    }
    $('#import_table_ref_col_body').html(html);
    $('.import_row_colors').css('background-color', '#FFF');
    $('#import_columns_ref_tab_' + idx).css('background-color', '#FFA');
}

function save_import_references_field (elem, idx, fld) {
    $importReferences[idx].items[fld] = $(elem).val();

    var found_field = false, data_idx = $(elem).data('idx');
    for (var t in tablesDropDown) {
        if ($importReferences[idx].ref_tb == tablesDropDown[t].db_tb) {
            for (var tb in tablesDropDown[t].items) {
                if (tablesDropDown[t].items[tb].field == $importReferences[idx].items[fld]) {
                    found_field = tablesDropDown[t].items[tb];
                }
            }
        }
    }
    $('#import_columns_ref_type_'+data_idx).val( found_field ? found_field.type : ''  );
    $('#import_columns_ref_maxlen_'+data_idx).val( found_field ? found_field.maxlen : '' );
}

function import_del_row(idx) {
    swal({
        title: "Delete field",
        text: 'Confirm to delete a field in the table? Deleting a field can’t be recovered!',
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true
    },
    function ($confirmed) {
        if ($confirmed) {
            $('#import_columns_'+idx).hide();
            $('#import_columns_deleted_'+idx).val('del');
            if ($('#import_type_import').val() == 'ref' && $importReferences) {
                var del_field = $('#import_columns_'+idx+'_field_val').val();
                console.log(del_field, $importReferences);
                for (var i in $importReferences) {
                    for (var j in $importReferences[i].items) {
                        if (j == del_field) {
                            delete $importReferences[i].items[j];
                        }
                    }
                }
                $('#import_columns_ref_tab_'+idx).hide();
                $('#import_table_ref_col_body').html('');
                $('.import_row_colors').css('background-color', '#FFF');
                partially_import_ref_table($importReferences[0].ref_tb, 0);
            }
        }
    });
}

function import_del_row_ref(idx) {
    swal({
        title: "Delete field",
        text: 'Confirm to delete a field in the table? Deleting a field can’t be recovered!',
        type: "warning",
        showCancelButton: true,
        closeOnConfirm: true
    },
    function ($confirmed) {
        if ($confirmed) {
            partially_import_ref_table($importReferences[idx].ref_tb,1);
            $importReferences.splice(idx, 1);
            $('#import_columns_ref_tab_'+idx).hide();
            $('#import_table_ref_col_body').html('');
            $('.import_row_colors').css('background-color', '#FFF');
        }
    });
}

function import_show_csv_tab() {
    $('#import_li_csv_tab').addClass('active');
    $('#import_li_col_tab').removeClass('active');
    $('#import_csv_tab').show();
    $('#import_col_tab').hide();
}

function import_show_col_tab() {
    $('#import_li_col_tab').addClass('active');
    $('#import_li_csv_tab').removeClass('active');
    $('#import_col_tab').show();
    $('#import_csv_tab').hide();
}

function changeImportStyle(sel) {
    var style = $(sel).val() || (table_meta.source == 'ref' ? 'ref' : 'scratch'),
        action = $('#import_action_type').val();
    if (style == 'scratch') {
        $('.js-import_mysql_style').hide();
        $('.js-import_csv_style').hide();
        $('#import_action_type').hide();
        $('.import_not_reference_columns').show();
        $('.import_reference_columns').hide();
        $('#import_main_columns').css('width', '100%');
        $('.js-import_column-orders').hide();
        $('#import_form_save_btn').show();
        import_show_col_tab();
    } else
    if (style == 'csv') {
        $('.js-import_mysql_style').hide();
        $('#import_action_type').show();
        $('.js-import_csv_style').show();
        $('.import_not_reference_columns').show();
        $('.import_reference_columns').hide();
        $('#import_main_columns').css('width', '100%');
        $('.js-import_column-orders').show();
        $('#import_form_save_btn').show();
    } else
    if (style == 'mysql') {
        $('.js-import_csv_style').hide();
        $('#import_action_type').show();
        $('.js-import_mysql_style').show();
        $('.import_not_reference_columns').show();
        $('.import_reference_columns').hide();
        $('#import_main_columns').css('width', '100%');
        $('.js-import_column-orders').show();
        $('#import_form_save_btn').show();
    } else
    if (style == 'remote') {
        $('.js-import_csv_style').hide();
        $('#import_action_type').hide();
        $('.js-import_mysql_style').show();
        $('.import_not_reference_columns').show();
        $('.import_reference_columns').hide();
        $('#import_main_columns').css('width', '100%');
        $('.js-import_column-orders').hide();
        $('#import_form_save_btn').show();
    } else
    if (style == 'ref') {
        $('.js-import_csv_style').hide();
        $('#import_action_type').hide();
        $('.js-import_mysql_style').hide();
        $('.import_reference_columns').show();
        $('.import_not_reference_columns').hide();
        $('#import_main_columns').css('width', '45%');
        $('.js-import_column-orders').hide();
        $('#import_form_save_btn').hide();
        import_show_col_tab();
    }

    var key = getConnNoteKey(style, action);
    $('#import_method_notes').val( table_meta.conn_notes && table_meta.conn_notes[key] ? table_meta.conn_notes[key] : '' );
}

function changeImportAction (sel) {
    var action = $(sel).val(),
        type = $('#import_type_import').val(),
        status = (action == '/modifyTable' ? true : false);
    $('.js-import_chb').each(function (i, elem) {
        $(elem).prop('disabled', status);
    });

    var key = getConnNoteKey(type, action);
    $('#import_method_notes').val( table_meta.conn_notes && table_meta.conn_notes[key] ? table_meta.conn_notes[key] : '' );
}

function getConnNoteKey (type, action) {
    var res = type;
    if (type == 'csv' || type == 'mysql') {
        if (action == '/createTable') {
            res += '_create';
        } else
        if (action == '/replaceTable') {
        res += '_replace';
        } else
        if (action == '/modifyTable') {
        res += '_modify';
        }
    }
    return res;
}

var import_method_notes_typing;
function import_method_notes_changed () {
    var action = $('#import_action_type').val(),
        type = $('#import_type_import').val(),
        key = getConnNoteKey(type, action);
    if (!table_meta.conn_notes) table_meta.conn_notes = {};
    table_meta.conn_notes[key] = $('#import_method_notes').val();

    clearTimeout(import_method_notes_typing);
    import_method_notes_typing = setTimeout(function() {
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/updateTableRow?tableName=tb&id=' + table_meta.id + '&conn_notes=' + JSON.stringify(table_meta.conn_notes)
        });
    }, 500);
}

function select_import_connection () {
    var idx = $('#import_saved_conn').val();
    if (idx >= 0) {
        $('#import_name_conn').val( importConnections[idx].name );
        $('#import_mysql_host').val( importConnections[idx].server );
        $('#import_mysql_lgn').val( importConnections[idx].user );
        $('#import_mysql_pwd').val( importConnections[idx].pwd );
        $('#import_mysql_db').val( importConnections[idx].db );
        $('#import_mysql_table').val( importConnections[idx].table );
    }
}

function import_form_submit () {
    var action, type = $('#import_type_import').val();
    if (type == 'scratch') {
        action = baseHttpUrl + '/modifyTable';
    } else
    if (type == 'csv' || type == 'mysql') {
        action = baseHttpUrl + $('#import_action_type').val();
    } else
    if (type == 'remote') {
        action = baseHttpUrl + '/remoteTable';
    } else
    if (type == 'ref') {
        action = baseHttpUrl + '/refTable';
    }
    $('#import_form').prop('action', action);
}

/*function import_ref_table_changed(row_idx) {
    var table_name = $('#import_columns_ref_table_'+row_idx).val(),
        html = '';

    for (var i in tablesDropDown) {
        if (tablesDropDown[i].db_tb == table_name) {
            for (var j in tablesDropDown[i].items) {
                html += '<option value="'+tablesDropDown[i].items[j].field+'">'+tablesDropDown[i].items[j].name+'</option>';
            }
            break;
        }
    }

    $('#import_columns_ref_field_'+row_idx).html(html);
}*/

function show_import_cols_numbers() {
    var evt = event || window.event;
    var imp_type = $('#import_type_import').val(), html = '<option value=""></option>';
    if (imp_type == 'csv' || imp_type == 'mysql') {
        $.each(ddl_col_numbers, function(i, hdr) {
            html += '<option value="'+(i+1)+'">'+hdr+'</option>';
        });
    }
    $(evt.target).html(html);
}

function partially_import_ref_table($ref_tb, $to_del) {
    if ($ref_tb) {
        $('#import_tb_rfcn').val( JSON.stringify($importReferences) );
        $('#import_target_db').val($ref_tb);
        $('#import_target_db_should_del').val($to_del);
        jQuery.ajax({
            url: baseHttpUrl + '/refTable',
            data: $('#import_form').serializeArray(),
            method: 'POST',
            success: function() {
                changePage(0);
                swal("Success!", "", "success");
            },
            error: function (e) {
                swal("Connection error!", "", "error");
            }
        });
        $('#import_target_db').val(0);
        $('#import_target_db_should_del').val(0);
    } else {
        swal("Warning!", "You should select reference table and field", "warning");
    }
}




















/* ------------------- Additional Functions ----------------------- */

$(document).ready(function () {
    $('#pswd_target_input').keyup(function() {
        var pswd = $(this).val();

        //validate the length
        if ( pswd.length < 6 ) {
            $('#pswd_length').removeClass('valid-i').addClass('invalid-i');
        } else {
            $('#pswd_length').removeClass('invalid-i').addClass('valid-i');
        }

        //validate letter
        if ( pswd.match(/[A-z]/) ) {
            $('#pswd_letter').removeClass('invalid-i').addClass('valid-i');
        } else {
            $('#pswd_letter').removeClass('valid-i').addClass('invalid-i');
        }

        //validate capital letter
        if ( pswd.match(/[A-Z]/) ) {
            $('#pswd_capital').removeClass('invalid-i').addClass('valid-i');
        } else {
            $('#pswd_capital').removeClass('valid-i').addClass('invalid-i');
        }

        //validate number
        if ( pswd.match(/\d/) ) {
            $('#pswd_number').removeClass('invalid-i').addClass('valid-i');
        } else {
            $('#pswd_number').removeClass('valid-i').addClass('invalid-i');
        }

        //validate special character
        if ( pswd.match(/[!$#%@]/) ) {
            $('#pswd_special').removeClass('invalid-i').addClass('valid-i');
        } else {
            $('#pswd_special').removeClass('valid-i').addClass('invalid-i');
        }
    }).focus(function() {
        $('#pswd_info').show();
    }).blur(function() {
        $('#pswd_info').hide();
    });
});

function jsTreeBuild($tab) {
    var context_menu =
        !authUser || ($tab == 'public' && !isAdmin)
        ?
            {}
        :
            {
                "plugins": ["contextmenu", "dnd"],
                "contextmenu": {
                    "items": function ($node) {
                        var type = $node.data ? $node.data.type : $node.li_attr['data-type'];
                        var menu = {};
                        console.log($node);
                        if (type == 'folder') {
                            if ($tab == 'private') {
                                menu.add_table = {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Add Table",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        var menutree_id = elem.data ? elem.data.menu_id : elem.li_attr['data-menu_id'];
                                        $('#sidebar_table_tab').val($tab);
                                        $('#sidebar_table_action').val('add');
                                        $('#sidebar_table_name').val('');
                                        $('#sidebar_table_id').val(0);
                                        $('#sidebar_table_db').prop('disabled', false).val('');
                                        $('#sidebar_table_nbr').val(100);
                                        $('#sidebar_menutree_id').val(menutree_id);

                                        $('.editSidebarTableForm').show(); //function popup_sidebar_table()
                                    }
                                };
                            }
                            menu.add = {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "Add Folder",
                                "action": function (obj) {
                                    var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                    var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                    var par_id = elem.data ? elem.data.menu_id : elem.li_attr['data-menu_id'];
                                    swal({
                                            title: "New folder",
                                            text: "Write folder name:",
                                            type: "input",
                                            showCancelButton: true,
                                            closeOnConfirm: true,
                                            animation: "slide-from-top",
                                            inputPlaceholder: "Folder name"
                                        },
                                        function (inputValu) {
                                            if (inputValu === false) return false;

                                            if (inputValu === "") {
                                                swal.showInputError("You need to write something!");
                                                return false
                                            }

                                            $.ajax({
                                                url: baseHttpUrl+'/menutree_addfolder?parent_id='+par_id+'&from_tab='+$tab+'&text='+inputValu,
                                                method: 'GET',
                                                success: function (resp) {
                                                    var parent = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                                    var newNode = {
                                                        text: inputValu,
                                                        li_attr: {
                                                            'data-type':'folder',
                                                            'data-menu_id':resp.last_id,
                                                        }
                                                    };

                                                    $('#tablebar_'+$tab+'_div').jstree().create_node(parent, newNode, 'last', false, false);
                                                }
                                            });
                                        }
                                    );
                                }
                            };
                            menu.edit = {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "Edit",
                                "action": function (obj) {
                                    var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                    var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                    var par_id = elem.data ? elem.data.menu_id : elem.li_attr['data-menu_id'];
                                    var input_text = $('#tablebar_'+$tab+'_div').jstree('get_selected', true)[0].text;
                                    swal({
                                            title: "Change name",
                                            text: "Write folder name:",
                                            type: "input",
                                            showCancelButton: true,
                                            closeOnConfirm: true,
                                            animation: "slide-from-top",
                                            inputPlaceholder: "Folder name",
                                            inputValue: input_text
                                        },
                                        function (inputValu) {
                                            if (inputValu === false) return false;

                                            if (inputValu === "") {
                                                swal.showInputError("You need to write something!");
                                                return false
                                            }

                                            $.ajax({
                                                url: baseHttpUrl+'/menutree_renamefolder?folder_id='+par_id+'&text='+inputValu,
                                                method: 'GET',
                                                success: function (resp) {
                                                    $('#tablebar_'+$tab+'_div').jstree('rename_node', elem_id, inputValu);
                                                }
                                            });
                                        }
                                    );
                                }
                            };
                            menu.remove = {
                                "separator_before": false,
                                "separator_after": false,
                                "label": "Remove",
                                "action": function (obj) {
                                    var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                    var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                    var par_id = elem.data ? elem.data.menu_id : elem.li_attr['data-menu_id'];
                                    if ( $('#tablebar_'+$tab+'_div').jstree('is_parent', elem_id) ) {
                                        swal('Error', 'You cannot remove folder with children', 'error');
                                    } else {
                                        swal({
                                                title: "Delete folder",
                                                text: "Are you sure?",
                                                type: "warning",
                                                confirmButtonClass: "btn-danger",
                                                confirmButtonText: "Yes, delete it!",
                                                showCancelButton: true,
                                                closeOnConfirm: true,
                                                animation: "slide-from-top"
                                            },
                                            function () {
                                                $.ajax({
                                                    url: baseHttpUrl+'/menutree_deletefolder?folder_id='+par_id,
                                                    method: 'GET',
                                                    success: function (resp) {
                                                        $('#tablebar_'+$tab+'_div').jstree().delete_node(elem_id);
                                                    }
                                                });
                                            }
                                        );
                                    }
                                }
                            };
                        }
                        if (type == 'table' && $tab == 'private') {
                            menu = {
                                "edit": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Edit",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        var table_name = $('#tablebar_'+$tab+'_div').jstree('get_selected', true)[0].text;

                                        $('#sidebar_table_tab').val($tab);
                                        $('#sidebar_table_action').val('edit');
                                        $('#sidebar_table_name').val(table_name);
                                        $('#sidebar_table_id').val( elem.data ? elem.data.tb_id : elem.li_attr['data-tb_id'] );
                                        $('#sidebar_table_db').prop('disabled', true).val( elem.data ? elem.data.tb_db : elem.li_attr['data-tb_db'] );
                                        $('#sidebar_table_nbr').val( elem.data ? elem.data.tb_nbr : elem.li_attr['data-tb_nbr'] );
                                        $('#sidebar_table_notes').val( elem.data ? elem.data.tb_notes : elem.li_attr['data-tb_notes'] );

                                        $('.editSidebarTableForm').show(); //function popup_sidebar_table()
                                    }
                                },
                                "link": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Create link",
                                    "action": function (obj) {
                                        sidebarPrevSelected = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        sidebarPrevSelected = $('#tablebar_'+$tab+'_div').jstree('get_node', sidebarPrevSelected);
                                        sidebarPrevSelected.action = 'link';
                                        sidebarPrevSelected.fromtab = $tab;
                                        swal('Create link', 'Please select target folder.');
                                    }
                                },
                                "remove": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Remove",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        var table_db = elem.data ? elem.data.tb_db : elem.li_attr['data-tb_db'];
                                        swal({
                                            title: "Are you sure?",
                                            text: "This action will permanently remove/delete all data associated to selected data/table!",
                                            type: "warning",
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
                                                    table_name: table_db
                                                },
                                                success: function (response) {
                                                    if (table_db == selectedTableName) {
                                                        window.location = '/data/';
                                                    } else {
                                                        $('#tablebar_'+$tab+'_div').jstree().delete_node(elem_id);
                                                    }
                                                },
                                                error: function () {
                                                    alert("Server error");
                                                }
                                            })
                                        });
                                    }
                                }
                            }
                        }
                        if (type == 'link') {
                            menu = {
                                "remove": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Remove",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        var elem_m2t_id = elem.data ? elem.data.m2t_id : elem.li_attr['data-m2t_id'];
                                        swal({
                                                title: "Delete link",
                                                text: "Are you sure?",
                                                type: "warning",
                                                confirmButtonClass: "btn-danger",
                                                confirmButtonText: "Yes, delete it!",
                                                showCancelButton: true,
                                                closeOnConfirm: true,
                                                animation: "slide-from-top"
                                            },
                                            function () {
                                                $.ajax({
                                                    url: baseHttpUrl+'/menutree_removelink?m2t_id='+elem_m2t_id,
                                                    method: 'GET',
                                                    success: function (resp) {
                                                        $('#tablebar_'+$tab+'_div').jstree().delete_node(elem_id);
                                                    }
                                                });
                                            }
                                        );
                                    }
                                }
                            }
                        }
                        return menu;
                    }
                },
                "core": {
                    check_callback : function(operation, node, node_parent, node_position, more) {
                        if (operation === "move_node") {
                            var type = node_parent.data ? node_parent.data.type : false;
                                type = node_parent.li_attr ? node_parent.li_attr['data-type'] : false;
                            if (type !== "folder") {
                                return false;
                            }
                        }
                        return true; //allow all other operations
                    }
                }
            }
        ;

    $('#tablebar_'+$tab+'_div').jstree(context_menu)
    .on("select_node.jstree", function (e, data) {
        //only for left click
        var evt =  window.event || event;
        var button = evt.which || evt.button;
        if( button != 1 && ( typeof button != "undefined")) return false;
        //

        if (sidebarPrevSelected) {
            var target = data.instance.get_node(data.node);
            var target_type = target.data ? target.data.type : target.li_attr['data-type'];
            var target_id = target.data ? target.data.menu_id : target.li_attr['data-menu_id'];

            if (target_type != 'folder') {
                swal('Error', 'You should select folder', 'error');
            } else {

                var m2t_id = sidebarPrevSelected.data ? sidebarPrevSelected.data.m2t_id : sidebarPrevSelected.li_attr['data-m2t_id'];
                //create link for table
                if (sidebarPrevSelected.action == 'link') {
                    var tb_id = sidebarPrevSelected.data ? sidebarPrevSelected.data.tb_id : sidebarPrevSelected.li_attr['data-tb_id'];
                    $.ajax({
                        url: baseHttpUrl+'/menutree_createlink?tb_id='+tb_id+'&menutree_id='+target_id+'&tab='+$tab,
                        method: 'GET',
                        success: function (resp) {
                            var newNode = {
                                text: sidebarPrevSelected.text,
                                icon: "fa fa-link",
                                li_attr: {
                                    'data-type': 'link',
                                    'data-m2t_id': resp.last_id,
                                    'data-tb_id': tb_id,
                                    'data-href': sidebarPrevSelected.data ? sidebarPrevSelected.data.href : sidebarPrevSelected.li_attr['data-href']
                                }
                            };

                            $('#tablebar_'+$tab+'_div').jstree().create_node(target, newNode, 'last', false, false);
                            $('#tablebar_'+$tab+'_div').jstree().open_node(target, false, false);
                            sidebarPrevSelected = '';
                        }
                    });
                } else {
                    sidebarPrevSelected = '';
                }
            }
        } else {
            var node = data.instance.get_node(data.node);
            var path = node.data ? node.data.href : node.li_attr['data-href'];
            location.href = path ? path : '/data/';
        }
    })
    .on('ready.jstree', function() {
        //$("#tablebar_"+$tab+"_div").jstree('open_all');
    })
    .on('open_node.jstree', function(e, data) {
        var m2t_id = data.node.data ? data.node.data.menu_id : data.node.li_attr['data-menu_id'];
        $.ajax({
            url: baseHttpUrl + '/updateTableRow?tableName=menutree&id='+m2t_id+'&state=1',
            method: 'get'
        });
        var icon = $('#' + data.node.id).find('i.jstree-icon.jstree-themeicon').first();
        icon.removeClass('fa-folder').addClass('fa-folder-open');
    })
    .on('close_node.jstree', function(e, data) {
        var m2t_id = data.node.data ? data.node.data.menu_id : data.node.li_attr['data-menu_id'];
        $.ajax({
            url: baseHttpUrl + '/updateTableRow?tableName=menutree&id='+m2t_id+'&state=0',
            method: 'get'
        });
        var icon = $('#' + data.node.id).find('i.jstree-icon.jstree-themeicon').first();
        icon.removeClass('fa-folder-open').addClass('fa-folder');
    })
    .on("move_node.jstree", function (e, data) {
        var target = data.instance.get_node(data.parent);
        var target_id = target.data ? target.data.menu_id : target.li_attr['data-menu_id'];
        var type = data.node.data ? data.node.data.type : data.node.li_attr['data-type'];
        if (type === 'folder') {
            var m2t_id = data.node.data ? data.node.data.menu_id : data.node.li_attr['data-menu_id'];
            var tb_id = 0;
        } else {
            var m2t_id = data.node.data ? data.node.data.m2t_id : data.node.li_attr['data-m2t_id'];
            var tb_id = data.node.data ? data.node.data.tb_id : data.node.li_attr['data-tb_id'];
        }

        $.ajax({
            url: baseHttpUrl+'/menutree_movenode?m2t_id='+m2t_id+'&menutree_id='+target_id+'&type='+type+'&tab='+$tab+'&tb_id='+tb_id,
            method: 'GET',
            success: function (resp) {
                $('#tablebar_'+$tab+'_div').jstree().open_node(target, false, false);
                sidebarPrevSelected = '';
            }
        });
    });

    //menu on blanc place
    $('#tablebar_'+$tab+'_div').on('contextmenu', function (evt) {
        if ($tab == 'public' && !isAdmin) {
            return;
        }

        if (evt.target.nodeName != 'I' && evt.target.nodeName != 'A') {
            var menu = '<ul id="cxtMenu_tablebar" class="vakata-context jstree-contextmenu jstree-default-contextmenu" style="left: '+(evt.pageX - 10)+'px; top: '+(evt.pageY - 10)+'px; display: block;">';
            if ($tab == 'private') {
                menu += '<li class="js-cxtMenu_add_table"><a href="#" rel="0"><i></i><span class="vakata-contextmenu-sep">&nbsp;</span>Add Table</a></li>';
            }
            menu += '<li class="js-cxtMenu_add_folder"><a href="#" rel="0"><i></i><span class="vakata-contextmenu-sep">&nbsp;</span>Add Folder</a></li>'+
                '</ul>';

            $('#ctxMenu_tablebar').html(menu);

            $('.js-cxtMenu_add_folder').on('click', function () {
                swal({
                        title: "New folder",
                        text: "Write folder name:",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: true,
                        animation: "slide-from-top",
                        inputPlaceholder: "Folder name"
                    },
                    function (inputValu) {
                        if (inputValu === false) return false;

                        if (inputValu === "") {
                            swal.showInputError("You need to write something!");
                            return false
                        }

                        $.ajax({
                            url: baseHttpUrl+'/menutree_addfolder?parent_id=0&from_tab='+$tab+'&text='+inputValu,
                            method: 'GET',
                            success: function (resp) {
                                var newNode = {
                                    text: inputValu,
                                    li_attr: {
                                        'data-type':'folder',
                                        'data-menu_id':resp.last_id,
                                    }
                                };

                                $('#tablebar_'+$tab+'_div').jstree().create_node('#', newNode, 'last', false, false);
                            }
                        });
                    }
                );
            });
            if ($tab == 'private') {
                $('.js-cxtMenu_add_table').on('click', function () {
                    $('#sidebar_table_tab').val($tab);
                    $('#sidebar_table_action').val('add');
                    $('#sidebar_table_name').val('');
                    $('#sidebar_table_id').val(0);
                    $('#sidebar_table_db').prop('disabled', false).val('');
                    $('#sidebar_table_nbr').val(100);
                    $('#sidebar_table_notes').val('');
                    $('#sidebar_menutree_id').val(0);

                    $('.editSidebarTableForm').show(); //function popup_sidebar_table()
                });
            }
        }
        return false;
    });
    $(document).on('click', function () {
        $('#ctxMenu_tablebar').html('');
    });
}

function popup_sidebar_table() {
    var $tab = $('#sidebar_table_tab').val(),
        tb_id = $('#sidebar_table_id').val(),
        tb_name = $('#sidebar_table_name').val(),
        tb_db = $('#sidebar_table_db').val(),
        tb_nbr = $('#sidebar_table_nbr').val(),
        tb_notes = $('#sidebar_table_notes').val(),
        menutree_id = $('#sidebar_menutree_id').val(),
        action = $('#sidebar_table_action').val(),
        strParamsEdit = "tableName=tb&id="+tb_id+"&name="+tb_name+"&nbr_entry_listing="+tb_nbr+"&notes="+tb_notes;

    if (action == 'add') {
        $.ajax({
            method: 'POST',
            url: baseHttpUrl + '/createTableFromMenu',
            data: {
                'db_tb': tb_db,
                'table_name': tb_name,
                'nbr_entry_listing': tb_nbr,
                'notes': tb_notes,
                'menutree_id': menutree_id
            },
            success: function (response) {
                if (response.error) {
                    swal(response.msg);
                } else {
                    window.location = response.msg;
                }
            },
            error: function () {
                alert("Server error");
            }
        });
    }
    if (action == 'edit') {
        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/updateTableRow?' + strParamsEdit,
            success: function (response) {
                var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');

                $('#tablebar_'+$tab+'_div').jstree('rename_node', elem_id, tb_name);
                $('#'+elem_id).data('tb_nbr', tb_nbr);
                $('#'+elem_id).data('tb_notes', tb_notes);

                alert(response.msg);
            },
            error: function () {
                alert("Server error");
            }
        });
    }
}

//auto logout after 30min idle
var timer1;
document.onkeypress = resetTimer;
document.onmousemove = resetTimer;
function resetTimer()
{
    clearTimeout(timer1);
    // waiting time in minutes
    var wait = 30;

    timer1 = setTimeout(function () {
        window.location = '/logout';
    }, 60000*wait);
}
