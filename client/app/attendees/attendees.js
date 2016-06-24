'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('attendees', {
        url: '/attendees',
    templateUrl: 'app/attendees/attendees.html',
     //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'AttendeesCtrl'
      });
  });