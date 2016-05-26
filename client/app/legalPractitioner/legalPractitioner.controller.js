'use strict';

angular.module('nbaAgc2App')
.controller('LegalPractitionerCtrl', function ($scope, $state, $http, $sessionStorage, Registration, blocker, $anchorScroll, $auth, $rootScope) {

    $scope.data = {};
    $scope.memberss = [];
    $scope.member = {};
    $scope.newuser = {};

    var k, results;
    $scope.membersYears = (function () {
        results = [];
        for (k = 2015; k >= 1960; k--) {
            results.push(k);
        }
        return results;
    }).apply(this);




    if ($rootScope.expired()) {
        $state.go('main');
    }

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
    // $scope.nextForm = function() {
    //     $scope.person.nbSurname = $scope.person.surname;
    //     $scope.showForm2 = true;
    // };

    $scope.doLookup = function () {
        $http.post('/api/members/getmember', $scope.data).success(function (members) {
            $scope.memberss = [];
            if (members) {
                $scope.memberss.push.apply($scope.memberss, members);
            }
        })
    };

    $scope.doSave = function (form) {
        if (form.$invalid) {
            window.alert('All form fields marked with * are required!');
            $anchorScroll();
        }
        else {
            $http.post('/api/members/savemember', $scope.newuser).success(function (members) {
                $scope.member = members;
                $scope.data.member = $scope.member._id;
                $scope.data.nbaId = $scope.member.nbaId;
                $scope.data.yearCalled = '' + $scope.member.yearCalled;
                $('#myModal').modal('hide');
                $('#ctb').prop('disabled', true);
            })
        }
    };


    $scope.setData = function () {
        $scope.data.member = $scope.member.data._id;
        $scope.data.nbaId = $scope.member.data.nbaId;
        $scope.data.yearCalled = '' + $scope.member.data.yearCalled;
        $('#myModal').modal('hide');
        $('#ctb').prop('disabled', true);
    };

    $scope.showmodal = function () {
        if ($scope.data.surname.length >= 3 && $scope.data.firstName.length >= 3) {
            blocker.block();
            $scope.doLookup();
            $('#myModal').modal({
                backdrop: 'static',
                keyboard: false
            });
            blocker.clear();
        }

    };
    
    // gets the registration code from branch
    $scope.regCode = function () {
        $scope.data.registrationCode = $scope.selectedItem.code+'-'+$scope.selectedItem.order;
        $scope.data.branch = $scope.selectedItem.name;
    };

    
    $scope.reviewForm = function (formName) {
        if (formName.$invalid) {

            window.alert('All form fields marked with * are required!');

            $anchorScroll();

        } else {
            var cnf = window.confirm('Are you sure you want to submit this form?');

            if (cnf) {

                if ($auth.isAuthenticated()) { $scope.data.owner = $auth.getPayload().sub; $scope.data.isGroup = true; }
                $scope.data.formFilled = true;
                // builds registration code again before submitting
                $http.post('api/registrations/onebranch',$scope.data).success(function (branch) {
                    $scope.data.registrationCode = branch[0].code+'-'+branch[0].order;
                });
                $http.post('api/registrations/saveOrder',$scope.data);
                var reg = new Registration($scope.data);
                reg.$save().then(function (registrationData) {

                    $sessionStorage.lpRegistrant = registrationData;
                    $scope.data = registrationData;
                    if ($rootScope.isAuthenticated() && $rootScope.isGroup()) {
                        $sessionStorage.$reset();
                        $state.go('myRegistrations');
                    }
                    else {
                        $state.go('invoice');
                    }


                });
                blocker.clear();
                // // Update the Registration Information
                // Registration.update({id: $scope.data._id}, $scope.data, function(){
                //     if ($rootScope.isAuthenticated() && $rootScope.isGroup()) { $sessionStorage.$reset(); $state.go('myRegistrations'); }
                //     else { $state.go('invoice'); }
                // });
            }
        }
    };


    // gets all branch names
    $http.get('api/registrations/branch').success(function (branch) {
        return $scope.branchData = branch;
    });

    $scope.details = function () {

        // blocker.block();
        //
        // $scope.person.member = person._id;
        // $scope.person.nbaId = person.nbaId;
        // $scope.person.yearCalled = person.yearCalled;

        // Group Registration Support
        if ($auth.isAuthenticated()) { $scope.person.owner = $auth.getPayload().sub; $scope.person.isGroup = true; }

        // Notify the server that a registration has been started for the current user!
        // var reg = new Registration($scope.person);
        // reg.$save().then(function(registrationData) {
        //
        //     $sessionStorage.lpRegistrant = registrationData;

            // Set Some data in the browser cookie and on the server
            $state.go('lawyerForm');
        // });
    };
});
