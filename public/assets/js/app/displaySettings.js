
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
            q: btoa(JSON.stringify(query)),
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
            q: btoa(JSON.stringify(query)),
            fields: btoa(JSON.stringify(settingsTableHeaders)),
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
        //tableData += '<td data-order="'+i+'"><span draggable="true"><i style="width: 100%;text-align: center;" class="fa fa-bars"></i></span></td>';
        tableData += '<td><a onclick="editSelectedData('+i+')" class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'ddl_name') {
                tableData +=
                    '<td ' +
                    'id="' + headers[key].field + i + '_settingsDisplay"' +
                    'data-wrapped="true"' +
                    'data-key="' + headers[key].field + '"' +
                    'data-input="' + headers[key].input_type + '"' +
                    'data-idx="' + i + '"' +
                    'data-settings="true"' +
                    (
                        $.inArray(d_key, system_fields) == -1 && d_key != 'field' && d_key != 'name' && d_key != 'web' && d_key != 'filter' ?
                            'onclick="showInlineEdit(\'' + headers[key].field + i + '_settingsDisplay\', '+authUser+')"' :
                            ''
                    ) + //canEditSettings
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tableData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else
                if (d_key === 'web' || d_key === 'filter') {
                    tableData += '<label class="switch_t">' +
                        '<input type="checkbox" id="'+headers[key].field + i + '_settingsDisplay_inp" '+(data[i][d_key] == "Yes" ? 'checked' : '')+'>' +
                        '<span ' +
                        (
                            authUser ?
                                'onclick="updateRowData('+i+',\''+d_key+'\',\''+headers[key].field + i + '_settingsDisplay_inp\', \''+authUser+'\')" ' :
                                'onclick="updateSettingsRowLocal('+i+',\''+d_key+'\',\''+headers[key].field + i + '_settingsDisplay_inp\')"'
                        ) +
                        'class="toggler round"></span>' +
                        '</label>';
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tableData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else
                if (d_key === 'dfot_odr') {
                    tableData += '<button class="btn btn-sm" style="width: 100%" data-odr="' + get_calc_odr(data[i].field) + '">'+
                        '<span draggable="true">' + get_calc_odr(data[i].field) + '</span>' +
                        '</button>';
                } else {
                    tableData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
                }
                tableData += '</div></td>';
            }
        }
        tableData += "</tr>";

        tbHiddenData += "<tr>";
        //tbHiddenData += "<td></td>";
        tbHiddenData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1+Number(settingsPage*lsettingsEntries)) +'</b></a></td>';
        for(key in headers) {
            d_key = headers[key].field;
            if (d_key != 'ddl_name') {
                tbHiddenData +=
                    '<td ' +
                    'data-key="' + headers[key].field + '"' +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    '<div class="td_wrap" style="'+(headers[key].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[key].dfot_wth-14)+'px;' : '')+'">';
                if (d_key === 'ddl_id' || d_key === 'unit_ddl') {
                    tbHiddenData += (data[i][d_key] > 0 && settingsTableDDLs['ddl_id'][data[i][d_key]] !== null ? settingsTableDDLs['ddl_id'][data[i][d_key]] : '');
                } else
                if (d_key === 'web' || d_key === 'filter') {
                    tbHiddenData += '<label class="switch_t">' +
                        '<input type="checkbox">' +
                        '<span class="toggler round"></span>' +
                        '</label>';
                } else
                if (d_key === 'dfot_odr') {
                    tbHiddenData += '<button class="btn btn-sm" style="width: 100%">'+ key +'</button>';
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tbHiddenData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else {
                    tbHiddenData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
                }
                tbHiddenData += '</div></td>';
            }
        }
        tbHiddenData += "</tr>";
    }

    //recreate headers for main data
    tbSettingsHeaders += "<tr> <th class='sorting nowrap'><b>#</b> </th>";
    for(var $hdr in headers) {
        tbSettingsHeaders += '<th ' +
            'class="sorting nowrap" ' +
            'data-key="' + headers[$hdr].field + '" ' +
            'data-order="' + $hdr + '" ' +
            'style="position:relative;' + (headers[$hdr].web == 'No' ? 'display: none;' : '') +
            (headers[$hdr].min_wth > 0 ? 'min-width: '+headers[$hdr].min_wth+'px;' : '') +
            (headers[$hdr].max_wth > 0 ? 'max-width: '+headers[$hdr].max_wth+'px;' : '') +
            '">' +
            '<span draggable="true" style="white-space: normal;display: inline-block; '+(headers[$hdr].dfot_wth > 0 && localStorage.getItem('stretched_tables')=='0' ? 'width: ' + (headers[$hdr].dfot_wth-27)+'px;' : '')+'">' +
            ( headers[$hdr].field == 'ddl_id' ? "DDL Name" : headers[$hdr].name) +
            '</span>' +
            '<div style="position: absolute; top: 0; bottom: 0; right: 0; width: 5px; cursor: col-resize;"></div>' +
            '</th>';
    }
    tbSettingsHeaders += "</tr>";

    $('#tbSettingsHeaders_head').html(tbSettingsHeaders);
    $('#tbSettingsData_head').html(tbSettingsHeaders);

    $('#tbSettingsHeaders_body').html(tbHiddenData);
    $('#tbSettingsData_body').html(tableData);

    //add drag listeners for table headers
    if (authUser) {
        var cols = document.querySelectorAll('#tbSettingsHeaders_head th > span[draggable="true"]');
        [].forEach.call(cols, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings, false);
            col.addEventListener('dragend', handleDragEndSettings, false);
        });

        var cols_dfot = document.querySelectorAll('#tbSettingsData_body button > span[draggable="true"]');
        [].forEach.call(cols_dfot, function(col) {
            col.addEventListener('dragstart', handleDragStartSettings_dfot, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings_dfot, false);
            col.addEventListener('dragend', handleDragEndSettings_dfot, false);
        });

        var rows = document.querySelectorAll('#tbSettingsData_body td > span[draggable="true"]');
        [].forEach.call(rows, function(col) {
            col.addEventListener('dragstart', handleDragStart, false);
            col.addEventListener('dragenter', handleDragEnter, false);
            col.addEventListener('dragover', handleDragOver, false);
            col.addEventListener('dragleave', handleDragLeave, false);
            col.addEventListener('drop', handleDropSettings_rows, false);
            col.addEventListener('dragend', handleDragEndSettings_rows, false);
        });

        //add resize listeners for table headers
        cols = document.querySelectorAll('#tbSettingsHeaders_head th > div');
        [].forEach.call(cols, function(col) {
            col.addEventListener('mousedown', handleStartSettingsResize, false);
        });
    }

    changeTheme(currentTheme);
}
document.addEventListener('mousemove', handleElemSettingsResize, false);
document.addEventListener('mouseup', handleEndSettingsResize, false);

var startSettingsX = 0, startSettingsWidth = 0, startSettingsResizeElem = false;
function handleStartSettingsResize(e) {
    startSettingsX = 0;
    startSettingsWidth = this.parentNode.clientWidth;
    startSettingsResizeElem = this;
    this.parentNode.style.minWidth = "0";
    this.parentNode.style.maxWidth = "1000px";
}

function handleElemSettingsResize(e) {
    if (startSettingsResizeElem) {
        if (startSettingsX) {
            var fieldKey = startSettingsResizeElem.parentNode.dataset.key;
            startSettingsWidth += e.x - startSettingsX;
            startSettingsX = e.x;
            //resize header
            $('#tbSettingsHeaders_head th[data-key="'+fieldKey+'"] span').css('width', (startSettingsWidth-27)+'px');
            $('#tbSettingsData_head th[data-key="'+fieldKey+'"] span').css('width', (startSettingsWidth-27)+'px');
            //resize columns
            $('#tbSettingsHeaders_body td[data-key="'+fieldKey+'"] .td_wrap').css('width', (startSettingsWidth-14)+'px');
            $('#tbSettingsData_body td[data-key="'+fieldKey+'"] .td_wrap').css('width', (startSettingsWidth-14)+'px');
        } else {
            startSettingsX = e.x;
        }
    }
}

function handleEndSettingsResize(e) {
    if (startSettingsResizeElem) {
        var field_name = startSettingsResizeElem.parentNode.dataset.key;
        startSettingsResizeElem = false;

        for (var i in settingsTableHeaders) {
            if (settingsTableHeaders[i].field == field_name) {
                settingsTableHeaders[i].dfot_wth = startSettingsWidth;
                $.ajax({
                    url: baseHttpUrl + '/updateTableRow?tableName=tb_settings_display&id=' + btoa(settingsTableHeaders[i].id) + '&dfot_wth=' + btoa(startSettingsWidth),
                    method: 'get'
                });
                break;
            }
        }
        startSettingsWidth = 0;
        showDataTable(settingsTableHeaders, settingsTableData);
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

    var target = this.parentNode.dataset.order;
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
            url: baseHttpUrl + '/changeOrder?tableName='+settingsTableName+'&select='+selectedForChangeOrder+'&target='+target+'&replace=0',
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
    var cols = document.querySelectorAll('#tbSettingsHeaders_head th > span[draggable="true"]');
    this.parentNode.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.classList.remove('over');
    });
}

function handleDragStartSettings_dfot(e) {
    selectedForChangeOrder = Number(this.parentNode.dataset.odr)-1;
    this.parentNode.style.opacity = '0.6';
}

function handleDropSettings_dfot(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = Number(this.parentNode.dataset.odr)-1;
    if (selectedForChangeOrder > -1 && selectedForChangeOrder !== target) {
        //change main columns
        var reoderedTmp = tableHeaders[selectedForChangeOrder];
        tableHeaders[selectedForChangeOrder] = tableHeaders[target];
        tableHeaders[target] = reoderedTmp;
        //change settings rows
        reoderedTmp = settingsTableData[selectedForChangeOrder];
        settingsTableData[selectedForChangeOrder] = settingsTableData[target];
        settingsTableData[target] = reoderedTmp;

        showDataTable(tableHeaders, tableData);
        showSettingsDataTable(settingsTableHeaders, settingsTableData);

        $.ajax({
            method: 'GET',
            url: baseHttpUrl + '/changeOrder?tableName='+selectedTableName+'&select='+selectedForChangeOrder+'&target='+target+'&replace=1',
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
    var cols = document.querySelectorAll('#tbSettingsData_body button > span[draggable="true"]');
    this.parentNode.style.opacity = '1';

    [].forEach.call(cols, function (col) {
        col.parentNode.classList.remove('over');
    });
}

function handleDropSettings_rows(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }

    var target = this.parentNode.dataset.order;
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
    var cols = document.querySelectorAll('#tbSettingsData_body td > span[draggable="true"]');
    this.parentNode.style.opacity = '1';

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
        //
    } else if (key == "filter") {
        if (val == "Yes") {
            $.ajax({
                method: 'GET',
                url: baseHttpUrl + '/loadFilter?tableName=' + selectedTableName + '&field='+ header_key +'&name='+ btoa(settingsTableData[idx]['name']),
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