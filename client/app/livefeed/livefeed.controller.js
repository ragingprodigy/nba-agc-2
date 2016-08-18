/**
 * Created by Kingsley on 8/13/2016.
 */

'use strict';
var nbaAgc2App = angular.module('nbaAgc2App');

nbaAgc2App.controller('LiveFeedCtrl', function ($scope, $stateParams, $state, Livefeed, $cookies) {
    $scope.feeds = Livefeed.query({});

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

nbaAgc2App.controller('SingleLiveFeedCtrl', function ($scope, Livefeed, $stateParams) {
    $scope.getSingle = function (id) {
        Livefeed.getSingleFeed({id: id}, function (response) {
            $scope.singleFeed = response;
            //state.go();
        });
    }
    $scope.getSingle($stateParams.id);

    $scope.comment = function ($scope, Livefeed) {
        Livefeed.addComment(function (response) {
            console.log(response);
        });
    };
});
