'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conference_sessions', {
        url: '/conference_sessions',
        templateUrl: 'app/conference_sessions/conference_sessions.html',
        controller: 'ConferenceSessionsCtrl'
      })
        .state('conference_session_detail', {
            url: '/conference_sessions/:id',
            templateUrl: 'app/conference_sessions/conference_sessions.html',
            controller: 'ConferenceSessionsCtrl'
        });
  });