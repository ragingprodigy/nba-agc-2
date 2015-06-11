'use strict';

angular.module('nbaAgc2App')
  .controller('OthersCtrl', function ($scope, $state) {
    $scope.details = function(){
        $state.go('othersForm');
    };
  });
