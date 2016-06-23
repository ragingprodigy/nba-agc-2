'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sanAndBench', {
        url: '/SAN_AGS_BENCH',
    //templateUrl: 'app/benchForm/benchForm.html', 
      templateUrl: 'app/maintenance/maintenance.html',
        controller: 'BenchFormCtrl'
      })
      .state('sanAndBenchUpdate', {
        url: '/SAN_AGS_BENCH/:registrationId',
      templateUrl: 'app/maintenance/maintenance.html',
    //templateUrl: 'app/benchForm/benchForm.html',
        controller: 'FormEditorCtrl'
      });
  });