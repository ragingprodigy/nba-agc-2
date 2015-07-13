'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/myaccount',
        templateUrl: 'app/login/login.html',
        controller: 'LoginCtrl'
      });
  });