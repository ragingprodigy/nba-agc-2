'use strict';

angular.module('nbaAgc2App')
  .controller('BankPayCtrl', function ($scope, $state, $sessionStorage, Registration, blocker, $auth) {
  	if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

            blocker.block();

            // Check if the User has filled the form
            Registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled){
                    $state.go($scope.data.registrationType);
                }

                $sessionStorage.lpRegistrant = d;

                blocker.clear();

            });
        } else {
            $state.go('main');
        }

        $scope.markComplete = function(r) {

            blocker.block();

            $auth.signup(r).then(function(response) {
                console.log(response.data);

                r.completed = true;
                Registration.update({id: $scope.data._id}, r, function(){
                    
                    //window.alert('Congratulations!\n\n Your account has been created and your payment is now expected within the next 48 hours.\n\n Do check your email for more information (including your login details)');
                    window.alert('Registration Received, please proceed to bank payment within the next 48 hours. Please check your email for your login details and more information.');

                    $sessionStorage.$reset();
                    $state.go('login');
                });

                blocker.clear();

            }, function(err){
                window.alert(err.data.message);
                blocker.clear();
            });
        };

        $scope.back = function() {
            if ($auth.isAuthenticated) { window.history.back(); }
            else { $state.go('invoice'); }
        };

        $scope.getName = function () {
            if (!$scope.data){
                return '';
            }
            return $scope.data.firstName+' '+$scope.data.middleName+' '+$scope.data.surname;
        };
  });
