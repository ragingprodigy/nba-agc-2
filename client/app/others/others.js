'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('others', {
        url: '/registerAs/others',
        templateUrl: 'app/others/others.html',
        controller: 'OthersCtrl'
      });
  });