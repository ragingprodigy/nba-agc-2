'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lawyerForm', {
        url: '/LEGAL_PRACTITIONER',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'LawyerFormCtrl'
      })
      .state('legalPractitionerUpdate', {
        url: '/LEGAL_PRACTITIONER/:registrationId',
        templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'FormEditorCtrl'
      });
  });