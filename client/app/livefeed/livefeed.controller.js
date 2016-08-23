/**
 * Created by Kingsley on 8/13/2016.
 */

'use strict';
var nbaAgc2App = angular.module('nbaAgc2App');

nbaAgc2App.controller('LiveFeedCtrl', function ($scope, $stateParams, $state, Livefeed, $cookies) {
    // $scope.feeds = Livefeed.query({});

    Livefeed.query({}).$promise.then(function (livefeed) {
        if (livefeed.length == 0) {
            $scope.noFeed = true;
        }
        $scope.feeds = livefeed;
    });

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

    };

});

nbaAgc2App.controller('SingleLiveFeedCtrl', function ($cookies, $scope, Livefeed, $stateParams) {
    $scope.make_comment = false;
    $scope.con = {};
    $scope.wroxy_f = $cookies.get('wroxy_f');
    $scope.wroxy_e = $cookies.get('wroxy_e');

    $scope.commentCheck = function () {
        $scope.make_comment = !$scope.make_comment;

        $scope.wroxy_f = $cookies.get('wroxy_f');
        $scope.wroxy_e = $cookies.get('wroxy_e');
    }

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
        $scope.submitting = true;

        if (typeof form.fullname == 'undefined' || form.fullname == null) {
            form.fullname = $scope.wroxy_f;
            form.email = $scope.wroxy_e;
        }

        Livefeed.addComment({id: $stateParams.id}, form, function (response) {
            $scope.singleFeed = response;
            $scope.make_comment = false;

            // Set a cookie
            $cookies.put('wroxy_f', form.fullname);
            $cookies.put('wroxy_e', form.email);

        });
        $scope.con = {};
        $scope.submitting = false;

    };
});

nbaAgc2App.controller('PostLiveFeedCtrl', function ($scope, Livefeed, $state, Sessions, Speakers) {
    $scope.new_post = {};

    Sessions.query(function (response) {
        $scope.allSessions = response;
    });

    Speakers.query({}).$promise.then(function (speakers) {
        $scope.allSpeakers = speakers;
    });

    $scope.createPost = function (form) {
        Livefeed.addFeed(form, function (response) {
            $scope.singleFeed = response
            $state.go('liveFeedSingle', {id: response._id});
        });
    };
});
