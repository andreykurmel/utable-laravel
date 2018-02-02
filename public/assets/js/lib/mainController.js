app.controller('myCtrl', ['$scope', 'API', '$location', '$routeParams','$route','$timeout', function ($scope, API, $location, $routeParams,$route,$timeout) {
    var editableFields = { 'st': 'site_id', 'tracker':'rqst_date' };
    var filterData = [];
    var tower_types = {'Monopole': 'mp.png', 'Self Support': 'sst.png', 'Guyed': 'gt.png'};
    var setAllNullObj = function (obj) {
        Object.keys(obj).forEach(function(k) {
            obj[k] = null;
        });
    };
    $scope.changedFilter = false;
    $scope.showFilterTabs = [];
    $scope.uTables = [];
    $scope.uTableSettings = [];
    $scope.uTableSettingsName = "tb_settings";
    $scope.uTableSettingsId = 0;
    $scope.settingsData = [];
    $scope.settingsDDLs = [];
    $scope.settingsPage = 0;
    $scope.selectedTableName = "";
    $scope.selectedTableRows = 0;
    $scope.selectedTableId = 0;
    $scope.sortType = "";
    $scope.sortSettingsType = "";
    $scope.addObj = {};
    $scope.filterObj = {};
    $scope.filterData = [];
    $scope.filterFields = [];
    $scope.filterMaxHeight = 0;
    $scope.tableDDLs = [];
    $scope.urlRoute = $route;
    $scope.showModal = $scope.showColumnsMenu = $scope.showSearchType = $scope.filterMenuHide = $scope.loadingfromserver = $scope.showAddRow = false;
    $scope.sumArr = [];
    $scope.visibleColumns = {};
    $scope.showEntries = [10, 20, 50, 100];
    $scope.selectedEntries = 10;
    $scope.selectedPage = 0;
    $scope.paginateBtns = [];
    $scope.markerBounds = {top:0, left:0, right:0, bottom:0};
    $scope.markers = [];
    $scope.searchKeyword = "";
    $scope.searchSettingsKeyword = "";

    $scope.initMap = function () {
        var avg_lat = (Number($scope.markerBounds.top) + Number($scope.markerBounds.bottom)) / 2;
        var avg_lng = (Number($scope.markerBounds.left) + Number($scope.markerBounds.right)) / 2;
        var optionsMap = {
            zoom: 6,
            center: {lat: avg_lat, lng: avg_lng}
        };

        $scope.mapapp = new google.maps.Map(document.getElementById('map-google'), optionsMap);

        $scope.markers = [];
        var iconbasepath = "assets/img/tables/", icon_path;
        for (var i=0; i<$scope.selectedTableData.length; i++) {
            if ($scope.selectedTableData[i].lat_dec && $scope.selectedTableData[i].long_dec) {
                if ($scope.selectedTableData[i].twr_type && tower_types[$scope.selectedTableData[i].twr_type]) {
                    icon_path = iconbasepath + tower_types[$scope.selectedTableData[i].twr_type];
                } else {
                    icon_path = iconbasepath + "cell_id.png";
                }
                $scope.markers[i] = new google.maps.Marker({
                    position: {lat: Number($scope.selectedTableData[i].lat_dec), lng: Number($scope.selectedTableData[i].long_dec)},
                    map: $scope.mapapp,
                    icon: icon_path
                });
            }
        }
    };

    $scope.initDetailsMap = function () {
        var avg_lat = (Number($scope.markerBounds.top) + Number($scope.markerBounds.bottom)) / 2;
        var avg_lng = (Number($scope.markerBounds.left) + Number($scope.markerBounds.right)) / 2;
        var optionsMap = {
            zoom: 6,
            center: {lat: avg_lat, lng: avg_lng}
        };

        $scope.mapapp = new google.maps.Map(document.getElementById('map-details'), optionsMap);

        var icon_path = "assets/img/tables/";
        if ($scope.editData.twr_type && tower_types[$scope.editData.twr_type]) {
            icon_path += tower_types[$scope.editData.twr_type];
        } else {
            icon_path += "cell_id.png";
        }
        $scope.detailsMarker = new google.maps.Marker({
            position: {lat: Number($scope.editData.lat_dec), lng: Number($scope.editData.long_dec)},
            map: $scope.mapapp,
            icon: icon_path
        });
    };

    $scope.toggleColumns = function () {
        $scope.showColumnsMenu = !$scope.showColumnsMenu;
    };

    $scope.toggleSearchType = function () {
        $scope.showSearchType = !$scope.showSearchType;
    };

    $scope.selectTable = function(tableName) {
        $scope.loadingfromserver = true;
        $scope.selectedPage = 0;
        $scope.searchKeyword = "";
        $location.path("/" + tableName);
        $scope.selectedTableName = tableName;
        for (var i=0; i < $scope.uTables.length; i++) {
            if ($scope.uTables[i].db_tb == tableName) {
                $scope.selectedTableId = $scope.uTables[i].id;
            }
        }
        API.selectedTable(tableName, $scope.selectedEntries).then(function(response){
            if (response.status == 200 && response.data.key.length > 0) {
                $scope.selectedTableData = [];
                $scope.sumArr = [];
                $scope.settingsData = [];
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = response.data.rows;
                $scope.filterData = response.data.filters;
                $scope.tableDDLs = response.data.ddls;
                angular.copy($scope.selectedTableData[0],$scope.addObj);
                setAllNullObj($scope.addObj);
                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId) {
                        $scope.settingsData.push($scope.uTableSettings[l]);
                    }
                }
                console.log("response",response.data);
                var maxPage = Math.ceil($scope.selectedTableRows/$scope.selectedEntries);

                $scope.paginateBtns = [];
                var idx = 1;
                var maxStep = Math.min(5, maxPage);
                while (idx <= maxStep) {
                    $scope.paginateBtns.push(idx);
                    idx++;
                }
                if (idx < maxPage) {
                    $scope.paginateBtns.push('...');
                    $scope.paginateBtns.push(maxPage);
                }

                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].sum == 'Yes') {
                        $scope.sumArr.push({ "key": $scope.uTableSettings[l].field, "total": 0 });
                    }
                }

                for (var k = 0; k < $scope.selectedTableData.length;k++) {
                    if ($scope.selectedTableData[k].lat_dec) {
                        if ($scope.markerBounds.top == 0 || $scope.markerBounds.top < $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.top = $scope.selectedTableData[k].lat_dec
                        }
                        if ($scope.markerBounds.bottom == 0 || $scope.markerBounds.bottom > $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.bottom = $scope.selectedTableData[k].lat_dec
                        }
                    }
                    if ($scope.selectedTableData[k].long_dec) {
                        if ($scope.markerBounds.left == 0 || $scope.markerBounds.left < $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.left = $scope.selectedTableData[k].long_dec
                        }
                        if ($scope.markerBounds.right == 0 || $scope.markerBounds.right > $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.right = $scope.selectedTableData[k].long_dec
                        }
                    }
                    $scope.selectedTableData[k].isFilter = true;
                    for (var m = 0; m < $scope.sumArr.length;m++) {
                        if ($scope.selectedTableData[k][$scope.sumArr[m].key] && !isNaN($scope.selectedTableData[k][$scope.sumArr[m].key])) {
                            $scope.sumArr[m].total += Number($scope.selectedTableData[k][$scope.sumArr[m].key]);
                        }
                    }
                }

                $scope.filterMaxHeight = $("#acd-filter-menu").height() - $scope.filterData.length * 40;

                var allCols=response.data.key;
                var template="<ul class='list' id='ul-cols-list'>";
                $.each(allCols,function(i,col){
                    if ($scope.checkWeb(col)) {
                        $scope.visibleColumns[col] = true;
                        template+='<li><input id="'+col+'visibility" class="checkcols" data-name="'+col+'" type="checkbox" value="'+col+'" checked >  <label class="labels" for="'+col+'visibility"> '+$scope.getColumnName(col)+' </label></li>';
                    }
                });
                template +="</ul>";
                $('#block-cols-list').html("");
                $('#block-cols-list').append(template);
                $('.checkcols').on('click',function(e){
                    var colName = $(e.currentTarget).data('name');
                    $scope.visibleColumns[colName] = !$scope.visibleColumns[colName];
                    $scope.$apply();
                })
            }
            else {
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later "+ response.statusText);
                }
            }
            $scope.loadingfromserver = false;
        })
    }

    API.getUtables().then(function(response){
        if(response.status == 200) {
            $scope.uTables = response.data.utables;
            $scope.uTableSettings = response.data.utablesettings;
            $scope.settingsDDLs = response.data.ddls;

            for (var l = 0; l < $scope.uTables.length; l++) {
                if ($scope.uTables[l].db_tb == $scope.uTableSettingsName) {
                    $scope.uTableSettingsId = $scope.uTables[l].id
                }
            }

            if ($location.path()) {
                $scope.selectTable($location.path().substr(1));
            }

            $(".table_body_viewport").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "3d",
                scrollInertia: 300,
                axis: "y"
            });
        }
        else {
            alert("Please Try again Later "+ response.statusText);
        }

    })

    $scope.checkWeb = function(params){
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim(), 'web': 'Yes' });
            return lodObj ? 1 : 0;
        } else {
            return 0;
        }
    }

    $scope.checkSettingsWeb = function(params){
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim(), 'web': 'Yes' });
            return lodObj ? 1 : 0;
        } else {
            return 0;
        }
    }

    $scope.checkVisible = function(params){
        return $scope.visibleColumns[params];
    };

    $scope.getColumnName = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.name;
        } else {
            return 0;
        }
    }

    $scope.getSettingsName = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim() });
            return lodObj.name;
        } else {
            return 0;
        }
    }

    $scope.getColumnInputType = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.input_type;
        } else {
            return 0;
        }
    }

    $scope.getSettingsInputType = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.uTableSettingsId, 'field': params.trim() });
            return lodObj.input_type;
        } else {
            return 0;
        }
    }

    $scope.getColumnValue = function (params) {
        if (_.find) {
            var lodObj = _.find($scope.uTableSettings, { 'tb_id': $scope.selectedTableId, 'field': params.trim() });
            return lodObj.value;
        } else {
            return 0;
        }
    }

    $scope.sort = function(name){
        $scope.sortType = name;
    }

    $scope.sortSettings = function(name){
        $scope.sortSettingsType = name;
    }

    $scope.filterTable = function(filterObj,value,status) {
        var allStatus = status;
        if (allStatus) {
            filterObj.val.forEach(function(item){
                if (!item.checked) {
                    allStatus = false;
                }
            })
        }
        filterObj.checkAll = allStatus;

        //get filtered data
        $scope.changedFilter = {
            name: filterObj.key,
            val: value,
            status: status
        };
        $scope.changePage(1);
    }

    $scope.filterCheckAll = function (filterObj){
        filterObj.val.forEach(function(item){
            item.checked = filterObj.checkAll;
        })

        //get filtered data
        $scope.changedFilter = {
            name: filterObj.key,
            val: "all",
            status: filterObj.checkAll
        };
        $scope.changePage(1);
    }

    $scope.editSelectedData = function(item,index){
        $scope.editItemIndex = index;
        $scope.editData = item;
        $scope.showModal = true;
    }

    $scope.isEditable = function(fieldName,tableName){
        if(fieldName != "id") {
            return true;
        }
        return false;
    }

    $scope.updateRow = function(tableObj, hidden){
        var selectedTableObj = {};
        if (!tableObj.id) {
            if (!hidden) {
                alert("There is no 'ID' for update");
            }
            return;
        }
        angular.copy(tableObj,selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.updateRow(strParams).then(function(response){
            console.log("response",response);
            if (!hidden) {
                if (response.data.hasOwnProperty("error") && response.data.error) {
                    alert(response.data.msg);
                }else {
                    alert(response.data.msg);
                }
            }
        })
    }

    $scope.updateSettingsRow = function(tableObj){
        var selectedTableObj = {};
        if (!tableObj.id) {
            return;
        }
        angular.copy(tableObj,selectedTableObj);
        selectedTableObj.tableName = $scope.uTableSettingsName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.updateRow(strParams).then(function(response){
            console.log("response",response);
        })
    }

    $scope.addRow = function(tableObj){
        var selectedTableObj = {};
        angular.copy(tableObj,selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.addRow(strParams).then(function(response){
            console.log("response",response);
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            }else {
                alert(response.data.msg);
                return response.data.last_id;
            }
        })
    }

    $scope.closeModal = function(){
        $scope.showModal = false;
    }

    $scope.checkIfVisible = function(param) {
        for (var l = 0; l < $scope.uTableSettings.length; l++) {
            if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].field == param && param != 'id') {
                return true;
            }
        }
        return false;
    }

    $scope.deleteRow = function(params){
        API.deleteRow({ id: params.id, tableName: $scope.selectedTableName }).then(function(response){
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            } else {
                $scope.selectedTableData.splice($scope.editItemIndex, 1);
                alert(response.data.msg);
                $scope.showModal = false;
            }
        });
    }

    $scope.ifSum = function(field){
        for (var i = 0; i < $scope.sumArr.length; i++) {
            if ($scope.sumArr[i].key.toLowerCase() == field.toLowerCase()) {
                return true;
            }
        }
        return false;
    }

    $scope.getSum = function(field){
        for (var i = 0; i < $scope.sumArr.length; i++) {
            if ($scope.sumArr[i].key.toLowerCase() == field.toLowerCase()) {
                return $scope.sumArr[i].total;
            }
        }
        return false;
    }

    $scope.changeEntries = function (val) {
        $scope.selectedEntries = val;
        $scope.changePage(1);
        $scope.changeSettingsPage(1);
    }

    $scope.changePage = function (page) {
        $scope.loadingfromserver = true;

        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0],TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        page = Math.ceil(page);
        $scope.selectedPage = page-1;

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
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

        API.changePage($scope.selectedTableName, page-1, $scope.selectedEntries, query, TableKeysObj, $scope.filterData, $scope.changedFilter).then(function(response){
            if (response.status == 200 && response.data.key) {
                $scope.changedFilter = false;
                $scope.sumArr = [];
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = response.data.rows;
                $scope.filterData = response.data.filters;
                angular.copy($scope.selectedTableData[0],$scope.addObj);
                setAllNullObj($scope.addObj);
                var maxPage = Math.ceil($scope.selectedTableRows/$scope.selectedEntries);

                $scope.paginateBtns = [];
                if (page < 5) {
                    var idx = 1;
                    var maxStep = Math.min(5, maxPage);
                    while (idx <= maxStep) {
                        $scope.paginateBtns.push(idx);
                        idx++;
                    }
                    if (idx < maxPage) {
                        $scope.paginateBtns.push('...');
                        $scope.paginateBtns.push(maxPage);
                    }
                } else {
                    if (page > (maxPage-5)) {
                        if (maxPage > 5) {
                            $scope.paginateBtns.push(1);
                            $scope.paginateBtns.push('...');
                        }
                        var idx = maxPage-5;
                        while (idx <= maxPage) {
                            $scope.paginateBtns.push(idx);
                            idx++;
                        }
                    } else {
                        $scope.paginateBtns.push(1);
                        $scope.paginateBtns.push('...');
                        $scope.paginateBtns.push(page - 1);
                        $scope.paginateBtns.push(page);
                        $scope.paginateBtns.push(page + 1);
                        $scope.paginateBtns.push('....');
                        $scope.paginateBtns.push(maxPage);
                    }
                }

                for (var l = 0; l < $scope.uTableSettings.length; l++) {
                    if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId && $scope.uTableSettings[l].sum == 'Yes') {
                        $scope.sumArr.push({ "key": $scope.uTableSettings[l].field, "total": 0 });
                    }
                }

                for (var k = 0; k < $scope.selectedTableData.length;k++) {
                    if ($scope.selectedTableData[k].lat_dec) {
                        if ($scope.markerBounds.top == 0 || $scope.markerBounds.top < $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.top = $scope.selectedTableData[k].lat_dec
                        }
                        if ($scope.markerBounds.bottom == 0 || $scope.markerBounds.bottom > $scope.selectedTableData[k].lat_dec) {
                            $scope.markerBounds.bottom = $scope.selectedTableData[k].lat_dec
                        }
                    }
                    if ($scope.selectedTableData[k].long_dec) {
                        if ($scope.markerBounds.left == 0 || $scope.markerBounds.left < $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.left = $scope.selectedTableData[k].long_dec
                        }
                        if ($scope.markerBounds.right == 0 || $scope.markerBounds.right > $scope.selectedTableData[k].long_dec) {
                            $scope.markerBounds.right = $scope.selectedTableData[k].long_dec
                        }
                    }
                    $scope.selectedTableData[k].isFilter = true;
                    for (var m = 0; m < $scope.sumArr.length;m++) {
                        if ($scope.selectedTableData[k][$scope.sumArr[m].key] && !isNaN($scope.selectedTableData[k][$scope.sumArr[m].key])) {
                            $scope.sumArr[m].total += Number($scope.selectedTableData[k][$scope.sumArr[m].key]);
                        }
                    }
                }
            }
            else {
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = 0;
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later "+ response.statusText);
                }
            }
            $scope.loadingfromserver = false;
        })
    }

    $scope.changeSettingsPage = function (page) {
        page = Math.ceil(page);
        $scope.settingsPage = page-1;
    }

    $scope.showMap = function () {
        $("#li_list_view").removeClass("active");
        $("#li_settings_view").removeClass("active");
        $("#li_map_view").addClass("active");
        $("#list_view").hide();
        $("#settings_view").hide();
        $("#map_view").show();
        $scope.initMap();
    }

    $scope.showList = function () {
        $("#li_list_view").addClass("active");
        $("#li_map_view").removeClass("active");
        $("#li_settings_view").removeClass("active");
        $("#list_view").show();
        $("#map_view").hide();
        $("#settings_view").hide();
    }

    $scope.showSettings = function () {
        $("#li_settings_view").addClass("active");
        $("#li_list_view").removeClass("active");
        $("#li_map_view").removeClass("active");
        $("#settings_view").show();
        $("#list_view").hide();
        $("#map_view").hide();
    }

    $scope.detailsShowMap = function () {
        $("#details_li_list_view").removeClass("active");
        $("#details_li_map_view").addClass("active");
        $("#details_lview").hide();
        $("#details_gmap").show();
        $scope.initDetailsMap();
    }

    $scope.detailsShowList = function () {
        $("#details_li_list_view").addClass("active");
        $("#details_li_map_view").removeClass("active");
        $("#details_lview").show();
        $("#details_gmap").hide();
    }

    $scope.showLatSearch = function () {
        $("#search_type_address").removeClass("selected");
        $("#search_type_lat").addClass("selected");
        $("#frm-search-address").hide();
        $("#frm-search-latlng").show();
        $scope.showSearchType = false;
    }

    $scope.showAddressSearch = function () {
        $("#search_type_address").addClass("selected");
        $("#search_type_lat").removeClass("selected");
        $("#frm-search-address").show();
        $("#frm-search-latlng").hide();
        $scope.showSearchType = false;
    }

    $scope.showHideMenu = function () {
        $scope.filterMenuHide = !$scope.filterMenuHide;
        var right = $scope.filterMenuHide ? "26px" : "286px";
        $(".table_body_viewport > .mCSB_scrollTools").css("right", right);
    }

    $scope.openLoadingModal = function () {
        $scope.loadingmodal = $.modal({
            contentAlign: 'center',
            width: 240,
            classes:'modalposition',
            title:false,
            content: '<span class="loader working"></span> <span id="modal-status">Contacting server.. :)</span>',
            buttons: {},
            scrolling: false,
            actions: false
        });
        $scope.loadingmodal.setModalPosition(10,10);
    }

    $scope.addData = function () {
        var emptyDataObject = {};
        for (var l = 0; l < $scope.uTableSettings.length; l++) {
            if ($scope.uTableSettings[l].tb_id == $scope.selectedTableId) {
                emptyDataObject[$scope.uTableSettings[l].field] = "";
            }
        }
        $scope.editItemIndex = -1;
        $scope.editData = emptyDataObject;
        $scope.showModal = true;
    }

    $scope.showInlineEdit = function (inp_id, key) {
        if (key == "id") {
            return;
        }

        var inlInput = $("#"+inp_id)[0];
        if (inlInput) {
            $(inlInput).show().focus();
        } else {
            alert("Not editable!");
        }
    }

    $scope.inlineUpdate = function (tableObj, key, inp_id) {
        var inp = $("#"+inp_id);
        $(inp).hide();
    }

    $scope.showTabToggle = function (idx) {
        var tmpShowTab = !$scope.showFilterTabs[idx];
        $scope.showFilterTabs = [];
        $scope.showFilterTabs[idx] = tmpShowTab;
    }

    $scope.downloaderGo = function (method) {
        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0],TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
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

        $('#downloader_tableName').val($scope.selectedTableName);
        $('#downloader_method').val(method);
        $('#downloader_query').val(JSON.stringify(query));
        $('#downloader_fields').val(JSON.stringify(TableKeysObj));
        $('#downloader_filters').val(JSON.stringify($scope.filterData));
        $('#downloader_visibleColumns').val(JSON.stringify($scope.visibleColumns));
        $('#downloader_form').submit();
    }

    $scope.openPrintDialog = function() {
        $scope.loadingfromserver = true;

        var TableKeysObj = {};
        var query = {};
        angular.copy($scope.selectedTableData[0],TableKeysObj);
        TableKeysObj.tableName = $scope.selectedTableName;
        delete TableKeysObj["$$hashKey"];
        delete TableKeysObj["isFilter"];
        delete TableKeysObj["tableName"];

        if ($scope.searchKeyword) {
            query.searchKeyword = $scope.searchKeyword;
        }

        if ($scope.selectedTableName == 'st') {
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

        API.changePage($scope.selectedTableName, 0, 0, query, TableKeysObj, $scope.filterData).then(function(response){
            if (response.status == 200 && response.data.key.length > 0) {
                var selectedTableData = response.data.data;
                console.log(selectedTableData);

                var html = "<table style='border-collapse: collapse;' width=\"100%\" page-break-inside: auto;>";
                var titles = Object.keys(selectedTableData[0]);
                delete titles["$$hashKey"];
                delete titles["isFilter"];

                html += "<thead><tr>";
                for (var m = 0; m < titles.length; m++) {
                    if ($scope.checkVisible(titles[m])) {
                        html += "<th style='border: solid 1px #000;padding: 3px 5px;background-color: #AAA;'>"+$scope.getColumnName(titles[m])+"</th>";
                    }
                }
                html += "</tr></thead>";

                html += "<tbody>";
                for (var i = 0; i < selectedTableData.length; i++) {
                    html += "<tr>";
                    var row = selectedTableData[i];
                    delete titles["$$hashKey"];
                    delete titles["isFilter"];
                    var row_keys = Object.keys(row);
                    for (var j = 0; j < row_keys.length; j++) {
                        if ($scope.checkVisible(row_keys[j])) {
                            html += "<td style='border: solid 1px #000;padding: 3px 5px;'>"+(row[row_keys[j]] !== null ? row[row_keys[j]] : "")+"</td>";
                        }
                    }
                    html += "</tr>";
                }
                html += "</tbody>";
                html += "</table>";

                $("#div-print").html(html);

                $scope.loadingfromserver = false;
                window.print();
            }
            else {
                $scope.selectedTableData = response.data.data;
                $scope.selectedTableRows = 0;
                if (response.data.msg) {
                    alert(response.data.msg);
                } else {
                    alert("Please Try again Later "+ response.statusText);
                }
                $scope.loadingfromserver = false;
            }
        })
    }

    $scope.addRowInline = function (addObj) {
        $scope.showAddRow = false;

        var selectedTableObj = {};
        angular.copy($scope.addObj,selectedTableObj);
        selectedTableObj.tableName = $scope.selectedTableName;
        delete selectedTableObj["$$hashKey"];
        delete selectedTableObj["isFilter"];
        var strParams = "";
        for (var key in selectedTableObj) {
            strParams += key + '=' + selectedTableObj[key] + '&';
        }
        API.addRow(strParams).then(function(response){
            if (response.data.hasOwnProperty("error") && response.data.error) {
                alert(response.data.msg);
            } else {
                $scope.addObj.id = response.data.last_id;
                $scope.selectedTableData.push($scope.addObj);

                angular.copy($scope.selectedTableData[0],$scope.addObj);
                setAllNullObj($scope.addObj);

                alert(response.data.msg);
            }
        })
    }

    $scope.frmSearchAddresIsVisible = function () {
        return $('#frm-search-address').is(':visible');
    }


    $('body').css('display', 'block');

}]);