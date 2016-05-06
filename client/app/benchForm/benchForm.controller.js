'use strict';

angular.module('nbaAgc2App')
    .controller('BenchFormCtrl', function ($scope, $state, $http, Registration, $sessionStorage, blocker, $anchorScroll, $rootScope) {
        $http.get('api/registrations/branch').success(function (branch) {
            console.log(branch);
            return $scope.branchData = branch;
        });
        $anchorScroll();

        if ($rootScope.expired()) { $state.go('main'); }

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){
            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='sanAndBench') {

                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    $scope.nextForm = true;

                    blocker.clear();
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

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
                    window.alert('Registration started successfully. Now, please complete the rest of the form and submit.');
                });
            }
        };

        $scope.reviewForm = function(form1, form2) {

            if (form1.$valid && form2.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        $state.go('invoice');
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill all fields before submitting.');

                $anchorScroll();

            }
        };
  });
