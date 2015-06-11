'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', function ($scope, $state, $http, $sessionStorage, registration) {
        if ($sessionStorage.lpRegistrant != null) {
            registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
            });
        } else
            $state.go('legalPractitioner');

        $scope.reviewForm = function() {

            if (confirm("Are you sure?")) {

                $scope.data.formFilled = true;

                // Update the Registration Information
                registration.update({id: $scope.data._id}, $scope.data);

                // User wants to Pay now!
                $state.go('invoice');
            }
        };
  });
