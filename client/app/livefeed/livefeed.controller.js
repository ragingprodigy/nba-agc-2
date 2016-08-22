/**
 * Created by Kingsley on 8/13/2016.
 */

'use strict';
var nbaAgc2App = angular.module('nbaAgc2App');

nbaAgc2App.controller('LiveFeedCtrl', function ($scope, $stateParams, $state, Livefeed, $cookies) {
    $scope.feeds = Livefeed.query({});

    $scope.likeStatus = function (cookieKey) {
        return $cookies.get(cookieKey);
    };

    $scope.rateFeeds = function (id, index) {

        // Retrieving a cookie of this post
        var postCookie = $cookies.get('liked' + id);

        if (postCookie == 1) {

            // Unlike Post
            Livefeed.unRateFeed({id: id}, function (response) {
                // Set a cookie
                $cookies.put('liked' + id, 0);

                $scope.feeds[index] = response;
            });
        }
        else if (typeof postCookie == 'undefined' || postCookie == 0) {

            // Like Post
            Livefeed.rateFeed({id: id}, function (response) {
                // Set a cookie
                $cookies.put('liked' + id, 1);

                $scope.feeds[index] = response;
            });
        }

    };

    $scope.getSingle = function (id) {
        $state.go('liveFeedSingle', {
            id: id
        });

    }

});

nbaAgc2App.controller('SingleLiveFeedCtrl', function ($cookies, $scope, Livefeed, $stateParams) {
    $scope.makeComment = false;

    $scope.likeStatus = function (cookieKey) {
        return $cookies.get(cookieKey);
    };

    $scope.rateFeed = function (id) {
        // Retrieving a cookie of this post
        var postCookie = $cookies.get('liked' + id);


        if (postCookie == 1) {

            // Unlike Post
            Livefeed.unRateFeed({id: id}, function (response) {
                // Set a cookie
                $cookies.put('liked' + id, 0);

                $scope.singleFeed = response;
            });
        }
        else if (typeof postCookie == 'undefined' || postCookie == 0) {

            // Like Post
            Livefeed.rateFeed({id: id}, function (response) {
                // Set a cookie
                $cookies.put('liked' + id, 1);

                $scope.singleFeed = response;
            });
        }

    };

    $scope.getSingle = function (id) {
        Livefeed.getSingleFeed({id: id}, function (response) {
            $scope.singleFeed = response;
        });
    }

    $scope.getSingle($stateParams.id);

    $scope.comment = function (form) {
        Livefeed.addComment({id: $stateParams.id}, form, function (response) {
            $scope.singleFeed = response;
            $scope.makeComment = false;

        });
    };
});
