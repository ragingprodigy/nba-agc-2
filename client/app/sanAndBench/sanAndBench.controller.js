'use strict';

angular.module('nbaAgc2App')
  .controller('SanAndBenchCtrl', function ($scope, $state) {

        $state.go('benchForm');
  });
