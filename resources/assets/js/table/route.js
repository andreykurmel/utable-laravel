var app = angular.module('myApp', ['angular.filter', 'ngRoute'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

app.directive('dateTimePicker', function ($rootScope) {
    return {
        require: '?ngModel',
        restrict: 'AE',
        scope: {
            pick12HourFormat: '@'
        },
        link: function (scope, elem, attrs) {
            elem.datetimepicker({
                format: "YYYY-MM-DD hh:mm"
            });

            elem.on('blur', function () {
                elem.change();
            })
        }
    };
});

app.config(function ($routeProvider, $locationProvider) {
    // console.log($routeProvider)
    $locationProvider.hashPrefix('');
    $routeProvider
        .when("/:tableName", {
            controller: "myCtrl"
        })

    //   $locationProvider.html5Mode(true);

});
