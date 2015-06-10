'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', function ($scope, $state) {
    $scope.message = 'Hello';

    $scope.payInvoice = function() {

        // User wants to Pay now!
        $state.go('invoice');
    };

    $scope.bookInvoice = function() {

        // User wants to pay later
        $state.go('invoice');
    }
  });
