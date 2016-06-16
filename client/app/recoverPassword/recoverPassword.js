'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('recoverPassword', {
        url: '/myaccount/password_recovery',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/recoverPassword/recoverPassword.html',
        controller: 'RecoverPasswordCtrl'
      });
  });