/**
 * Created by Kingsley on 8/13/2016.
 */

'use strict';
var nbaAgc2App = angular.module('nbaAgc2App');

nbaAgc2App.controller('LiveFeedCtrl', function ($scope,$stateParams,$state, Livefeed) {
    $scope.feeds = Livefeed.query({});

    $scope.rateFeeds = function(id, index){
        Livefeed.rateFeed({id : id}, function(response){
            $scope.feeds[index] = response;
            console.log(response);
            console.log(index);
        });
    };

    $scope.getSingle = function (id){
        $state.go('liveFeedSingle',{
            id : id
        });

    }

});
nbaAgc2App.controller('SingleLiveFeedCtrl', function($scope, Livefeed, $stateParams){
    $scope.getSingle = function (id){
        Livefeed.getSingleFeed({id : id}, function (response){
            $scope.singleFeed = response;
            //state.go();
        });
    }
    $scope.getSingle($stateParams.id);

    $scope.comment = function($scope, Livefeed){
        Livefeed.addComment(function(response){
            console.log(response);
        });
    };
});
