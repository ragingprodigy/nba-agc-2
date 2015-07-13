'use strict';

angular.module('nbaAgc2App')

.controller('FormEditorCtrl', function($scope, $state, $http, $sessionStorage, Registration, $stateParams, blocker, $anchorScroll) {

    if ($stateParams.registrationId) {

        // Fetch the Registration Info
        blocker.block();

        Registration.get({id: $stateParams.registrationId}, function(d){
            $scope.data = d;
            $scope.nextForm = $scope.editing = true;

            blocker.clear();
        });


        var k, results;
        $scope.years = (function() {
            results = [];
            for (k = 2010; k >= 1960; k--){ results.push(k); }
            return results;
        }).apply(this);

        $scope.reviewForm = function(formName) {

            if (formName.$invalid) {

                window.alert('All form fields marked with * are required!');

                $anchorScroll();
                
            } else {
                var cnf = window.confirm('Are you sure you want to update this registration?');

                if (cnf) {

                    blocker.block();

                    // Update the Registration Information
                    Registration.update({id: $scope.data._id}, $scope.data, function(){

                        $sessionStorage.$reset();
                        $state.go('myRegistrations');

                    });
                }
            }
        };

    } else {
        // Redirect
        $state.go('myRegistrations');
    }
});
