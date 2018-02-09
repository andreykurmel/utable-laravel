
app.factory('API', ['$http', '$q', function ($http, $q) {
    var callAPI = {}, baseHttpUrl = "/api";
    
    callAPI.getUtables = function () {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/getUTable'
        })
    }

    callAPI.selectedTable = function (tableName, selectedEntries) {
        return $http({
            method: 'POST',
            url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
            dataType: "json",
            data: {
                getfilters: true,
                p: 0,
                c: selectedEntries
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    callAPI.changePage = function (tableName, selectedPage, selectedEntries, query, tableObj, filterData, changedFilter) {
        return $http({
            method: 'POST',
            url: baseHttpUrl + '/getSelectedTable',
            dataType: "json",
            data: {
                tableName: tableName,
                getfilters: true,
                p: selectedPage,
                c: selectedEntries,
                q: JSON.stringify(query),
                fields: JSON.stringify(tableObj),
                filterData: JSON.stringify(filterData),
                changedFilter: JSON.stringify(changedFilter)
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    callAPI.updateRow = function(params){
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/updateTableRow?' + params
        })
    }

    callAPI.addRow = function(params){
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/addTableRow?' + params
        })
    }

    callAPI.deleteRow = function(params) {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/deleteTableRow?tableName='+params.tableName+'&id=' + params.id
        })
    }

    callAPI.loadFilter = function(tableName, filterObj) {
        return $http({
            method: 'GET',
            url: baseHttpUrl + '/loadFilter?tableName=' + tableName + '&filterObj=' + JSON.stringify(filterObj)
        })
    }

    return callAPI;

 }]);