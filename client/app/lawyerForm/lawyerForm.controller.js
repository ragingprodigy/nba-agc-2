'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', function ($scope, $state, $http, $sessionStorage, Registration) {
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
            });
        } else{
            $state.go('legalPractitioner');
        }

        $scope.reviewForm = function() {

            var cnf = window.confirm('Are you sure?');
            if (cnf) {

                $scope.data.formFilled = true;

                // Update the Registration Information
                Registration.update({id: $scope.data._id}, $scope.data);

                // User wants to Pay now!
                $state.go('invoice');
            }
        };
  });
