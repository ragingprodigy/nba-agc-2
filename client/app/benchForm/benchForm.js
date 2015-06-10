'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('benchForm', {
        url: '/registerAs/sanAndBench/form',
        templateUrl: 'app/benchForm/benchForm.html',
        controller: 'BenchFormCtrl'
      });
  });