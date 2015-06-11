'use strict';

angular.module('nbaAgc2App')
  .controller('LegalPractitionerCtrl', function ($scope, $state, $http, $sessionStorage, registration) {

        $scope.person = {};
        $scope.members = [];

        if ($sessionStorage.lpRegistrant != null) {

            // Retrieve the data from the Server
            registration.get({id: $sessionStorage.lpRegistrant._id}, function(regData){
                $sessionStorage.lpRegistrant = regData;
                // Set Some data in the browser cookie and on the server
                $state.go('lawyerForm');
            });
            //$http.get('/api/registrations/'+$sessionStorage.lpRegistrant._id).success();
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
        $scope.person.branch = person.branch;
        $scope.person.nbaId = person._id;
        // Notify the server that a registration has been started for the current user!
        var reg = new registration($scope.person);
        reg.$save().then(function(registrationData) {

            $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    }
  });
