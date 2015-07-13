'use strict';

angular.module('nbaAgc2App')
  .controller('NavbarCtrl', function ($scope, $location, $auth, $state, $sessionStorage) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.u = $auth.getPayload();

    $scope.logout = function() {
        var cnf = window.confirm('Are you sure you want to end your session?');
        if (cnf) {
            $auth.logout();
            $sessionStorage.$reset();
            $state.go('main');
        }
    };
  });