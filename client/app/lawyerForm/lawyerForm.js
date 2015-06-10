'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lawyerForm', {
        url: '/registerAs/legalPractitioner/form',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'LawyerFormCtrl'
      });
  });