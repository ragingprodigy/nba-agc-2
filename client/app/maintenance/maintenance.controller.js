/**
 * Created by DrCraig-PC on 01/06/2016.
 */
'use strict';

angular.module('nbaAgc2App')
    .controller('MaintenanceCtrl', function ($scope, $sessionStorage, $state, $rootScope) {

        // if ($rootScope.isAuthenticated()) {
        //     $state.go('myRegistrations');
        // } else if ($rootScope.expired()) {
        //     $state.go('conference_sessions');
        // }
        //
        // $scope.startReg = function() {
        //     if ($rootScope.expired()) { return false; }
        //     if ($sessionStorage.lpRegistrant!==null && $sessionStorage.lpRegistrant!== undefined) {
        //         $state.go($sessionStorage.lpRegistrant.registrationType);
        //     } else {
        //         $state.go('registerAs');
        //     }
        // };
    });
