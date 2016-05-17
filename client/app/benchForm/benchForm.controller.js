'use strict';

angular.module('nbaAgc2App')
    .controller('BenchFormCtrl', function ($scope, $state, $http, Registration, $sessionStorage, blocker, $anchorScroll, $rootScope) {
        $http.get('api/registrations/branch').success(function (branch) {
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
        //             window.alert('Registration started successfully. Now, please complete the rest of the form and submit.');
        //         });
        //     }
        // };
        // gets the registration code from branch
        $scope.regCode = function () {
            $scope.data.registrationCode = $scope.selectedItem.code+'-'+$scope.selectedItem.order;
            $scope.data.branch = $scope.selectedItem.name;
        };

        

        $scope.reviewForm = function (form1) {

            if (form1.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();
                    if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }

                    $scope.data.formFilled = true;
                    // builds registration code again before submitting
                    $http.post('api/registrations/onebranch',$scope.data).success(function (branch) {
                        $scope.data.registrationCode = branch[0].code+'-'+branch[0].order;
                    });
                    $http.post('api/registrations/saveOrder',$scope.data);

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

                        window.alert('Registration submitted successfully. Now, proceed to make payment.');

                    });
                }
            } else {

                window.alert('All fields marked * are required. Please fill all fields before submitting.');

                $anchorScroll();

            }
        };
  });
