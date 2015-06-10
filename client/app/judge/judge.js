'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('judge', {
        url: '/registerAs/judge',
        templateUrl: 'app/judge/judge.html',
        controller: 'JudgeCtrl'
      });
  });