'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('webpay', {
        url: '/invoice/webpay',
        templateUrl: 'app/webpay/webpay.html',
        controller: 'WebpayCtrl'
      });
  });