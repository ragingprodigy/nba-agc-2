'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('legalPractitioner', {
        url: '/registration/legalPractitioner',
        templateUrl: 'app/legalPractitioner/legalPractitioner.html',
        controller: 'LegalPractitionerCtrl'
      });
  });