
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
    event.preventDefault();

    var data = new FormData();
    var data_csv = $('#import_data_csv').val();
    var file_link = $('#import_file_link').val();

    if (!is_upload && !data_csv) {
        //if no file for upload and file didn`t uploaded before - return
        return false;
    }

    if (is_upload) {
        var status = ($('#import_action_type').val() != '/modifyTable' ? true : false);
        $('.js-import_chb').each(function (i, elem) {
            if (status) $(elem).prop('disabled', false);
            if (i == 0) $(elem).prop('disabled', false);
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
            if (is_upload != 2) {//fill table only on clicking 'import'
                return;
            }

            if ($('#import_action_type').val() != '/modifyTable') {
                if ($('#import_action_type').val() == '/createTable') {
                    $('#import_table_name').val(resp.filename);
                    $('#import_table_db_tb').val(resp.filename);
                }

                var fieldlist = [];
                //fieldlist.push({'name':'ID', 'field':'id', 'type':'Auto Number', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                $.each(resp.headers, function(i, hdr) {
                    fieldlist.push({'name':hdr.header, 'field':hdr.field, 'type':hdr.type, 'auto':0, 'size':hdr.size, 'default':hdr.default, 'required':hdr.required});
                });
                /*fieldlist.push({'name':'Created By', 'field':'createdBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Created On', 'field':'createdOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Modified By', 'field':'modifiedBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Modified On', 'field':'modifiedOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});*/

                var html = '', imp_type = $('#import_type_import').val();
                $.each(fieldlist, function(i, hdr) {
                    html += '<tr id="import_columns_'+i+'" '+(hdr.field == 'createdBy' ? 'class="js-import-col-createdBy"' : '')+'>'+
                        '<td><input type="text" class="form-control _freeze_for_modify" name="columns['+i+'][header]" value="'+hdr.name+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                        '<input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                        '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td class="js-import_column-orders" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
                        '<select class="form-control _freeze_for_remote" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()" '+(hdr.auto ? 'readonly' : '')+'></select>' +
                        '</td>' +
                        '<td><select class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][type]" onchange="import_row_type_changed(this)" '+(hdr.auto ? 'readonly' : '')+'>';
                    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
                        html += '<option '+(hdr.type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
                    }
                    html += '</select></td>' +
                        '<td><input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][size]" value="'+(hdr.size ? hdr.size : '')+'" '+(hdr.auto || $.inArray(hdr.type, ['Date','Date Time','Auto Number','Attachment']) != -1 ? 'readonly' : '')+'></td>' +
                        '<td><input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][default]" value="'+hdr.default+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="checkbox" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][required]" '+(hdr.required ? 'checked' : '')+' '+(hdr.auto ? 'readonly' : '')+' onchange="import_chaged_req(this)"></td>' +
                        '<td>' +
                        '<input type="hidden" id="import_columns_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
                        '<button type="button" class="btn btn-default _freeze_for_modify _freeze_for_remote" onclick="import_del_row('+i+')">&times;</button>' +
                        '</td>' +
                        '</tr>';
                });
                $('#import_table_body').html(html);
            }

            if (!resp.error) {
                ddl_col_numbers = [];
                $.each(resp.headers, function(i, hdr) {
                    ddl_col_numbers.push(hdr.header ? hdr.header : 'col#'+i);
                });
            }

            import_show_col_tab();
            changeImportStyle( $('#import_type_import') );
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
                //fieldlist.push({'name':'ID', 'field':'id', 'type':'Auto Number', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                $.each(resp.headers, function(i, hdr) {
                    fieldlist.push({'name':hdr.header, 'field':hdr.field, 'type':hdr.type, 'auto':0, 'size':hdr.size, 'default':hdr.default, 'required':hdr.required});
                });
                /*fieldlist.push({'name':'Created By', 'field':'createdBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Created On', 'field':'createdOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Modified By', 'field':'modifiedBy', 'type':'Integer', 'auto':1, 'size':'', 'default':'auto', 'required':1});
                 fieldlist.push({'name':'Modified On', 'field':'modifiedOn', 'type':'Date', 'auto':1, 'size':'', 'default':'auto', 'required':1});*/

                var html = '', imp_type = $('#import_type_import').val();
                $.each(fieldlist, function(i, hdr) {
                    html += '<tr id="import_columns_'+i+'" '+(hdr.field == 'createdBy' ? 'class="js-import-col-createdBy"' : '')+'>'+
                        '<td><input type="text" class="form-control _freeze_for_modify" name="columns['+i+'][header]" value="'+hdr.name+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td>' +
                        '<input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                        '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="'+hdr.field+'" '+(hdr.auto ? 'readonly' : '')+'>' +
                        '</td>' +
                        '<td class="js-import_column-orders" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
                        '<select class="form-control _freeze_for_remote" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()" '+(hdr.auto ? 'readonly' : '')+'></select>' +
                        '</td>' +
                        '<td><select class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][type]" onchange="import_row_type_changed(this)" '+(hdr.auto ? 'readonly' : '')+'>';
                    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
                        html += '<option '+(hdr.type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
                    }
                    html += '</select></td>' +
                        '<td><input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][size]" value="'+(hdr.size ? hdr.size : '')+'" '+(hdr.auto || $.inArray(hdr.type, ['Date','Date Time','Auto Number','Attachment']) != -1 ? 'readonly' : '')+'></td>' +
                        '<td><input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][default]" value="'+hdr.default+'" '+(hdr.auto ? 'readonly' : '')+'></td>' +
                        '<td><input type="checkbox" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][required]" '+(hdr.required ? 'checked' : '')+' '+(hdr.auto ? 'readonly' : '')+' onchange="import_chaged_req(this)"></td>' +
                        '<td>' +
                        '<input type="hidden" id="import_columns_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
                        '<button type="button" class="btn btn-default _freeze_for_modify _freeze_for_remote" onclick="import_del_row('+i+')">&times;</button>' +
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
                $('#import_data_csv').val(1);
                ddl_col_numbers = [];
                $.each(resp.headers, function(i, hdr) {
                    ddl_col_numbers.push(hdr.header ? hdr.header : 'col#'+i);
                });
                import_show_col_tab();
                changeImportStyle( $('#import_type_import') );
            } else {
                $('#import_data_csv').val('');
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
        '<input type="text" class="form-control _freeze_for_modify" name="columns['+i+'][header]" value="'+$('#import_columns_add_header').val()+'">' +
        '</td>' +
        '<td>' +
        '<input type="text" class="form-control _freeze_for_modify _freeze_for_remote" id="import_columns_'+i+'_field_val" name="columns['+i+'][field]" value="'+$('#import_columns_add_field').val()+'">' +
        '<input type="hidden" class="form-control" name="columns['+i+'][old_field]" value="">' +
        '</td>' +
        '<td class="js-import_column-orders import_not_reference_columns" '+(imp_type == 'csv' || imp_type == 'mysql' ? '' : 'style="display:none;"')+'>' +
        '<select class="form-control _freeze_for_remote" name="columns['+i+'][col]" onfocus="show_import_cols_numbers()">'+option_col+'</select>' +
        '</td>' +
        '<td><select class="form-control _freeze_for_modify _freeze_for_remote" onchange="import_row_type_changed(this)" name="columns['+i+'][type]">';
    for (var jdx = 0; jdx < importTypesDDL.length; jdx++) {
        html += '<option '+(inputed_type == importTypesDDL[jdx].option ? 'selected="selected"' : '')+'>'+importTypesDDL[jdx].option+'</option>';
    }
    html += '</select></td>' +
        '<td>' +
        '<input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][size]" value="'+$('#import_columns_add_size').val()+'" '+($.inArray(inputed_type, ['Date','Date Time','Auto Number','Attachment']) != -1 ? 'readonly' : '')+'>' +
        '</td>' +
        '<td class="import_not_reference_columns" '+(imp_type != 'ref' ? '' : 'style="display:none;"')+'>' +
        '<input type="text" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][default]" value="'+$('#import_columns_add_default').val()+'">' +
        '</td>' +
        '<td class="import_not_reference_columns" '+(imp_type != 'ref' ? '' : 'style="display:none;"')+'>' +
        '<input type="checkbox" class="form-control _freeze_for_modify _freeze_for_remote" name="columns['+i+'][required]" '+($('#import_columns_add_required').is(':checked') ? 'checked="checked"' : '')+' onchange="import_chaged_req(this)">' +
        '</td>' +
        '<td>' +
        '<input type="hidden" id="import_columns_ref_deleted_'+i+'" name="columns['+i+'][stat]" value="add">' +
        '<button type="button" class="btn btn-default _freeze_for_modify _freeze_for_remote" onclick="import_del_row('+i+')">&times;</button>' +
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
            '<td><input id="import_columns_ref_type_'+i+'" disabled class="form-control" type="text" value="'+(found_field ? found_field.f_type : '')+'"></td>' +
            '<td><input id="import_columns_ref_maxlen_'+i+'" disabled class="form-control" type="text" value="'+(found_field ? found_field.f_size : '')+'"></td>' +
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
    $('#import_columns_ref_type_'+data_idx).val( found_field ? found_field.f_type : ''  );
    $('#import_columns_ref_maxlen_'+data_idx).val( found_field ? found_field.f_size : '' );
}

function import_del_row(idx) {
    swal({
            title: "Delete field",
            text: 'Confirm to delete a field in the table? Deleting a field can’t be recovered!',
            showCancelButton: true,
            closeOnConfirm: true
        },
        function ($confirmed) {
            if ($confirmed) {
                $('#import_columns_'+idx).hide();
                $('#import_columns_deleted_'+idx).val('del');
                if ($('#import_type_import').val() == 'ref' && $importReferences) {
                    var del_field = $('#import_columns_'+idx+'_field_val').val();
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
    $('#import_form_save_btn').attr('disabled', true);
}

function import_show_col_tab() {
    $('#import_li_col_tab').addClass('active');
    $('#import_li_csv_tab').removeClass('active');
    $('#import_col_tab').show();
    $('#import_csv_tab').hide();
    var type = $('#import_type_import').val() || (table_meta.source ? table_meta.source : 'scratch'),
        stat = false;
    if (type == 'mysql' || type == 'remote') {
        if ($('#import_data_csv').val() != 1) {
            stat = true;
        }
    }
    if (type == 'csv') {
        if (!$('#import_data_csv').val() || $('#import_data_csv').val() == 1) {
            stat = true;
        }
    }
    $('#import_form_save_btn').attr('disabled', stat);
}

var notes = {
    scratch: 'To build a new data table from scratch by adding fields or update the fields for an existing data/table.',
    csv: {
        '/replaceTable': 'Import data from a CSV file with data table fields given or not. If data/table fields not given in the CSV file or not checked to use in the , user can define those in the field settings tab. Any existing data/table info will be completely deleted.',
        '/modifyTable': 'Add the data of selected fields from the imported CSV file to the existing data/table. No change to the table fields.'
    },
    mysql: {
        '/replaceTable': 'Import data of selected fields of  a MySQL data table from local or remote server OR uploading a mysql file. The same table fields and data format will be used. User to define table head names. User can add or remove field(s) for importing.',
        '/modifyTable': 'Import data of selected fields of  a MySQL table from local or remote server OR uploading a mysql file and append the data to the existing data table.'
    },
    remote: 'To retrieve data from a MySQL table from a local or remote server. No data table will be created (copied) to local. Only management data will be created.',
    ref: 'To glue the data of selected fields from multiple existing data tables, public or private, through the defined field correspondences between current data table and a selected source data table. Glue means putting the data records of one data table after another into current data table. The data records for a given source data table can be updated by deleting existing referencing and re-importing (add referencing record and then import).'
};

function changeImportStyle(sel) {
    var style = $(sel).val() || (table_meta.source ? table_meta.source : 'scratch'),
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
        $('#import_notes_label').html( notes[style] );
        $('#import_li_method_a').html('Method (Build/Update)');

        $('._freeze_for_modify, ._freeze_for_remote').attr('readonly', false).attr('disabled', false);
        $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', false);

        $('#import_columns_row_add').show();
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
        $('#import_notes_label').html( notes[style][action] );
        $('#import_li_method_a').html('Method (CSV Import/'+(action == '/replaceTable' ? 'New' : 'Append')+')');

        $('._freeze_for_modify, ._freeze_for_remote').attr('readonly', false).attr('disabled', false);
        if ($('#import_data_csv').val() && $('#import_data_csv').val() != 1) {
            $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', false );
            $('._freeze_for_modify').attr('readonly', action == '/modifyTable');
            $('button._freeze_for_modify, select._freeze_for_modify, input[type="checkbox"]._freeze_for_modify').attr('disabled', action == '/modifyTable');
        } else {
            $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', true );
        }
        (action == '/modifyTable' ? $('#import_columns_row_add').hide() : $('#import_columns_row_add').show() );
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
        $('#import_notes_label').html( notes[style][action] );
        $('#import_li_method_a').html('Method (MySQL Import/'+(action == '/replaceTable' ? 'New' : 'Append')+')');

        $('._freeze_for_modify, ._freeze_for_remote').attr('readonly', false).attr('disabled', false);
        if ($('#import_data_csv').val() == 1) {
            $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', false );
            $('._freeze_for_modify').attr('readonly', action == '/modifyTable');
            $('button._freeze_for_modify, select._freeze_for_modify, input[type="checkbox"]._freeze_for_modify').attr('disabled', action == '/modifyTable');
        } else {
            $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', true );
        }
        (action == '/modifyTable' ? $('#import_columns_row_add').hide() : $('#import_columns_row_add').show() );
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
        $('#import_notes_label').html( notes[style] );
        $('#import_li_method_a').html('Method (Remote MySQL)');

        $('._freeze_for_modify, ._freeze_for_remote').attr('readonly', false).attr('disabled', false);
        $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', ($('#import_data_csv').val() == 1 ? false : true) );

        $('._freeze_for_remote').attr('readonly', true);
        $('input[type="checkbox"]._freeze_for_remote').attr('checked', true);
        $('#import_columns_row_add').hide();
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
        $('#import_notes_label').html( notes[style] );
        import_show_col_tab();
        $('#import_li_method_a').html('Method (Referencing)');

        $('._freeze_for_modify, ._freeze_for_remote').attr('readonly', false).attr('disabled', false);
        $('#import_main_columns input, #import_main_columns select, #import_main_columns button').attr('disabled', false);

        $('#import_columns_row_add').show();
    }

    freeze_size_columns();

    var key = getConnNoteKey(style, action);
    $('#import_method_notes').val( table_meta.conn_notes && table_meta.conn_notes[key] ? table_meta.conn_notes[key] : '' );
}

function changeImportAction (sel) {
    var action = $(sel).val(),
        type = $('#import_type_import').val(),
        status = (action == '/modifyTable' ? true : false);
    $('.js-import_chb').each(function (i, elem) {
        if (i > 0) $(elem).prop('disabled', status);
    });

    if (type == 'csv') $('#import_li_method_a').html('Method (CSV Import/'+(action == '/replaceTable' ? 'New' : 'Append')+')');
    if (type == 'mysql') $('#import_li_method_a').html('Method (MySQL Import/'+(action == '/replaceTable' ? 'New' : 'Append')+')');

    $('._freeze_for_modify').attr('readonly', status);
    $('button._freeze_for_modify, input[type="checkbox"]._freeze_for_modify, select._freeze_for_modify').attr('disabled', status);
    (status ? $('#import_columns_row_add').hide() : $('#import_columns_row_add').show() );

    $('#import_notes_label').html( notes[type][action] );

    var key = getConnNoteKey(type, action);
    $('#import_method_notes').val( table_meta.conn_notes && table_meta.conn_notes[key] ? table_meta.conn_notes[key] : '' );

    freeze_size_columns();
}

function freeze_size_columns() {
    var selects = $('#import_main_columns select');
    for (var i = 0; i < selects.length; i++) {
        if ($.inArray($(selects[i]).val(), ['Date','Date Time','Auto Number','Attachment']) != -1) {
            var sibling_inp = $(selects[i].parentNode.nextElementSibling).find('input').first();
            $(sibling_inp).prop('readonly', true);
        }
    }
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
            url: baseHttpUrl + '/updateTableRow?tableName=tb&id=' + btoa(table_meta.id) + '&conn_notes=' + btoa(JSON.stringify(table_meta.conn_notes))
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

var canSubmit = false;
function import_form_submit (form) {
    if (canSubmit) {
        return true;
    } else {
        event.preventDefault();
        var action = $('#import_action_type').val(),
            type = $('#import_type_import').val();
        if (tableData.length && action == '/replaceTable' && (type == 'csv' || type == 'mysql')) {
            swal({
                    title: "Import Data",
                    text: "Are you sure to remove all existing data and import new?",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Yes",
                    showCancelButton: true,
                    closeOnConfirm: true,
                    animation: "slide-from-top"
                },
                function (confirmed) {
                    if (confirmed) {
                        set_submit_action();
                        canSubmit = true;
                        $(form).submit();
                    } else {
                        canSubmit = false;
                        return false;
                    }
                }
            );
        } else {
            set_submit_action();
            canSubmit = true;
            $(form).submit();
        }
    }
}

function set_submit_action() {
    var action, type = $('#import_type_import').val();
    if (type == 'scratch') {
        action = baseHttpUrl + '/modifyTable';
    } else if (type == 'csv' || type == 'mysql') {
        action = baseHttpUrl + $('#import_action_type').val();
    } else if (type == 'remote') {
        action = baseHttpUrl + '/remoteTable';
    } else if (type == 'ref') {
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

function import_toggle_all_req() {
    if ($('#import_check_all_req').is(':checked')) {
        $('#import_main_columns tbody input[type="checkbox"]').prop('checked', true);
    } else {
        $('#import_main_columns tbody input[type="checkbox"]').prop('checked', true);
    }
}

function import_chaged_req(elem) {
    if($(elem).is(':checked')) $('#import_check_all_req').prop('checked',false);
}

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

function import_row_type_changed(sel) {
    var type = $(sel).val();
    var sibling_inp = $(sel.parentNode.nextElementSibling).find('input').first();
    if ($.inArray(type, ['Date','Date Time','Auto Number','Attachment']) != -1) {
        $(sibling_inp).prop('readonly', true);
    } else {
        $(sibling_inp).prop('readonly', false);
    }
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
        swal({
            title: "Warning!",
            text: "You should select reference table and field."
        });
    }
}