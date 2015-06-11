'use strict';

angular.module('nbaAgc2App')
  .controller('BenchFormCtrl', function ($scope, $state, registration, $sessionStorage) {

        console.log($sessionStorage.lpRegistrant);

        // If any other type of Registration is on-going, cancel it
        if ($sessionStorage.lpRegistrant != null && $sessionStorage.lpRegistrant.registrationType=="sanAndBench") {
            registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                $scope.nextForm = true;
            });
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: "sanAndBench",
                member: ""
            }
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            if (confirm("Is this information correct?")) {

                var reg = new registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;
                });
            }
        };

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
