'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('judgeForm', {
        url: '/registerAs/judge/form',
        templateUrl: 'app/judgeForm/judgeForm.html',
        controller: 'JudgeFormCtrl'
      });
  });