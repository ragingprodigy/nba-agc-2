'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('registerAs', {
        url: '/registration',
        templateUrl: 'app/registerAs/registerAs.html',
        controller: 'RegisterAsCtrl'
      });
  });