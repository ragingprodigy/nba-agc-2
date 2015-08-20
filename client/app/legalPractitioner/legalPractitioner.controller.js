'use strict';

angular.module('nbaAgc2App')
.controller('LegalPractitionerCtrl', function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $auth, $rootScope) {

    $scope.person = {};
    $scope.members = [];

        if ($rootScope.expired()) { $state.go('main'); }

    $anchorScroll();

    if ($sessionStorage.lpRegistrant !== null && $sessionStorage.lpRegistrant !== undefined) {

        blocker.block();

        // Retrieve the data from the Server
        Registration.get({id: $sessionStorage.lpRegistrant._id}, function(regData){
            $sessionStorage.lpRegistrant = regData;
            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    }

    // Ask for Name as it appears on Call to Bar Certificate!
    $scope.nextForm = function() {
        $scope.person.nbSurname = $scope.person.surname;
        $scope.showForm2 = true;
    };

    // Lookup the registration data for this user
    $scope.doLookup = function() {
        blocker.block();
        $http.post('/api/members/verify', $scope.person).success(function(members) {
            $scope.members = members;
            $scope.showTable = true;

            blocker.clear();
        });
    };

    $scope.details = function(person) {

        blocker.block();
        
        $scope.person.member = person._id;
        $scope.person.nbaId = person.nbaId;
        $scope.person.yearCalled = person.yearCalled;

        // Group Registration Support
        if ($auth.isAuthenticated()) { $scope.person.owner = $auth.getPayload().sub; $scope.person.isGroup = true; }

        // Notify the server that a registration has been started for the current user!
        var reg = new Registration($scope.person);
        reg.$save().then(function(registrationData) {

            $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        });
    };
});
