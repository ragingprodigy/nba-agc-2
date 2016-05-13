'use strict';

angular.module('nbaAgc2App')
    .config(function ($stateProvider) {
        $stateProvider
            .state('law_students', {
                url: '/LAW_SCHOOL_STUDENTS',
                templateUrl: 'app/law_students/law_students.html',
                controller: 'LawStudentsCtrl'
            });
    });