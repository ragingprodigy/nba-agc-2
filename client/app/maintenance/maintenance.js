/**
 * Created by DrCraig-PC on 01/06/2016.
 */
'use strict';

angular.module('nbaAgc2App')
    .config(function ($stateProvider) {
        $stateProvider
            .state('maintenance', {
                url: '/maintenance',
             //templateUrl: 'app/maintenance/maintenance.html',
                controller: 'MaintenanceCtrl'
            });
    });