'use strict';

angular.module('nbaAgc2App')
  .controller('DoPasswordResetCtrl', function ($scope, blocker, $http, $stateParams) {
    
    	blocker.block();
    	$scope.showForm = false;

    	// Verify the request
    	$http.post('/auth/confirmResetRequest', $stateParams)
    	.success(function(user){

    		console.log(user);

    		$scope.user = user;

    		blocker.clear();
    		$scope.showForm = true;
    	})
    	.error(function(data){
    		$scope.error = data.message;

    		blocker.clear();
    	});

    	$scope.resetPassword = function(theForm) {

    		if (theForm.$valid) {

    			blocker.block('#theForm');

    			$http.post('/auth/changePassword', { user: $scope.user, password: $scope.password })
    			.success(function() {

    				$scope.info = 'Password reset successful! Proceed to Login.';
    				$scope.password = '';
    				$scope.confirmPassword = '';

                    theForm.$setPristine();

    				blocker.clear();
    			})
    			.error(function(data){
    				$scope.error = data.message;

    				blocker.clear();
    			});
    		}
    	};
  });
