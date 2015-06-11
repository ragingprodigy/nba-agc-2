'use strict';

angular.module('nbaAgc2App')
  .controller('WebpayCtrl', function ($scope, $sessionStorage, registration, $state) {
        if ($sessionStorage.lpRegistrant != null) {
            // Check if the User has filled the form
            registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled) $state.go($scope.data.registrationType)

            });
        } else {
            $state.go('main');
        }

        $scope.getFee = function(amt) {

            var fee = 0.015 * amt;
            return fee < 2000? fee.toFixed(2) : 2000.00;
        };

        $scope.markComplete = function(r) {
            r.completed = false;
            registration.update({id: r._id}, r);
            return false;
        };

        $scope.back = function() {
            $state.go('invoice');
        };

        $scope.getName = function () {
            if (!$scope.data) return "";
            return $scope.data.prefix+" "+$scope.data.surname+" "+$scope.data.middleName+" "+$scope.data.firstName+" "+$scope.data.suffix;
        };

        $scope.payNow = function() {
            $('#upay_form').submit();
            return;
        };
  });
