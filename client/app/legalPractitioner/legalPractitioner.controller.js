'use strict';

angular.module('nbaAgc2App')
  .controller('LegalPractitionerCtrl', function ($scope, $state) {
    $scope.message = 'Hello';

    $scope.details = function() {
        // Set Some data in the browser cookie and on the server
        $state.go('lawyerForm');
    }
  });
