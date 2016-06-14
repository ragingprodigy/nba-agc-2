'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('group_webpay', {
        url: '/group_invoice/:invoiceId/webpay',
      templateUrl: 'app/group_pay/group_pay.html',
        //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'GroupPayCtrl'
      })
      .state('group_bankpay', {
        url: '/group_invoice/:invoiceId/bankpay',
      templateUrl: 'app/group_pay/group_bank_pay.html', 
       //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'GroupPayCtrl'
      });
  });