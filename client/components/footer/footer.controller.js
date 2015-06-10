'use strict';

angular.module('nbaAgc2App')
  .controller('FooterCtrl', function ($scope) {
    $scope.theYear = new Date().getFullYear();
  });
