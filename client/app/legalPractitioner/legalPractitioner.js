'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('legalPractitioner', {
        url: '/registerAs/legalPractitioner',
        templateUrl: 'app/legalPractitioner/legalPractitioner.html',
        controller: 'LegalPractitionerCtrl'
      });
  });