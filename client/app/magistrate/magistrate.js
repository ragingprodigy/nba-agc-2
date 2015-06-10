'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('magistrate', {
        url: '/registerAs/magistrate',
        templateUrl: 'app/magistrate/magistrate.html',
        controller: 'MagistrateCtrl'
      });
  });