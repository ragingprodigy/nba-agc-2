'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('lawyerForm', {
        url: '/LEGAL_PRACTITIONER',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'LawyerFormCtrl'
      })
      .state('legalPractitionerUpdate', {
        url: '/LEGAL_PRACTITIONER/:registrationId',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/lawyerForm/lawyerForm.html',
        controller: 'FormEditorCtrl'
      });
  });