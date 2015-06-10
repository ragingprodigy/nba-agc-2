'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('othersForm', {
        url: '/registerAs/others/form',
        templateUrl: 'app/othersForm/othersForm.html',
        controller: 'OthersFormCtrl'
      });
  });