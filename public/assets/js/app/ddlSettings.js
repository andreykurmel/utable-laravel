
/* ------------------------ DDL / tab 'Settings' ----------------------------*/

var settingsDDLs,
    settingsDDL_hdr,
    settingsDDL_items_hdr,
    settingsDDL_Obj,
    settingsDDL_ItemsObj,
    settingsDDL_REFObj,
    settingsDDL_selectedIndex = -1,
    settingsDDL_TableMeta,
    settingsDDL_cdtns_headers,
    settingsDDL_notes;

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
            settingsDDL_notes = response.ddl_notes;
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
        edited_fields = (idx == -1 ? ['name','type','notes'] : (settingsDDLs[idx].type != 'referencing' ? ['option','notes'] : ['use','ref_tb','ref_tb_field','sampleing','logic_opr','comp_ref_field','compare','compare_ref_val','comp_tar_field','notes']));

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
                    'data-real_val="' + (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '') + '"' +
                    (($.inArray(d_key, edited_fields) > -1) ? 'onclick="'+func_name+'(\'' + d_key + i + add_id_name + '\', 1)"' : '') +
                    'style="position:relative;' + (headers[key].web == 'No' ? 'display: none;' : '') + '">';
                if (idx == -1 && d_key === 'tb_id') {
                    tableData += settingsDDL_TableMeta.name;
                } else
                if (idx != -1 && d_key === 'list_id') {
                    tableData += settingsDDLs[idx].name;
                } else
                if (d_key == 'createdBy' || d_key == 'modifiedBy') {
                    var usr = allUsers.find(function (el) {
                        return el.id === data[i][d_key];
                    });
                    if (usr) tableData += (usr.first_name ? usr.first_name : '') + ' ' + (usr.last_name ? usr.last_name : '');
                } else
                if (d_key == 'ref_tb') {
                    var tb = tablesDropDown.find(function (el) {
                        return el.db_tb === data[i][d_key];
                    });
                    if (tb) tableData += tb.name;
                } else
                if (d_key == 'ref_tb_field' || d_key == 'comp_ref_field' || d_key == 'comp_tar_field') {
                    var cmp = (d_key == 'comp_tar_field' ? table_meta.db_tb : data[i]['ref_tb']);
                    var tb = tablesDropDown.find(function (el) {
                        return el.db_tb === cmp;
                    });
                    if (tb) {
                        var fld = tb.items.find(function (el) {
                            return el.field === data[i][d_key];
                        });
                        if (fld) tableData += fld.name;
                    }
                } else {
                    tableData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
                }
                tableData += '</td>';
            }
        }
        tableData += "<td><button onclick='deleteSettingsDDL(\""+add_table_name+"\", "+data[i].id+", "+i+")'><i class='fa fa-trash-o'></i></button></td>";
        tableData += "</tr>";

        tbHiddenData += "<tr style='visibility: hidden;'>";
        tbHiddenData += '<td><span class="font-icon">`</span><b>'+ (i+1) +'</b></td>';
        for (key in headers) {
            d_key = headers[key].field;
            if (d_key != 'items') {
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
                } else
                if (d_key == 'ref_tb') {
                    var tb = tablesDropDown.find(function (el) {
                        return el.db_tb === data[i][d_key];
                    });
                    if (tb) tbHiddenData += tb.name;
                } else
                if (d_key == 'ref_tb_field' || d_key == 'comp_ref_field' || d_key == 'comp_tar_field') {
                    var cmp = (d_key == 'comp_tar_field' ? table_meta.db_tb : data[i]['ref_tb']);
                    var tb = tablesDropDown.find(function (el) {
                        return el.db_tb === cmp;
                    });
                    if (tb) {
                        var fld = tb.items.find(function (el) {
                            return el.field === data[i][d_key];
                        });
                        if (fld) tbHiddenData += fld.name;
                    }
                } else {
                    tbHiddenData += (data[i][d_key] !== null && data[i][d_key] !== undefined ? data[i][d_key] : '');
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
        if (d_key != 'items') {
            tbAddRow += '<td ' +
                'id="add_' + d_key + add_id_name + '"' +
                'data-key="' + d_key + '"' +
                'data-table="' + add_table_name + '"' +
                'data-real_val=""' +
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
            $('#tbSettingsDDL_References_headers').html(tbHiddenData);
            $('#tbSettingsDDL_References_data').html(tableData+tbAddRow);
        } else {
            $('._settings_selected_DDL_regular').show();
            $('._settings_selected_DDL_reference').hide();
            $('#tbSettingsDDL_Items_headers').html(tbHiddenData);
            $('#tbSettingsDDL_Items_data').html(tableData+tbAddRow);
        }
        ddlTabShowOptions();
    } else {
        //$('#tbSettingsDDL_addrow').html(tbAddRow+tbHiddenData);
        $('#tbSettingsDDL_headers').html(tbHiddenData);
        $('#tbSettingsDDL_data').html(tableData+tbAddRow);
    }

    changeTheme(currentTheme);
}

function showInlineEdit_REFDDL(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).data('real_val'));
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
        options = '<option></option><option>AND</option><option>OR</option>';
    } else
    if (key == 'compare') {
        options = '<option></option><option><</option><option>=</option><option>></option>';
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
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            '<option></option>';
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
    if (key == 'compare_ref_val') {
        var table_name = (idx !== undefined ? settingsDDLs[settingsDDL_selectedIndex].referencing[idx]['ref_tb'] : settingsDDL_REFObj.ref_tb);
        var table_field = (idx !== undefined ? settingsDDLs[settingsDDL_selectedIndex].referencing[idx]['comp_ref_field'] : settingsDDL_REFObj.comp_ref_field);

        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            '<option></option>';

        console.log(table_name, table_field);
        if (table_name && table_field) {
            var resp = $.ajax({
                url: baseHttpUrl + '/getDistinctData?table=' + table_name + '&field=' + table_field,
                method: 'get',
                async: false
            }).responseText;
            resp = JSON.parse(resp);
            for (var i in resp) {
                html += '<option value="'+resp[i]+'">'+resp[i]+'</option>';
            }
        }

        html += '</select>';
    }  else
    if (key == 'comp_tar_field') {
        html = '<select ' +
            'id="'+id+'_inp" ' +
            'data-key="' + $('#'+id).data('key') + '"' +
            'data-idx="' + $('#'+id).data('idx') + '"' +
            'data-table="' + $('#'+id).data('table') + '"' +
            'data-table_idx="' + $('#'+id).data('table_idx') + '"' +
            'onblur="hideInlineEdit(\''+id+'\')" ' +
            'onchange="' + (isUpdate ? 'updateSettingsDDL(\''+id+'_inp\')' : 'addSettingsDDL(\''+id+'_inp\')') + '" ' +
            'style="position:absolute;top: 0;left: 0;width: 100%;height: 100%;">' +
            '<option></option>';
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

    $('#'+id).html(html).css('width', ($('#'+id).width()+9)+'px');
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function showInlineEdit_SDDL(id, isUpdate) {
    if ($('#'+id).data('innerHTML')) {
        return;
    }

    $('#'+id).data('innerHTML', $('#'+id).data('real_val'));
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

    $('#'+id).html(html).css('width', ($('#'+id).width()+9)+'px');
    $('#'+id+'_inp').val( $('#'+id).data('innerHTML') );
    $('#'+id+'_inp').focus();
}

function updateSettingsDDL(id) {
    //update in the table view
    var show_val = document.getElementById(id).tagName == 'SELECT' ? $('#'+id+' option:selected').text() : $('#'+id).val();
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', show_val);

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
            strParams += key + '=' + btoa(params[key]) + '&';
        }
    }

    $('.loadingFromServer').show();
    $.ajax({
        method: 'GET',
        url: baseHttpUrl + '/updateTableRow?tableName=' + tableName + '&' + strParams,
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

function addSettingsDDL(id) {
    //update in the table view
    var show_val = document.getElementById(id).tagName == 'SELECT' ? $('#'+id+' option:selected').text() : $('#'+id).val();
    var par_id = id.substr(0, id.length-4);
    $('#'+par_id).data('innerHTML', show_val);

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

function saveSettingsDDLRow(tableName) {
    listViewNeedToUpdate = true;
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
            strParams += key + '=' + btoa(params[key]) + '&';
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

function ddlTabShowLists() {
    $('#ddl_tab_lists').show();
    $('#ddl_tab_options').hide();
    $('#ddl_tab_refs').hide();
    $('#ddl_tab_li_lists').addClass('active');
    $('#ddl_tab_li_options').removeClass('active');
    showInfosTab(0);
}

function ddlTabShowOptions() {
    if (settingsDDL_selectedIndex > -1 && settingsDDLs[settingsDDL_selectedIndex].type == 'referencing') {
        $('#ddl_tab_refs').show();
        $('#ddl_tab_options').hide();
    } else {
        $('#ddl_tab_options').show();
        $('#ddl_tab_refs').hide();
    }
    $('#ddl_tab_lists').hide();
    $('#ddl_tab_li_lists').removeClass('active');
    $('#ddl_tab_li_options').addClass('active');
    showInfosTab(0);
}

function showInfosTab(togl) {
    if (togl) $('#ddl_tab_infos').toggle();
    if ($('#ddl_tab_lists').is(':visible')) {
        $('#ddl_tab_infos > textarea').val( settingsDDL_notes.ddl.notes ).data('tb_id', settingsDDL_notes.ddl.id).data('type', 'ddl');
    }
    if ($('#ddl_tab_options').is(':visible')) {
        $('#ddl_tab_infos > textarea').val( settingsDDL_notes.ddl_items.notes ).data('tb_id', settingsDDL_notes.ddl_items.id).data('type', 'ddl_items');
    }
    if ($('#ddl_tab_refs').is(':visible')) {
        $('#ddl_tab_infos > textarea').val( settingsDDL_notes.cdtns.notes ).data('tb_id', settingsDDL_notes.cdtns.id).data('type', 'cdtns');
    }
}

function saveDDLTableNotes(el) {
    var notes = $(el).val();
    var id = $(el).data('tb_id');
    var type = $(el).data('type');
    settingsDDL_notes[type]['notes'] = notes;
    $.ajax({
        url: baseHttpUrl + '/updateTableRow?tableName=tb&id=' + btoa(id) + '&table_notes=' + btoa(notes),
        method: 'get'
    });
}