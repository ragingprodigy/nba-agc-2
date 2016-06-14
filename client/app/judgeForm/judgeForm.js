'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('judge', {
        url: '/JUDGES',
    templateUrl: 'app/judgeForm/judgeForm.html',
       //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'JudgeFormCtrl'
      })
      .state('judgeUpdate', {
        url: '/JUDGES/:registrationId',
      templateUrl: 'app/judgeForm/judgeForm.html',
        //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'FormEditorCtrl'
      });
  });