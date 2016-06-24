'use strict';

angular.module('nbaAgc2App')
  .controller('NavbarCtrl', function ($scope, $location, $auth, $state, $sessionStorage) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return $location.path().indexOf(route) > -1;
    };

    $scope.u = $auth.getPayload();

      $scope.pull = "pull-right";
      $scope.changeClass = function () {
          if ($scope.pull === "pull-right")
              $scope.pull = "";
      };
      
    $scope.logout = function() {
        var cnf = window.confirm('Are you sure you want to end your session?');
        if (cnf) {
            $auth.logout();
            $sessionStorage.$reset();
            window.location.href='/';
        }
    };
  });