'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('non_lawyer', {
        url: '/non_lawyer',
        templateUrl: 'app/non_lawyer/non_lawyer.html',
        controller: 'NonLawyerCtrl'
      });
  });