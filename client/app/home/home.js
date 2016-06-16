'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
     //templateUrl: 'app/home/home.html',
       templateUrl: 'app/maintenance/maintenance.html',
        controller: 'HomeCtrl'
      });
  });