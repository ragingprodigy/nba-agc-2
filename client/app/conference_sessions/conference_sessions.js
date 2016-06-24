'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conference_sessions', {
        url: '/conference_sessions',
     //.templateUrl: 'app/maintenance/maintenance.html',
    templateUrl: 'app/conference_sessions/conference_sessions.html',
        controller: 'ConferenceSessionsCtrl'
      })
        .state('conference_session_detail', {
            url: '/conference_sessions/:id',
       //.templateUrl: 'app/maintenance/maintenance.html',
        templateUrl: 'app/conference_sessions/detail.html',
            controller: 'ConferenceSessionCtrl'
        });
  });