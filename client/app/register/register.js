'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('register', {
        url: '/create_account',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/register/register.html',
        controller: 'RegisterCtrl'
      });
  });