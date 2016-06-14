'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('access_bank_test', {
        url: '/access_bank_test',
      templateUrl: 'app/access_bank_test/access_bank_test.html',
        controller: 'AccessBankTestCtrl'
      });
  });