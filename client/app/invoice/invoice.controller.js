'use strict';

angular.module('nbaAgc2App')
  .controller('InvoiceCtrl', function ($scope, $sessionStorage, registration, $state) {
        if ($sessionStorage.lpRegistrant != null) {
            // Check if the User has filled the form
            registration.get({id: $sessionStorage.lpRegistrant._id}, function(d){
                $scope.data = d;
                if (!$scope.data.formFilled) $state.go($scope.data.registrationType)

            });
        } else {
            $state.go('main');
        }

        $scope.back = function() {
            $state.go($scope.data.registrationType);
        };

        $scope.getName = function (data) {
            if (!data) return "";

            $scope.userName = data.prefix+" "+data.surname+" "+data.middleName+" "+data.firstName+" "+data.suffix;
            return $scope.userName;
        }

        $scope.payOnline = function(){
            $state.go('webpay');
        }
  });
