'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('magistrateForm', {
        url: '/registerAs/magistrate/form',
        templateUrl: 'app/magistrateForm/magistrateForm.html',
        controller: 'MagistrateFormCtrl'
      });
  });