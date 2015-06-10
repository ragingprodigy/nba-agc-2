'use strict';

angular.module('nbaAgc2App')
  .controller('LegalPractitionerCtrl', function ($scope, $state, $http, $sessionStorage) {

        $scope.person = {};
        $scope.members = [];

        if ($sessionStorage.lpRegistrant != null) {

            // Retrieve the data from the Server
            $http.get('/api/registrations/'+$sessionStorage.lpRegistrant._id).success(function(regData){
                $sessionStorage.lpRegistrant = regData;
                // Set Some data in the browser cookie and on the server
                $state.go('lawyerForm');
            });
        }

        // Ask for Name as it appears on Call to Bar Certificate!
        $scope.nextForm = function() {
            $scope.person.nb_surname = $scope.person.surname;
            $scope.showForm2 = true;
        };

        // Lookup the registration data for this user
        $scope.doLookup = function() {
            $http.post('/api/members/verify', $scope.person).success(function(members) {
                $scope.members = members;
                $scope.showTable = true;
            });
        };

    $scope.details = function(person) {
        $scope.person.member = person._id;
        // Notify the server that a registration has been started for the current user!
        $http.post('/api/registrations', $scope.person ).success(function(registrationData) {

            $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    }
  });
