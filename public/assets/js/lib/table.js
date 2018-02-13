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
    filtersData = [],
    filterMaxHeight = 150,
    changedFilter = false,
    searchKeyword = "",
    filterMenuHide = false;

/* -------------------- Functions ---------------------- */

function selectTable(tableName) {
    //$('.loadingFromServer').show();
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

            showDataTable(response.headers, response.data);

            showFiltersList(response.filters);
        }
    });
}

function changePage(page) {
    selectedPage = page;
    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/getSelectedTable',
        data: {
            tableName: selectedTableName,
            getfilters: true,
            p: selectedPage,
            c: selectedEntries,
            /*q: JSON.stringify(query),*/
            /*fields: JSON.stringify(tableObj),*/
            filterData: JSON.stringify(filtersData),
            changedFilter: JSON.stringify(changedFilter)
        },
        success: function (response) {
            if (response.msg) {
                alert(response.msg);
            }

            console.log(response);

            showDataTable(response.headers, response.data);

            showFiltersList(response.filters);
        }
    })
}

function showDataTable(headers, data) {
    var tableData = "", key;
    for(var i = 0; i < data.length; i++) {
        tableData += "<tr>";
        for(key in data[i]) {
            tableData += '<td data-key="' + headers[key].field + '" style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' + (data[i][key] !== null ? data[i][key] : '') + '</td>';
        }
        tableData += "</tr>";
    }
    $('#tbAddrow_body').html(tableData);
    $('#tbHeaders_body').html(tableData);
    $('#tbData_body').html(tableData);
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
    changePage(0);
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
    changePage(0);
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