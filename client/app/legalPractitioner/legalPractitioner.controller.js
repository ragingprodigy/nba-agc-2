'use strict';

angular.module('nbaAgc2App')
  .controller('LegalPractitionerCtrl', function ($scope, $state, $http) {

        $scope.person = {};
        $scope.members = [];

        // Ask for Name as it appears on Call to Bar Certificate!
        $scope.nextForm = function() {
            $scope.person.nb_surname = $scope.person.surname;
            $scope.person.nb_middleName = $scope.person.middleName;
            $scope.person.nb_firstName = $scope.person.firstName;

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
        // Notify the server that a registration has been started for the current user!

        // Set Some data in the browser cookie and on the server
        $state.go('lawyerForm');
    }
  });
