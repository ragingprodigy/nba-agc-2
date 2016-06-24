'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('papers', {
        url: '/papers',
    templateUrl: 'app/papers/papers.html',
        controller: 'PapersCtrl'
      });
  });