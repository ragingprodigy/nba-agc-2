'use strict';

angular.module('nbaAgc2App')
  .controller('InternationalCtrl', function ($scope, $http, Countries, $state, $sessionStorage, Registration, blocker, $anchorScroll, $rootScope) {
    $scope.countries = Countries;

        $anchorScroll();

        if ($rootScope.expired()) { $state.go('main'); }

        // If any other type of Registration is on-going, re-direct to it
        if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined){

            blocker.block();

            if ($sessionStorage.lpRegistrant.registrationType==='international') {

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
                registrationType: 'international',
                international: true,
                member: '',
                registrationCode:''
            };
        }



      $scope.reviewForm = function (form1) {

          if (form1.$valid) {

                var cnf = window.confirm('Are you sure you want to submit this form?');
                if (cnf) {

                    blocker.block();
                    if ($rootScope.isAuthenticated()) { $scope.data.owner = $rootScope.$user.sub; $scope.data.isGroup = true; }
                    $scope.data.formFilled = true;
                    $http.post('api/registrations/otherCode',{code:"INT"}).then(function (code) {
                        $scope.data.registrationCode = code.data;
                        $http.post('api/registrations/saveVipCode',{code :code.data});
                    });
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
