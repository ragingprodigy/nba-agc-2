'use strict';

angular.module('nbaAgc2App')
  .controller('MainCtrl', function ($scope, $sessionStorage, $state) {
    
    $scope.startReg = function() {
        if ($sessionStorage.lpRegistrant!==null && $sessionStorage.lpRegistrant!== undefined) {
            $state.go($sessionStorage.lpRegistrant.registrationType);
        } else {
            $state.go('registerAs');
        }
    };
  });
