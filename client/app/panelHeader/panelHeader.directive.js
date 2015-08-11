'use strict';

angular.module('nbaAgc2App')
  .directive('panelHeader', function () {
    return {
      templateUrl: 'app/panelHeader/panelHeader.html',
      restrict: 'EA',
      scope: {
        title: '@',
        'class': '@'
      }
    };
  });