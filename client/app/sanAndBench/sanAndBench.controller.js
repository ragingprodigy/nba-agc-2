'use strict';

angular.module('nbaAgc2App')
  .controller('SanAndBenchCtrl', function ($scope, $state) {


        $scope.details = function() {
            // Set Some data in the browser cookie and on the server
            $state.go('benchForm');
        };
  });
