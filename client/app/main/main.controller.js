'use strict';

angular.module('nbaAgc2App')
  .controller('MainCtrl', function ($scope, $sessionStorage, $state) {
    /*$scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };*/
        $scope.startReg = function() {
            if ($sessionStorage.lpRegistrant!==null && $sessionStorage.lpRegistrant!== undefined) {
                $state.go($sessionStorage.lpRegistrant.registrationType);
            } else {
                $state.go('registerAs');
            }
        };
  });
