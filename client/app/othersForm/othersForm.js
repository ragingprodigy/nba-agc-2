'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('others', {
        url: '/OTHERS',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'OthersFormCtrl'
      })
      .state('othersUpdate', {
        url: '/OTHERS/:registrationId',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'FormEditorCtrl'
      });
  });