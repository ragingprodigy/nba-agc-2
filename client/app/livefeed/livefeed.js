'use strict';

var nbaAgc2App = angular.module('nbaAgc2App', ['ngRoute']);

nbaAgc2App.config(['$routeProvider',function($routeProvider) {
    $routeProvider.when('/livefeed', {
            templateUrl: 'app/livefeed/partials/live_feeds.html',
            controller: 'LiveFeedCtrl'
        })
        .when('/:session_id', {
            templateUrl: 'partials/viewSession.html',
            controller: 'viewUserCtrl'
        })
        .when('/editUser/:userid', {
            templateUrl: 'partials/editUser.html',
            controller: 'editUserCtrl'
        })
        .otherwise({ redirectTo: '/livefeed' });
}]);