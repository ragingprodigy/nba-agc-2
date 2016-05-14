'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bankPay', {
        url: '/invoice/bankPay',
        templateUrl: 'app/bankPay/bankPay.html',
        controller: 'BankPayCtrl'
      });
  });