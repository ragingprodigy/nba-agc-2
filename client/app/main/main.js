'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });