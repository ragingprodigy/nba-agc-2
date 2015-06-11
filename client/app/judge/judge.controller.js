'use strict';

angular.module('nbaAgc2App')
  .controller('JudgeCtrl', function ($scope, $state) {
    $scope.details = function() {
        $state.go('judgeForm');
    };
  });
