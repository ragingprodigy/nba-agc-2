'use strict';

angular.module('nbaAgc2App')
  .controller('MagistrateCtrl', function ($scope, $state) {
    $scope.details = function(){
        $state.go('magistrateForm');
    };
  });
