'use strict';

angular.module('nbaAgc2App')
  .controller('InvoiceCtrl', function ($scope, $sessionStorage, Registration, $state, blocker, $auth, $rootScope) {
        
        if ($rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }

        else {
            if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

                blocker.block();

                // Check if the User has filled the form
                Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                    $scope.data = d;
                    
                    if (!$scope.data.formFilled){
                        $state.go($scope.data.registrationType);
                    }

                    blocker.clear();

                });
            } else {
                $state.go('main');
            }
        }

        $scope.back = function() {
            $state.go($scope.data.registrationType);
        };

        $scope.getName = function (data) {
            if (!data) {
                return '';
            }

            $scope.userName = data.prefix+' '+data.firstName+' '+data.middleName+' '+data.surname+' '+data.suffix;

            return $scope.userName;
        };

        $scope.payBank = function() {

            if ($scope.data.completed && $scope.data.bankpay) {

                $state.go('bankPay');

            } else {
            
                $scope.markComplete('bankpay', function(){

                    $state.go('bankPay');

                });
            }
        };

        $scope.payOnline = function() {

            if ($scope.data.completed && $scope.data.webpay) {

                $state.go('webpay');
                
            } else {
            
                $scope.markComplete('webpay', function(){

                    $state.go('webpay');

                });
            }
        };

        $scope.markComplete = function(what, callback) {

            blocker.block();

            if (what==='webpay') { $scope.data.webpay = true; }
            else { $scope.data.bankpay = true; }
            $scope.data.completed = true;

            // Prevent Account signup for people trying to Pay after signing in
            if ($auth.isAuthenticated()) {


                Registration.update({id: $scope.data._id}, $scope.data, function(){

                    callback();

                });

            } else {

                $auth.signup($scope.data).then(function() {

                    Registration.update({id: $scope.data._id}, $scope.data, function(){

                        if (what==='bankpay') {
                            window.alert('Registration Received, please proceed to the Bank for Payment.\n\nPlease check your email for your login details and more information.');
                        }

                        callback();

                    });

                }, function(err) {

                    window.alert(err.data.message);
                    
                    blocker.clear();

                });
            }
        };
  });
