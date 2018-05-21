
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
        lselectedEntries = selectedEntries == 'All' ? 0 : selectedEntries;

    if (!data.length) {
        return;
    }

    for (var i = 0; i < data.length; i++) {
        if (i === 0) { //first row with checkboxes
            tbCheckRow += "<tr>";
            tbCheckRow += '<td></td> <td></td> ';
            tbCheckRow += '<td style="padding: 4px;min-width: 70px;">' +
                'R:<input type="checkbox" id="favCheckAllRow" onchange="favCheckAll(\'row\')"> ' +
                'H:<input type="checkbox" id="favCheckAllCol" onchange="favCheckAll(\'col\')">' +
                '</td>';
            for(key in headers) {
                d_key = headers[key].field;
                if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                    tbCheckRow += '<td ' +
                        'data-key="' + headers[key].field + '"' +
                        'style="text-align: center;' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') + '">' +
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
        tableData += '<td style="text-align: center;min-width: 70px;">' +
            '<input type="checkbox" class="js-favoriteRowsChecked" data-idx="' + i + '" onchange="favTestCheckAll(\'row\')">' +
            '</td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tableData += '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') + '"' +
                    '>' +
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

        tbHiddenData += "<tr>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1+Number(selectedFavoritePage*lselectedEntries)) +'</b></td>';
        //second column ("star")
        tbHiddenData += '<td>' + '<i class="fa fa-star" style="font-size: 1.5em;color: #FD0;"></i>' + '</td>';
        tbHiddenData += '<td style="min-width: 70px;"></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if ($.inArray(d_key, arrAddFieldsInData) == -1) {
                tbHiddenData += '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="' + (headers[key].web == 'No' || !headers[key].is_showed ? 'display: none;' : '') + '"' +
                    '>' +
                    '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tbHiddenData += (data[i][d_key] > 0 && tableDDLs['x_ddl_id'][data[i][d_key]] !== null ? tableDDLs['x_ddl_id'][data[i][d_key]] : '');
                } else
                if (headers[key].f_type == 'Attachment') {
                    tbHiddenData += (String(data[i][d_key]).indexOf('<') > -1 ? data[i][d_key] : '');//'<i class="fa fa-paperclip"></i>';
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tbHiddenData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
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
            tbDataHeaders += "<th class='sorting nowrap' rowspan='"+(rows_in_hdrs+1)+"' style='text-align: center;'><b>#</b></th>";
            tbDataHeaders += "<th class='sorting nowrap' rowspan='"+(rows_in_hdrs+1)+"' style='text-align: center;'><i class='fa fa-info-circle'></i></th>";
            tbDataHeaders += "<th class='sorting nowrap' rowspan='"+(rows_in_hdrs+1)+"' style='min-width: 70px;'></th>";
        }
        for (var $hdr in headers) {
            tmp = headers[$hdr].name;
            tmp = tmp.split(',');

            tbDataHeaders += '<th class="sorting nowrap" ' +
                (!headers[$hdr].unit && i == (rows_in_hdrs-1) ? 'rowspan="2" ' : '') +
                'data-key="' + headers[$hdr].field + '" ' +
                'style="text-align: center;' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;' : '') +
                (headers[$hdr].min_wth > 0 ? 'min-width: '+headers[$hdr].min_wth+'px;' : '') +
                (headers[$hdr].max_wth > 0 ? 'max-width: '+headers[$hdr].max_wth+'px;' : '') +
                '">' +
                '<span style="text-align: center;white-space: normal;display: inline-block; '+(headers[$hdr].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[$hdr].dfot_wth-27)+'px;' : '')+'">' +
                ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : (tmp[i] ? tmp[i] : '')) +
                '</span>' +
                '</th>';
        }
        tbDataHeaders += "</tr>";
    }
    //unit`s header row
    tbDataHeaders += "<tr>";
    for(var $hdr in headers) {
        if (headers[$hdr].unit) {
            tbDataHeaders += '<th ' +
                'data-key="' + headers[$hdr].field + '" ' +
                'style="text-align: center;' + (headers[$hdr].web == 'No' || !headers[$hdr].is_showed ? 'display: none;' : '') + '">' +
                (headers[$hdr]._u_factor ? headers[$hdr].unit_display : headers[$hdr].unit) +
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

    if (rows_in_hdrs > 1) {
        SpanColumnsWithTheSameData('tbFavoriteHeaders_header');
        SpanColumnsWithTheSameData('tbFavoriteData_header');
        SpanColumnsWithTheSameData('tbFavoriteCheckRow_header');
    }

    var hdr_height = document.getElementById('tbFavoriteHeaders_header').clientHeight;
    $('#tbFavoriteCheckRow').css('top', (-hdr_height)+'px');
    $('#tbFavoriteDataDiv').css('top', (hdr_height+37)+'px');
    $('#tbFavoriteData').css('margin-top', (-hdr_height)+'px');

    changeTheme(currentTheme);
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
        var rows_in_hdrs = 1, tmp;

        var textToClip = "<table id='tableForCopy'>";
        if ($('#favourite_copy_with_headers').is(':checked')) {
            for (var $hdr in favoriteTableHeaders) {
                tmp = favoriteTableHeaders[$hdr].name;
                tmp = tmp.split(',');
                if (tmp && tmp.length > rows_in_hdrs) {
                    rows_in_hdrs = tmp.length;
                }
            }

            textToClip += "<thead id='tableForCopy_head'>";
            //recreate headers for main data (with multi-headers feature)
            for (var i = 0; i < rows_in_hdrs; i++) {
                textToClip += "<tr>";
                for (var j = 0; j < selectedColumns.length; j++) {
                    for (var k = 0; k < favoriteTableHeaders.length; k++) {
                        if (favoriteTableHeaders[k].field == selectedColumns[j]) {
                            tmp = favoriteTableHeaders[k].name;
                            tmp = tmp.split(',');

                            textToClip += "<th "+(!favoriteTableHeaders[k].unit && i == (rows_in_hdrs-1) ? 'rowspan="2"' : '')+">" + (tmp[i] ? tmp[i] : '') + "</th>";
                        }
                    }
                }
                textToClip += "</tr>";
            }
            //unit`s headers row
            textToClip += "<tr>";
            for (var j = 0; j < selectedColumns.length; j++) {
                for (var k = 0; k < favoriteTableHeaders.length; k++) {
                    if (favoriteTableHeaders[k].field == selectedColumns[j] && favoriteTableHeaders[k].unit) {
                        textToClip += "<th>" + (favoriteTableHeaders[k]._u_factor ? favoriteTableHeaders[k].unit_display : favoriteTableHeaders[k].unit) + "</th>";
                    }
                }
            }
            textToClip += "</tr>";
            textToClip += "</thead>";
        }
        $('.js-favoriteRowsChecked:checked').each(function (i, elem) {
            var idx = $(elem).data('idx');
            textToClip += "<tr>";
            for (var j = 0; j < selectedColumns.length; j++) {
                for (var k = 0; k < favoriteTableHeaders.length; k++) {
                    if (favoriteTableHeaders[k].field == selectedColumns[j]) {
                        textToClip += "<td>" + (favoriteTableHeaders[k]._u_factor ? getUnitConversion(favoriteTableHeaders[k], favoriteTableData[ idx ][ selectedColumns[j] ]) : favoriteTableData[ idx ][ selectedColumns[j] ]) + "</td>";
                    }
                }
            }
            textToClip += "</tr>";
        });
        textToClip += "</table>";

        $(document.body).append(textToClip);
        copyToClipboard(tableForCopy);
        $('#tableForCopy').remove();
    } else {
        swal({
            title: "Not available",
            text: "Only available to logged in user. Register and login to make full use of all functions and features.",
            type: "warning"
        });
    }
}

function copyToClipboard(el) {
    selectElementContents(el);
    //document.body.removeChild(el);
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