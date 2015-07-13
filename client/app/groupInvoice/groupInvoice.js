'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('groupInvoice', {
        url: '/group_invoice/:invoiceId',
        templateUrl: 'app/groupInvoice/groupInvoice.html',
        controller: 'GroupInvoiceCtrl'
      });
  });