
/* ------------------------ Permissions / tab 'Settings' ----------------------------*/

var settingsRights,
    settingsRights_hdr,
    settingsRights_Fields_hdr,
    settingsRights_Rows_hdr,
    settingsRights_Obj,
    settingsRights_FieldsObj,
    settingsRights_RowsObj,
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
            settingsRights_Rows_hdr = response.Rights_Rows_hdr;
            settingsRights_TableMeta = response.table_meta;
            settingsUsersNames = response.users_names;
            settingsRights_Obj = setAllNullObj(settingsRights_hdr);
            settingsRights_FieldsObj = setAllNullObj(settingsRights_Fields_hdr);
            settingsRights_RowsObj = setAllNullObj(settingsRights_Rows_hdr);
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
            if (d_key != 'fields' && d_key != 'rows') {
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
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tableData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else {
                    tableData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
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
            if (d_key != 'fields' && d_key != 'rows') {
                tbHiddenData += '<td style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'table_id') {
                    tbHiddenData += settingsRights_TableMeta.name;
                } else
                if (idx == -1 && d_key === 'user_id') {
                    tbHiddenData += (settingsUsersNames[data[i][d_key]] ? settingsUsersNames[data[i][d_key]] : 'Visitor');
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tbHiddenData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else {
                    tbHiddenData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
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

        //show rows table
        data = settingsRights[idx].rows;
        headers = settingsRights_Rows_hdr;
        tableData = tbHiddenData = tbAddRow = '';
        var edited_fields = ['opr','field','compare','val'];
        for (var i = 0; i < data.length; i++) {
            tableData += "<tr id='row_" + i + "_settings_rows_rights'>";
            tableData += '<td><a class="btn-tower-id" ><span class="font-icon">`</span><b>'+ (i+1) +'</b></a></td>';
            for (key in headers) {
                d_key = headers[key].field;
                if (d_key != 'fields' && d_key != 'rows') {
                    tableData +=
                        '<td ' +
                        'id="' + d_key + i + '_settings_rows_rights"' +
                        'data-key="' + d_key + '"' +
                        'data-idx="' + i + '"' +
                        'data-table="range"' +
                        'data-table_idx="' + idx + '"' +
                        (($.inArray(d_key, edited_fields) > -1) ? 'onclick="showInlineEdit_ROWRIGHT(\'' + d_key + i + '_settings_rows_rights\', 1)"' : '') +
                        'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                    if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                        var usr = allUsers.find(function (el) {
                            return el.id === data[i][d_key];
                        });
                        if (usr) tableData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                    } else {
                        tableData += (data[i][d_key] ? data[i][d_key] : '');
                    }
                    tableData += '</td>';
                }
            }
            tableData += "<td><button onclick='deleteSettingsRights(\"range\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
            tableData += "</tr>";

            tbHiddenData += "<tr style='visibility: hidden;'>";
            tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
            for (key in headers) {
                d_key = headers[key].field;
                if (d_key != 'fields' && d_key != 'rows') {
                    tbHiddenData += '<td style="' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                    if (idx == -1 && d_key === 'tb_id') {
                        tbHiddenData += settingsDDL_TableMeta.name;
                    } else if (idx != -1 && d_key === 'list_id') {
                        tbHiddenData += settingsDDLs[idx].name;
                    } else
                    if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                        var usr = allUsers.find(function (el) {
                            return el.id === data[i][d_key];
                        });
                        if (usr) tbHiddenData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                    } else {
                        tbHiddenData += (data[i][d_key] ? data[i][d_key] : '');
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

        tbAddRow += "<tr style='height: 37px;'><td></td>";
        for (key in headers) {
            d_key = headers[key].field;
            if (d_key != 'fields' && d_key != 'rows') {
                tbAddRow += '<td ' +
                    'id="add_' + d_key + '_settings_rows_rights"' +
                    'data-key="' + d_key + '"' +
                    (($.inArray(d_key, edited_fields) > -1) ? 'onclick="showInlineEdit_ROWRIGHT(\'add_' + d_key + '_settings_rows_rights\', 0)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">' +
                    (($.inArray(d_key, edited_fields) == -1) ? 'auto' : '') +
                    '</td>';
            }
        }
        tbAddRow += "<td><a href=\"javascript:void(0)\" class=\"button blue-gradient glossy\" onclick=\"savePermissionRows()\">Add</a></td>";
        tbAddRow += "</tr>";

        $('#tbSettingsRights_Rows_headers').html(tbHiddenData);
        $('#tbSettingsRights_Rows_data').html(tableData+tbAddRow);
        //---------------
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

    changeTheme(currentTheme);
}

function showInlineEdit_ROWRIGHT(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).html());
    var key = $('#'+id).data('key'),
        idx = $('#'+id).data('idx'),
        html, options;

    if (key == 'opr') {
        options = '<option>AND</option><option>OR</option>';
    } else
    if (key == 'compare') {
        options = '<option></option><option><</option><option>=</option><option>></option>';
    }

    if (key == 'opr' || key == 'compare') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updatePermissionRows(\''+id+'_inp\')' : 'addPermissionRows(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            options +
            '</select>';
    } else
    if (key == 'field') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updatePermissionRows(\''+id+'_inp\')' : 'addPermissionRows(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">';
        for (var i in tablesDropDown) {
            if (tablesDropDown[i].db_tb == table_meta.db_tb) {
                for (var j in tablesDropDown[i].items) {
                    html += '<option value="'+tablesDropDown[i].items[j].field+'">'+tablesDropDown[i].items[j].name+'</option>';
                }
                break;
            }
        }
        html += '</select>';
    } else
    if (key == 'val') {
        var table_field = (idx !== undefined ? settingsRights[settingsRights_selectedIndex].rows[idx]['field'] : settingsRights_RowsObj.field);

        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updatePermissionRows(\''+id+'_inp\')' : 'addPermissionRows(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            '<option></option>';

        if (table_field) {
            var resp = $.ajax({
                url: baseHttpUrl + '/getDistinctData?table=' + table_meta.db_tb + '&field=' + table_field,
                method: 'get',
                async: false
            }).responseText;
            resp = JSON.parse(resp);
            for (var i in resp) {
                html += '<option value="'+resp[i]+'">'+resp[i]+'</option>';
            }
        }

        html += '</select>';
    }

    $('#'+id).html(html);
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function updatePermissionRows(id) {
    //update in the table view
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    var table = $('#'+id).data('table'),
        idx = $('#'+id).data('idx'),
        table_idx = $('#'+id).data('table_idx'),
        key_name = $('#'+id).data('key'),
        params;
    settingsRights[table_idx].rows[idx][key_name] = $('#'+id).val();
    params = settingsRights[table_idx].rows[idx];

    var strParams = "";
    for (var key in params) {
        if (key != 'fields' && key != 'rows' && params[key] !== null) {
            strParams += key + '=' + btoa(params[key]) + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=range&' + strParams,
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
}

function addPermissionRows(id) {
    //update in the table view
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', $('#'+id).val());

    var table = $('#'+id).data('table'),
        key_name = $('#'+id).data('key');

    settingsRights_RowsObj[key_name] = $('#'+id).val();
}

function savePermissionRows() {
    settingsRights_RowsObj['permission_id'] = settingsRights[settingsRights_selectedIndex].id;

    var params = settingsRights_RowsObj;
    var strParams = "";
    for (var key in params) {
        if (key != 'fields' && key != 'rows' && params[key] !== null) {
            strParams += key + '=' + btoa(params[key]) + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addTableRow?tableName=range&' + strParams,
        success: function (response) {
            settingsRights_RowsObj.id = response.last_id;
            settingsRights[settingsRights_selectedIndex].rows.push(settingsRights_RowsObj);
            settingsRights_RowsObj = setAllNullObj(settingsRights_Rows_hdr);
            showSettingsRightsDataTable(settingsRights_Fields_hdr, '', settingsRights_selectedIndex);

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
            if (response.msg) {
                alert(response.msg);
            }
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
        if (tableName == 'range') {
            settingsRights[settingsRights_selectedIndex].rows.splice(idx, 1);
        } else {
            settingsRights[settingsRights_selectedIndex].fields.splice(idx, 1);
        }
        showSettingsRightsDataTable(settingsRights_Fields_hdr, settingsRights[settingsRights_selectedIndex].fields, settingsRights_selectedIndex);
    }

    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/deleteRightsDatas?tableName=' + tableName + '&id=' + rowId,
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
}

function addSettingsRights() {
    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/addRightsDatas?tableName=permissions&table_id=' + settingsRights_TableMeta.id + '&user_id=' + $('#selectUserSearch').val(),
        success: function (response) {
            $('.loadingFromServer').hide();
            if (response.msg) {
                alert(response.msg);
            }

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
            if (response.msg) {
                alert(response.msg);
            }

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