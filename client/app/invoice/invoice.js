'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('invoice', {
        url: '/invoice',
      templateUrl: 'app/invoice/invoice.html',
       //.templateUrl: 'app/maintenance/maintenance.html',
        controller: 'InvoiceCtrl'
      });
  });