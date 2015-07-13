'use strict';

angular.module('nbaAgc2App')
  .controller('LawyerFormCtrl', function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {

        $anchorScroll();

        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {
            blocker.block();

            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                blocker.clear();
            });
        } else{
            $state.go('legalPractitioner');
        }

        $scope.reviewForm = function(formName) {

            if (formName.$invalid) {

                window.alert('All form fields marked with * are required!');

                $anchorScroll();
                
            } else {
                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();

                    $scope.data.formFilled = true;

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){
                        if ($rootScope.isAuthenticated() && $rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                        else { $state.go('invoice'); }
                    });
                }
            }
        };
  });