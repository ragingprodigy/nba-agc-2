'use strict';

angular.module('nbaAgc2App')
  .controller('NavbarCtrl', function ($scope, $location, $sessionStorage, registration, $state) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

        $scope.doReset = function(){
            // Remove incomplete registrations from the db
            if ($sessionStorage.lpRegistrant != null)
                registration.delete({id: $sessionStorage.lpRegistrant._id });

            $sessionStorage.$reset();
            $state.go('main');
        };

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });