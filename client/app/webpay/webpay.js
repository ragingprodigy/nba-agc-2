'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('webpay', {
        url: '/invoice/webpay',
          templateUrl: 'app/maintenance/maintenance.html',
        //templateUrl: 'app/webpay/webpay.html',
        controller: 'WebpayCtrl'
      })
      .state('paySuccess', {
        url: '/success?OrderID&TransactionReference',
          templateUrl: 'app/maintenance/maintenance.html',
        //templateUrl: 'app/webpay/success.html',
        controller: 'SuccessCtrl'
      })
      .state('payPending', {
        url: '/pending?OrderID&TransactionReference',
          templateUrl: 'app/maintenance/maintenance.html',
        //templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment is PENDING';
            }
        }
      })
      .state('payFailed', {
        url: '/failed?OrderID&TransactionReference',
          templateUrl: 'app/maintenance/maintenance.html',
        //templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment Attempt FAILED';
            }
        }
      })
      .state('payCancelled', {
        url: '/cancelled?OrderID&TransactionReference',
          templateUrl: 'app/maintenance/maintenance.html',
        //templateUrl: 'app/webpay/cancelled.html',
        controller: 'CancelledCtrl',
        resolve: {
            message: function() {
                return 'Your Payment was CANCELLED';
            }
        }
      });
  });