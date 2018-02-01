
app.factory('API', ['$http', '$q', function ($http, $q) {
    var callAPI = {}, baseHttpUrl = "./api";
    
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

    callAPI.changePage = function (tableName, selectedPage, selectedEntries, query, tableObj, filterData) {
        return $http({
            method: 'POST',
            url: baseHttpUrl + '/getSelectedTable?tableName=' + tableName,
            dataType: "json",
            data: {
                p: selectedPage,
                c: selectedEntries,
                q: JSON.stringify(query),
                fields: JSON.stringify(tableObj),
                filterData: JSON.stringify(filterData)
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

    return callAPI;

 }]);