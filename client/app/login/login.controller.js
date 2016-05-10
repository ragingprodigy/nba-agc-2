'use strict';

angular.module('nbaAgc2App')
  .controller('LoginCtrl', function ($scope, $state, $auth, blocker) {

        $scope.user = {};

        $scope.doLogin = function() {

        	blocker.block('#theForm');

            $auth.login($scope.user, '/registrations').then(function() {
                console.log($scope.user);
                window.location.href='/registrations';

            }, function(e){
            	blocker.clear();
            	$scope.error = e.data.message;
            });
        };
  });
