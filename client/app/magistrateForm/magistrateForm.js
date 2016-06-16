'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('magistrate', {
        url: '/MAGISTRATE',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'MagistrateFormCtrl'
      })
      .state('magistrateUpdate', {
        url: '/MAGISTRATE/:registrationId',
       templateUrl: 'app/maintenance/maintenance.html',
     //templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'FormEditorCtrl'
      });
  });