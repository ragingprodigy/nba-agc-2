'use strict';

angular.module('nbaAgc2App')
  .controller('BenchFormCtrl', function ($scope, $state, Registration, $sessionStorage) {

        console.log($sessionStorage.lpRegistrant);

        // If any other type of Registration is on-going, cancel it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){
            if ($sessionStorage.lpRegistrant.registrationType==='sanAndBench') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;
                });
            } else {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            }
        } else {
            $sessionStorage.$reset();
            $scope.data = {
                registrationType: 'sanAndBench',
                member: ''
            };
        }

        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;
                });
            }
        };

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
