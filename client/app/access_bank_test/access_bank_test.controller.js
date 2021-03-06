'use strict';

angular.module('nbaAgc2App')
  .controller('AccessBankTestCtrl', function ($scope, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope)  {
    	$anchorScroll();

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='access_bank_test') {

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
                registrationType: 'access_bank_test',
                member: ''
            };
        }

        $scope.startReg = function() {

            var cnf = window.confirm('Is this information correct?');

            if (cnf) {

                blocker.block();

                if ($rootScope.isAuthenticated()) { $scope.data.user = $rootScope.$user.sub; }

                var reg = new Registration($scope.data);
                reg.$save().then(function(registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;

                    $scope.nextForm = true;

                    blocker.clear();
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

                window.alert('All fields marked * are required. Please fill in all fields before submitting.');

                $anchorScroll();
            }
        };
  });
