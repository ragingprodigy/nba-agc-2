'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('registerAs', {
        url: '/register',
     //.templateUrl: 'app/maintenance/maintenance.html',
    templateUrl: 'app/registerAs/registerAs.html',
        controller: 'RegisterAsCtrl'
      });
  });