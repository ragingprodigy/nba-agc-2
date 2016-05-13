'use strict';

angular.module('nbaAgc2App')
    .controller('OthersFormCtrl', function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {
        $http.get('api/registrations/branch').success(function (branch) {
            return $scope.branchData = branch;
        });
        $anchorScroll();

        if ($rootScope.expired()) { $state.go('main'); }

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='others') {

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
                registrationType: 'others',
                member: ''
            };
        }

        var k, results;
        $scope.yearss = (function () {
            results = [];
            for (k = 2015; k >= 1960; k--) {
                results.push(k);
            }
            return results;
        }).apply(this);

        // $scope.startReg = function() {
        //
        //     var cnf = window.confirm('Is this information correct?');
        //
        //     if (cnf) {
        //
        //         blocker.block();
        //
        //         if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }
        //
        //         var reg = new Registration($scope.data);
        //         reg.$save().then(function(registrationData) {
        //
        //             $sessionStorage.lpRegistrant = registrationData;
        //             $scope.data = registrationData;
        //
        //             $scope.nextForm = true;
        //
        //             blocker.clear();
        //         });
        //     }
        // };

        $scope.reviewForm = function (form1) {

            if (form1.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    var reg = new Registration($scope.data);
                    reg.$save().then(function (registrationData) {

                        $sessionStorage.lpRegistrant = registrationData;
                        $scope.data = registrationData;
                        if ($rootScope.isAuthenticated() && $rootScope.isGroup()) {
                            $sessionStorage.$reset();
                            $state.go('myRegistrations');
                        }
                        else {
                            $state.go('invoice');
                        }

                        blocker.clear();
                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  });
