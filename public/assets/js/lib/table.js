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

    $('#tableChanger').val( (selectedTableGroup ? selectedTableGroup+"/" : "all/") + selectedTableName );

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
            var left = document.getElementById('div_for_horizontal_scroll');
            left.scrollLeft -= 40;
        }
        if (e.keyCode == 39) {
            var left = document.getElementById('div_for_horizontal_scroll');
            left.scrollLeft += 40;
        }
    });
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

var curFilter = "",
    arrAddFieldsInData = ['is_favorited'],
    selectedForChangeOrder = -1;

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
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key, d_key, tbDataHeaders = "", visibleColumns = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries, star_class;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        tableData += '<td '+(i === 0 ? 'id="first_data_td"' : '')+'>' +
            '<a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(selectedPage*lselectedEntries)) +'</b></a>' +
            '</td>';

        //second column ("star")
        if (authUser) {
            tableData += '<td><a href="javascript:void(0)" onclick="toggleFavoriteRow('+i+',this)">' +
                '<i class="fa '+(data[i].is_favorited ? 'fa-star' : 'fa-star-o')+'" style="font-size: 1.5em;color: #FD0;"></i>' +
                '</a></td>';
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
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">';
                if (d_key === 'ddl_id') {
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
                        'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') +
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
        tbHiddenData += '<td><i class="fa fa-star-o" style="font-size: 1.5em;color: #FD0;"></i></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') +
                    (headers[key].min_wth > 0 ? 'min-width: '+headers[key].min_wth+'px;' : '') +
                    (headers[key].max_wth > 0 ? 'max-width: '+headers[key].max_wth+'px;' : '') + '">';
                if (d_key === 'ddl_id') {
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
    tbDataHeaders += "<tr><th class='sorting nowrap'><b>#</b></th>";
    tbDataHeaders += "<th class='sorting nowrap'><b>Favorite</b></th>";
    for(var $hdr in headers) {
        tbDataHeaders += '<th ' +
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
    $('#tbData_body').html(tableData);

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

    //add drag listeners for table headers
    if (authUser) {
        var cols = document.querySelectorAll('#tbHeaders_header th[draggable="true"]');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDrop, false);
            col.addEventListener('dragend', handleDragEnd, false);
        });
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

        $('#tbFavouriteHeaders th[data-key="'+fieldKey+'"], #tbFavouriteHeaders td[data-key="'+fieldKey+'"]').hide();
        $('#tbFavouriteData th[data-key="'+fieldKey+'"], #tbFavouriteData td[data-key="'+fieldKey+'"]').hide();
    } else {
        $('#tbAddRow th[data-key="'+fieldKey+'"], #tbAddRow td[data-key="'+fieldKey+'"]').show();
        $('#tbHeaders th[data-key="'+fieldKey+'"], #tbHeaders td[data-key="'+fieldKey+'"]').show();
        $('#tbData th[data-key="'+fieldKey+'"], #tbData td[data-key="'+fieldKey+'"]').show();

        $('#tbFavouriteHeaders th[data-key="'+fieldKey+'"], #tbFavouriteHeaders td[data-key="'+fieldKey+'"]').show();
        $('#tbFavouriteData th[data-key="'+fieldKey+'"], #tbFavouriteData td[data-key="'+fieldKey+'"]').show();
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

function toggleFavoriteRow(idx, elem) {
    if (authUser) {
        var i = $(elem).find('i');
        if ($(i).hasClass('fa-star')) {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favouriteToggleRow?tableName=' + selectedTableName + '&row_id=' + tableData[idx].id + '&status=Inactive'
            });
            $(i).removeClass('fa-star').addClass('fa-star-o');
        } else {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/favouriteToggleRow?tableName=' + selectedTableName + '&row_id=' + tableData[idx].id + '&status=Active'
            });
            $(i).removeClass('fa-star-o').addClass('fa-star');
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
    selectedForChangeOrder = this.dataset.order;
    this.style.opacity = '0.6';
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    return false;
}

function handleDragEnter(e) {
    this.classList.add('over');
}

function handleDragLeave(e) {
    this.classList.remove('over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = this.dataset.order;
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

    return false;
}

function handleDragEnd(e) {
    var cols = document.querySelectorAll('#tbHeaders_header th[draggable="true"]');
    this.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}
/* ------------------- end change columns order for main table via drag/drop -----------*/

function showMap() {
    $("#li_list_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_map_view").addClass("active");
    $("#list_view").hide();
    $("#favorite_view").hide();
    $("#settings_view").hide();
    $("#map_view").show();
    initMap();
    $('.showhidemenu').hide();
    $('#showHideColumnsList').hide();
}

function showList() {
    $("#li_list_view").addClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#list_view").show();
    $("#favorite_view").hide();
    $("#map_view").hide();
    $("#settings_view").hide();
    $('.showhidemenu').show();
}

function showFavorite() {
    $("#li_favorite_view").addClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#li_settings_view").removeClass("active");
    $("#favorite_view").show();
    $("#list_view").hide();
    $("#map_view").hide();
    $("#settings_view").hide();
    $('.showhidemenu').show();
    changeFavoritePage(1);
}

function showSettings() {
    $("#li_settings_view").addClass("active");
    $("#li_favorite_view").removeClass("active");
    $("#li_list_view").removeClass("active");
    $("#li_map_view").removeClass("active");
    $("#settings_view").show();
    $("#favorite_view").hide();
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

    if ($('#'+id).data('innerHTML')) {
        return;
    }

    //save current cell data
    $('#'+id).data('innerHTML', $('#'+id).html());

    var not_instant_func = $('#'+id).data('settings') ?
        'onchange="updateSettingsRowLocal('+idx+',\''+key+'\',\''+id+'_inp\')"' :
        'onchange="updateAddRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ';

    /* hardcode for needed fields */
    /*if (key == 'ddl_id') {
        var html = '<select class="form-control" ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for(var i in settingsDDLs) {
            html += '<option value="'+settingsDDLs[i].id+'">'+settingsDDLs[i].name+'</option>';
        }
        html += '</select>';
    } else
    if (key == 'input_type') {
        var html = '<select class="form-control" ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        html += '<option value="Input">Input</option>';
        html += '<option value="Selection">Selection</option>';
        html += '</select>';
    }
    else*//*end hardcode */
    if (inp_t == 'Input') {
        var html = '<input ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
    } else
    if (inp_t == 'Selection') {
        var html = '<select class="form-control" ' +
            'id="'+id+'_inp" ' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            (instant ? 'onchange="updateRowData('+idx+',\''+key+'\',\''+id+'_inp\')" ' : not_instant_func) +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for(var i in ltableDDls[key]) {
            if (key == 'ddl_id') {
                html += '<option value="'+i+'">'+ltableDDls[key][i]+'</option>';
            } else {
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

function updateRow(params) {
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
        ltableData = (lv ? tableData : settingsTableData),
        ltableHeaders = (lv ? tableHeaders : settingsTableHeaders);

    $('.js-editmodal').hide();

    var idx = $('.js-editmodal').data('idx');
    for(var key in ltableHeaders) {
        if (key != 'id') {
            ltableData[idx][key] = $('#modals_inp_'+key).val();
        }
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
    deleteRow(ltableData[idx], idx);
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

    var html = "";
    for(var key in ltableHeaders) {
        if (key != 'id' && key != 'is_favorited') {
            html += "<tr>";
            html +=
                '<td><label>' + ltableHeaders[key].name + '</label></td>' +
                '<td>';
            if (ltableHeaders[key].input_type == 'Input' && ltableHeaders[key].can_edit) {
                html += '<input id="modals_inp_'+key+'" type="text" class="form-control" />';
            } else
            if (ltableHeaders[key].input_type == 'Selection' && ltableHeaders[key].can_edit) {
                html += '<select class="form-control" id="modals_inp_'+key+'" class="form-control" style="margin-bottom: 5px">';
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
        $('#divTbData').css('top', '85px');

        editSelectedData(-1);
    } else {
        $('#tbAddRow').hide();
        $('#tbHeaders').css('top', '0');
        $('#divTbData').css('top', '32px');
    }
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

            console.log(response);
            if (authUser) {
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
    var tableData = "", tbHiddenData = "", tbAddRow = "", tbAddRow_h = "", key, d_key, tbDataHeaders = "",
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;

    for(var i = 0; i < data.length; i++) {
        if (i === 0) { //first row with checkboxes
            tableData += "<tr>";
            tableData += '<td></td><td></td><td></td>';
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tableData += '<td ' +
                        'data-key="' + headers[key].field + '"' +
                        'style="text-align: center;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                            '<input ' +
                            'type="checkbox" ' +
                            'class="js-favoriteCheckboxRow" ' +
                            'data-key="' + headers[key].field + '"' +
                            '>' +
                        '</td>';
                }
            }
            tableData += "</tr>";
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
            '<input type="checkbox" class="js-favoriteRowsChecked" data-idx="' + i + '">' +
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

    tbDataHeaders += "<tr><th class='sorting nowrap'><b>#</b></th>";
    tbDataHeaders += "<th class='sorting nowrap'><b>Favorite</b></th>";
    tbDataHeaders += "<th class='sorting nowrap'><b>Copy</b></th>";
    for(var $hdr in headers) {
        tbDataHeaders += '<th class="sorting nowrap" data-key="' + headers[$hdr].field + '" style="' + (headers[$hdr].web == 'No' ? 'display: none;' : '') + '">' +
            ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : headers[$hdr].name) +
            '</th>';
    }
    tbDataHeaders += "</tr>";

    $('#tbFavoriteHeaders_header').html(tbDataHeaders);
    $('#tbFavoriteData_header').html(tbDataHeaders);

    $('#tbFavoriteHeaders_body').html(tbHiddenData);
    $('#tbFavoriteData_body').html(tableData);
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
        $('.js-favoriteCheckboxRow:checked').each(function (i, elem) {
            selectedColumns.push( $(elem).data('key') );
        });
        console.log(selectedColumns);

        var textToClip = "<table id='tableForCopy'>";
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
            title: "Only available to logged user",
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
            $('.loadingFromServer').hide();
        },
        error: function () {
            alert("Server error");
            $('.loadingFromServer').hide();
        }
    })
}

function showSettingsDataTable(headers, data) {
    var tableData = "", tbHiddenData = "", key, d_key,
        lsettingsEntries = settingsEntries == 'All' ? 0 : settingsEntries;

    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
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
                    (d_key != 'id' ? 'onclick="showInlineEdit(\'' + headers[key].field + i + '_settingsDisplay\', '+canEditSettings+')"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (d_key === 'ddl_id') {
                    tableData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else {
                    tableData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        if (canEditSettings) {
            tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        } else {
            tbHiddenData += '<td></td>';
        }
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'ddl_name') {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (d_key === 'ddl_id') {
                    tbHiddenData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else {
                    tbHiddenData += (data[i][d_key] !== null ? data[i][d_key] : '');
                }
                tbHiddenData += '</td>';
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

            console.log('Settings/DDL', response);
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
    var tableData = "", tbHiddenData = "", tbAddRow = "", key, d_key;

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
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'items') {
                tableData +=
                    '<td ' +
                    'id="' + d_key + i + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '"' +
                    'data-key="' + d_key + '"' +
                    'data-idx="' + i + '"' +
                    'data-table="' + (idx == -1 ? 'ddl' : 'ddl_items') + '"' +
                    'data-table_idx="' + idx + '"' +
                    ((d_key == 'name' || d_key == 'option' || d_key == 'notes') ? 'onclick="showInlineEdit_SDDL(\'' + d_key + i + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '\', 1)"' : '') +
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
        tableData += "<td><button onclick='deleteSettingsDDL(\""+(idx == -1 ? 'ddl' : 'ddl_items')+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
        tableData += "</tr>";

        tbHiddenData += "<tr style='visibility: hidden;'>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        for(key in headers) {
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
        tbHiddenData += "<td><button><i class='fa fa-trash-o'></i></button></td>";
        tbHiddenData += "</tr>";
    }

    tbAddRow += "<tr style='height: 37px;'><td>auto</td>";
    for(key in headers) {
        d_key = headers[key].field;
        if (d_key != 'items') {
            tbAddRow += '<td ' +
                'id="add_' + d_key + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '"' +
                'data-key="' + d_key + '"' +
                'data-table="' + (idx == -1 ? 'ddl' : 'ddl_items') + '"' +
                ((d_key == 'name' || d_key == 'option' || d_key == 'notes') ? 'onclick="showInlineEdit_SDDL(\'add_' + d_key + (idx == -1 ? '_settings_ddl' : '_settings_items_ddl') + '\', 0)"' : '') +
                'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    ((d_key != 'name' && d_key != 'option' && d_key != 'notes') ? 'auto' : '') +
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
                "<button onclick='toggleAllrights("+i+",false)'><i class='fa fa-close'></i></button>" :
                "<button onclick='toggleAllrights("+i+",true)'><i class='fa fa-check'></i></button>";
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
                    tableData += settingsUsersNames[data[i][d_key]];
                } else
                if (idx != -1 && (d_key === 'view' || d_key === 'edit')) {
                    tableData += '<input ' +
                        'id="inp_' + d_key + i + '_settings_rights_field"' +
                        'type="checkbox" ' +
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
            "<button onclick='deleteSettingsRights(\""+(idx == -1 ? 'rights' : 'rights_fields')+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button>" +
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
    if (tableName == 'rights') {
        settingsRights.splice(idx, 1);
        settingsRights_selectedIndex = -1;
        showSettingsRightsDataTable(settingsRights_hdr, settingsRights, -1);
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
        url: baseHttpUrl + '/addRightsDatas?tableName=rights&table_id=' + settingsRights_TableMeta.id + '&user_id=' + $('#selectUserSearch').val(),
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

function toggleAllrights(idx, status) {
    settingsRights_selectedIndex = idx;
    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/toggleAllrights?right_id=' + settingsRights[idx].id + '&r_status=' + (status ? 1 : 0),
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
})