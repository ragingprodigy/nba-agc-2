'use strict';

angular.module('nbaAgc2App')
  .controller('RegisterCtrl', function ($scope, $auth, blocker) {

    $scope.master = {};
  	
  	$scope.doSignUp = function(formName) {
  		if (formName.$valid) {

  			blocker.block('#theForm');

  			$scope.user.accountType = 'group';
  			$auth.signup($scope.user).then(function() {

                $scope.status = {
                	message: 'Registration Successful. Please proceed to login.',
                	type: 'success'
                };

                $scope.user = angular.copy($scope.master);

                formName.$setPristine();
                formName.$setUntouched();
                
                blocker.clear();

            }, function(err) {

            	$scope.status = {
                	message: err.data.message,
                	type: 'danger'
                };
                
                blocker.clear();

            });

  		} else {

  		}
  	};
  });
