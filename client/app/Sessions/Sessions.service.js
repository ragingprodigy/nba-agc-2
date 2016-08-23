'use strict';

angular.module('nbaAgc2App')
    .service('Sessions', function ($resource) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        return $resource('/api/sessions/:id', null, {
            aSession: {
                url: '/api/sessions/:id',
                method: 'GET',
                params: {id: '@_id'}
            },
            attend: {
                url: '/api/sessions/:id/attend',
                method: 'POST',
                params: {id: '@_id'}
            },
            unAttend: {
                url: '/api/sessions/:id/unAttend',
                method: 'POST',
                params: {id: '@_id'}
            },
            askQuestion: {
                url: '/api/sessions/:id/question',
                method: 'POST',
                params: {id: '@_id'}
            },
            deleteQuestion: {
                url: '/api/sessions/:id/question/:question_id',
                method: 'DELETE',
                params: {id: '@_id', question_id: '@question_id'}
            },
            vote: {
                url: '/api/sessions/:id/vote',
                method: 'POST',
                params: {id: '@_id'}
            },
            papers: {
                method: 'GET',
                isArray: true,
                url: '/api/sessions/papers'
            },
        });
    });
