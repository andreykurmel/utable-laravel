
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
                "plugins": ["contextmenu", "dnd", "search"],
                "contextmenu": {
                    "items": function ($node) {
                        var type = $node.data ? $node.data.type : $node.li_attr['data-type'];
                        var title = $node.data ? $node.data.title : $node.li_attr['data-title'];
                        var menu = {};
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
                                                url: baseHttpUrl+'/menutree_addfolder?parent_id='+par_id+'&from_tab='+$tab+'&text='+btoa(inputValu),
                                                method: 'GET',
                                                success: function (resp) {
                                                    var parent = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                                    var newNode = {
                                                        text: inputValu,
                                                        icon: 'fa fa-folder',
                                                        li_attr: {
                                                            'data-type':'folder',
                                                            'data-menu_id':resp.last_id
                                                        }
                                                    };

                                                    $('#tablebar_'+$tab+'_div').jstree().create_node(parent, newNode, 'last', false, false);
                                                }
                                            });
                                        }
                                    );
                                }
                            };
                            if (title != 'SHARED') {
                                menu.edit = {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Edit",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        var par_id = elem.data ? elem.data.menu_id : elem.li_attr['data-menu_id'];
                                        var input_text = $('#tablebar_'+$tab+'_div').jstree('get_selected', true)[0].text;
                                        input_text = input_text.substr( 0, input_text.lastIndexOf(' (') );
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
                                                    url: baseHttpUrl+'/menutree_renamefolder?folder_id='+par_id+'&text='+btoa(inputValu),
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
                                        var txt = $('#tablebar_'+$tab+'_div').jstree('is_parent', elem_id) ?
                                            "All folder and table/data nodes under this folder would be completely removed! Are you sure?" :
                                            "Are you sure?";
                                        swal({
                                                title: "Delete folder",
                                                text: txt,
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
                                };
                            }
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
                                "transfer": {
                                    "separator_before": false,
                                    "separator_after": false,
                                    "label": "Transfer",
                                    "action": function (obj) {
                                        var elem_id = $('#tablebar_'+$tab+'_div').jstree('get_selected');
                                        var elem = $('#tablebar_'+$tab+'_div').jstree('get_node', elem_id);
                                        $('#transfer_table_id').val( elem.data ? elem.data.tb_id : elem.li_attr['data-tb_id'] );
                                        $('#transfer_tab').val( $tab );
                                        $('#transfer_elem_id').val( elem_id );
                                        $('#transferUserSearch').val( '' );
                                        $('.transferTableForm').show();
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
            var target = data.instance.get_node(data.node);
            var target_type = target.data ? target.data.type : target.li_attr['data-type'];
            var target_id = target.data ? target.data.menu_id : target.li_attr['data-menu_id'];

            if (sidebarPrevSelected) {

                if (target_type != 'folder') {
                    swal('Error', 'You should select folder');
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
                if (target_type == 'folder') {
                    $('#tablebar_'+$tab+'_div').jstree().toggle_node(target);
                } else {
                    var node = data.instance.get_node(data.node);
                    var path = node.data ? node.data.href : node.li_attr['data-href'];
                    location.href = path ? path : '/data/';
                }
            }
        })
        .on('ready.jstree', function() {
            //$("#tablebar_"+$tab+"_div").jstree('open_all');
        })
        .on('open_node.jstree', function(e, data) {
            var m2t_id = data.node.data ? data.node.data.menu_id : data.node.li_attr['data-menu_id'];
            $.ajax({
                url: baseHttpUrl + '/updateTableRow?tableName=menutree&id='+btoa(m2t_id)+'&state='+btoa('1'),
                method: 'get'
            });
            var icon = $('#' + data.node.id).find('i.jstree-icon.jstree-themeicon').first();
            icon.removeClass('fa-folder').addClass('fa-folder-open');
        })
        .on('close_node.jstree', function(e, data) {
            var m2t_id = data.node.data ? data.node.data.menu_id : data.node.li_attr['data-menu_id'];
            $.ajax({
                url: baseHttpUrl + '/updateTableRow?tableName=menutree&id='+btoa(m2t_id)+'&state='+btoa('0'),
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
                            url: baseHttpUrl+'/menutree_addfolder?parent_id=0&from_tab='+$tab+'&text='+btoa(inputValu),
                            method: 'GET',
                            success: function (resp) {
                                var newNode = {
                                    text: inputValu,
                                    icon: 'fa fa-folder',
                                    li_attr: {
                                        'data-type':'folder',
                                        'data-menu_id':resp.last_id
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

function popup_transfer_table() {
    var $tab = $('#transfer_tab').val(),
        $elem_id = $('#transfer_elem_id').val();

    $.ajax({
        method: 'POST',
        url: baseHttpUrl + '/transferTable',
        data: {
            'to_user_id': $('#transferUserSearch').val(),
            'table_id': $('#transfer_table_id').val()
        },
        success: function (response) {
            if (response.error) {
                swal(response.msg);
            } else {
                $('#tablebar_'+$tab+'_div').jstree().delete_node($elem_id);
            }
            $('.transferTableForm').hide();
        },
        error: function () {
            alert("Server error");
        }
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
        strParamsEdit = "tableName=tb&id="+btoa(tb_id)+"&name="+btoa(tb_name)+"&nbr_entry_listing="+btoa(tb_nbr)+"&notes="+btoa(tb_notes);

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

                if (response.msg) {
                    alert(response.msg);
                }
            },
            error: function () {
                alert("Server error");
            }
        });
    }
}

function searchInTab($tab) {
    $('#tablebar_'+$tab+'_div').jstree().search( $('#searchValInTab_'+$tab).val() );
}

function changeDataTableRowHeight(sel) {
    if (!sel) sel = 'Medium';
    $('#rh_small, #rh_med, #rh_big').attr('src', '/img/row_height_fade.png');
    if (sel == 'Small') {
        $('.table>tbody>tr>td .td_wrap').css('min-height', '30px');
        $('#rh_small').attr('src', '/img/row_height_active.png');
        localStorage.setItem('row_height', 'Small');
    } else
    if (sel == 'Medium') {
        $('.table>tbody>tr>td .td_wrap').css('min-height', '40px');
        $('#rh_med').attr('src', '/img/row_height_active.png');
        localStorage.setItem('row_height', 'Medium');
    } else
    if (sel == 'Big') {
        $('.table>tbody>tr>td .td_wrap').css('min-height', '60px');
        $('#rh_big').attr('src', '/img/row_height_active.png');
        localStorage.setItem('row_height', 'Big');
    }

    if ($('#addingIsInline').is(':checked')) {
        showDataTable(tableHeaders, tableData);
    }
    $('#rowHeightSize_Menu').hide();
}

function getGlobalOffset(direction, elem_id) {
    var std_id = $('#li_list_view').hasClass('active') ? 'divTbData' : ($('#li_favorite_view').hasClass('active') ? 'tbFavoriteDataDiv' : 'div_settings_display_body');
    var id = elem_id ? elem_id : std_id;

    var elem = document.getElementById(id), offset = 0;
    while (elem) {
        offset += elem[direction] ? elem[direction] : 0;
        elem = elem.parentNode;
    }
    return offset;
}

var stretchedtables = localStorage.getItem('stretched_tables') == '1' ? true : false;
$('#tableStretch_btn_top').css('color', !stretchedtables ? '#ccc' : '#444');
$('#tableStretch_btn_btm').css('color', stretchedtables ? '#ccc' : '#444');
$('#tbAddRow, #tbHeaders, #tbFavoriteCheckRow, #tbFavoriteHeaders').css('width', stretchedtables ? '100%' : 'auto');
$('#divTbData, #tbFavoriteDataDiv').css('min-width', stretchedtables ? '100%' : 'auto');
function tableStretch() {
    stretchedtables = !stretchedtables;
    $('#tbAddRow, #tbHeaders, #tbFavoriteCheckRow, #tbFavoriteHeaders').css('width', stretchedtables ? '100%' : 'auto');
    $('#divTbData, #tbFavoriteDataDiv').css('min-width', stretchedtables ? '100%' : 'auto');
    localStorage.setItem('stretched_tables', stretchedtables ? '1' : '0');
    $('#tableStretch_btn_top').css('color', !stretchedtables ? '#ccc' : '#444');
    $('#tableStretch_btn_btm').css('color', stretchedtables ? '#ccc' : '#444');
    showDataTable(tableHeaders, tableData);
}

function SpanColumnsWithTheSameData(id) {
    var table = $("#"+id);
    var rows = table.find($("tr"));
    var colsLength = $(rows[0]).find($("th:visible")).length;

    //mark rows for span
    var removeLaterR = new Array();
    for (var i = 0; i < rows.length-1; i++) {
        var spanIndex = 1;
        var elem = $(rows[i]).find("th:visible")[0];
        for (var j = 1; j < colsLength; j++) {
            var td = $(rows[i]).find("th:visible")[j];
            if ($(elem).text() == $(td).text()) {
                $(td).data("colspan", 1);
                removeLaterR.push(td);
                spanIndex++;
            } else {
                if (spanIndex > 1) {
                    $(elem).data("colspan", spanIndex);
                    $(elem).find("span").css('width', 'calc(100% - 27px)');
                    spanIndex = 1;
                }
                elem = td;
            }
        }

        if (spanIndex > 1) {
            $(elem).data("colspan", spanIndex);
            $(elem).find("span").css('width', 'calc(100% - 27px)');
        }
    }

    //mark columns for span
    var colOffset = 0;
    var removeLaterC = new Array();
    for (var i = 0; i < colsLength; i++) {
        var spanIndex = 1;
        var elem = $(rows[0]).find("th:visible")[i];

        if ($(elem).attr('rowspan')) {
            colOffset++;
            continue;
        }

        for (var j = 1; j < rows.length-1; j++) {

            var td = $(rows[j]).find("th:visible")[i-colOffset];
            if (!td) break;

            if (
                $(elem).text() == $(td).text()
                &&
                (
                    (!$(td).data('colspan') && !$(elem).data('colspan'))
                    ||
                    ($(td).data('colspan') == $(elem).data('colspan'))
                )
            ) {
                if ($(td).attr('rowspan')) spanIndex++;//if elem doesn`t have unit +1 to 'rowspan'
                removeLaterC.push(td);
                spanIndex++;
            } else {
                if (spanIndex > 1) {
                    $(elem).data("rowspan", spanIndex);
                    spanIndex = 1;
                }
                elem = td;
            }
        }

        if (spanIndex > 1) {
            $(elem).data("rowspan", spanIndex);
        }
    }

    //span rows and columns
    for (var i = 0; i < rows.length-1; i++) {
        for (var j = 0; j < colsLength; j++) {
            var td = $(rows[i]).find("th:visible")[j];
            if ($(td).data("colspan")) {
                $(td).attr("colspan", $(td).data("colspan") );
            }
            if ($(td).data("rowspan")) {
                $(td).attr("rowspan", $(td).data("rowspan") );
            }
        }
    }

    //delete spanned rows and columns
    for (var i in removeLaterR) {
        if (removeLaterR[i]) $(removeLaterR[i]).remove();
    }
    for (var i in removeLaterC) {
        if (removeLaterC[i]) $(removeLaterC[i]).remove();
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

//img preview on hover activate
function img_preview_activate() {
    var xOffset = 10;
    var yOffset = 20;
    $('._img_preview').on('mouseenter', function (e) {
        var img = $(this);
        img.t = img.title;
        img.title = "";
        var c = (img.t != "") ? "<br/>" + img.t : "";
        $("#_i_preview").html("<img src='" + img.attr('src') + "' alt='Image preview' style='max-width: 750px; max-height: 450px;'/>").show();
        $("#_i_preview").css({
            "top": /*(e.pageY + xOffset) +*/ "50%",
            "left": /*(e.pageX + yOffset) + */"50%",
            "transform": "translate(-50%, -50%)"
        });
    });
    $('._img_preview').on('mouseleave', function (e) {
        if (e.relatedTarget.id != '_i_preview' && e.relatedTarget.parentNode.id != '_i_preview') {
            $('#_i_preview').html('').hide();
        }
    });
    $('._img_preview').removeClass('_img_preview');
}
$('#_i_preview').on('mouseleave', function (e) {
    $('#_i_preview').html('').hide();
});

$(document).on('click', function (e) {
    if (e.target.id != 'download_icon') {
        $('#download_menu').hide();
    }
    if (e.target.id != 'theme_img') {
        $('#theme_menu').hide();
    }
    if (e.target.id != 'rowHeightSize') {
        $('#rowHeightSize_Menu').hide();
    }
    if (e.target.id != 'showHideColumnsList_img') {
        $('#showHideColumnsList').hide();
    }
});

//-------------- change app theme
function changeTheme(name) {
    if (name == 'light') {
        $('.navbar, .div-screen').css('background-color', 'transparent');
        $('.white-bg').css('background-color', '#f1f3f4');
        $('.table>tbody>tr>td').css('background-color', 'inherit');
        currentTheme = 'light';
    } else
    if (name == 'dark') {
        $('.navbar, .div-screen').css('background-color', '#ccc');
        $('.white-bg').css('background-color', '#a1a3a4');
        $('.table>tbody>tr>td').css('background-color', '#ddd');
        currentTheme = 'dark';
    }
}

function hideEditPopUp() {
    if (were_uploaded_files) {
        were_uploaded_files = false;
        changePage(selectedPage + 1);
    }
}

function saveTableOwnerNotes(el) {
    var notes = $(el).val();
    $.ajax({
        url: baseHttpUrl + '/updateTableRow?tableName=tb_notes&id=' + btoa(table_notes_owner_id) + '&notes=' + btoa(notes),
        method: 'get'
    });
}

function saveTableNotes(el) {
    var notes = $(el).val();
    $.ajax({
        url: baseHttpUrl + '/updateTableRow?tableName=tb_notes&id=' + btoa(table_notes_user_id) + '&notes=' + btoa(notes),
        method: 'get'
    });
}

function getUnitConversion(conv, val) {
    if (conv._u_opr == 'add') {
        return val + conv._u_factor;
    }
    if (conv._u_opr == 'substract') {
        return val - conv._u_factor;
    }
    if (conv._u_opr == 'divide') {
        return val / conv._u_factor;
    }
    if (conv._u_opr == 'multiply') {
        return val * conv._u_factor;
    }
    return '';
}

function getRevConversion(conv, val) {
    if (conv._u_opr == 'add') {
        return val - conv._u_factor;
    }
    if (conv._u_opr == 'substract') {
        return val + conv._u_factor;
    }
    if (conv._u_opr == 'divide') {
        return val * conv._u_factor;
    }
    if (conv._u_opr == 'multiply') {
        return val / conv._u_factor;
    }
    return '';
}




function saveView() {
    swal({
            title: "New table view",
            text: "Write name for current view:",
            type: "input",
            showCancelButton: true,
            closeOnConfirm: true,
            animation: "slide-from-top",
            inputPlaceholder: "View name"
        },
        function (inputValu) {
            if (inputValu === false) return false;

            if (inputValu === "") {
                swal.showInputError("You need to write something!");
                return false
            }

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
                url: baseHttpUrl+'/saveTableView',
                method: 'POST',
                data: {
                    table_id: table_meta.id,
                    view_name: inputValu,
                    table: selectedTableName,
                    page: selectedPage,
                    hdrs: btoa(JSON.stringify(tableHeaders)),
                    filters: btoa(JSON.stringify(filtersData)),
                    querys: btoa(JSON.stringify(query))
                },
                success: function (resp) {
                    /*var newNode = {
                     text: inputValu,
                     icon: 'fa fa-folder',
                     li_attr: {
                     'data-type':'folder',
                     'data-menu_id':resp.last_id
                     }
                     };

                     $('#tablebar_'+$tab+'_div').jstree().create_node('#', newNode, 'last', false, false);*/
                }
            });
        }
    );
}