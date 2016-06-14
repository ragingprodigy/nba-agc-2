'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('myInvoices', {
        url: '/my_invoices',
       //.templateUrl: 'app/maintenance/maintenance.html',
      templateUrl: 'app/myInvoices/myInvoices.html',
        controller: 'MyInvoicesCtrl'
      });
  });