'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sanAndBench', {
        url: '/registerAs/sanAndBench',
        templateUrl: 'app/sanAndBench/sanAndBench.html',
        controller: 'SanAndBenchCtrl'
      });
  });