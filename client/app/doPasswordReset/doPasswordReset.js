'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('doPasswordReset', {
        url: '/myaccount/reset_password?member&token',
     //.templateUrl: 'app/maintenance/maintenance.html',
     templateUrl: 'app/doPasswordReset/doPasswordReset.html',
        controller: 'DoPasswordResetCtrl'
      });
  });