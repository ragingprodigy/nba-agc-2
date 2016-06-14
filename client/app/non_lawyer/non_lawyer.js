'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('non_lawyer', {
        url: '/NON_LAWYER',
       //.templateUrl: 'app/maintenance/maintenance.html',
      templateUrl: 'app/non_lawyer/non_lawyer.html',
        controller: 'NonLawyerCtrl'
      });
  });