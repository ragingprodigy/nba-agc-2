'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/myaccount',
    //templateUrl: 'app/login/login.html',
    templateUrl: 'app/maintenance/maintenance.html',
        controller: 'LoginCtrl'
      });
  });