'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myRegistrations', {
        url: '/registrations',
        templateUrl: 'app/myRegistrations/myRegistrations.html',
        controller: 'MyRegistrationsCtrl'
      });
  });