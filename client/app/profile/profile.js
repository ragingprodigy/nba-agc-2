'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile',
       //.templateUrl: 'app/maintenance/maintenance.html',
       templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl',
        sp: {
            authenticate: true
        }
      });
  });