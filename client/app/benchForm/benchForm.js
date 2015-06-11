'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('benchForm', {
        url: '/SAN_AGS_BENCH',
        templateUrl: 'app/benchForm/benchForm.html',
        controller: 'BenchFormCtrl'
      });
  });