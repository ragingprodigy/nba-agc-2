'use strict';

angular.module('nbaAgc2App')
.config(function ($stateProvider) {
$stateProvider
    .state('my_sessions', {
        requireLogin: true,
        url: '/my_sessions',
     //.templateUrl: 'app/maintenance/maintenance.html',
      templateUrl: 'app/my_sessions/my_sessions.html',
        controller: 'MySessionsCtrl'
    })
    .state('session_detail', {
        requireLogin: true,
        url: '/my_sessions/:id',
     //.templateUrl: 'app/maintenance/maintenance.html',
      templateUrl: 'app/conference_sessions/detail.html',
        controller: 'ConferenceSessionCtrl'
    });
});