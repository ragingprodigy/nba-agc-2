'use strict';

angular.module('nbaAgc2App')
  .controller('ProfileCtrl', function ($scope, $auth, $state, $http, blocker) {
    
    	if (!$auth.isAuthenticated()) {
    		$state.go('myaccount');
    	} else {
    		blocker.clear();

    		console.log($auth.getPayload());

    		$http.get('/api/registrations/me', function (registrations) {
    			console.log(registrations);

    			blocker.clear();
    		});
    	}
  });
