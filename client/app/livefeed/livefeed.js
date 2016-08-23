'use strict';

angular.module('nbaAgc2App')
    .config(function ($stateProvider) {
        $stateProvider
            .state('livefeed', {
                url: '/livefeed',
                templateUrl: 'app/livefeed/livefeed.html',
                controller: 'LiveFeedCtrl'
            })
            .state('liveFeedSingle', {
                url: '/livefeed/:id',
                templateUrl: 'app/livefeed/livefeed_single.html',
                controller: 'SingleLiveFeedCtrl'
            })
            .state('livefeedPost', {
                url: '/livefeed/post/',
                requireLogin: true,
                templateUrl: 'app/livefeed/livefeed_post.html',
                controller: 'PostLiveFeedCtrl'
            });
    });