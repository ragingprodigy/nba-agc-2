'use strict';

angular.module('nbaAgc2App')
  .controller('RecoverPasswordCtrl', function ($scope, $http, blocker) {
    	
  		$scope.user = {};

  		$scope.dorecovery = function(recForm) {

  			if (recForm.$valid) {

          blocker.block('#theForm');

  				$http.post('/auth/recoverPassword', $scope.user)
  				.success(function(){

  					$scope.submitted = true;

            $scope.user = {};

            recForm.$setPristine();
            recForm.$setUntouched();

            blocker.clear();

  				})
  				.error(function(d){

  					$scope.error = d.message;
            blocker.clear();

  				});
  			} else {

  				window.alert('Please fill in your registered email address!');
  			}

  		};
  });
