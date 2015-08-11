'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('international', {
        url: '/INTERNATIONAL_ATTENDEES',
        templateUrl: 'app/international/international.html',
        controller: 'InternationalCtrl'
      });
  });