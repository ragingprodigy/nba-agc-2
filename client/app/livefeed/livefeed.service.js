/**
 * Created by git on 8/15/2016.
 */


'use strict';
var nbaAgc2App = angular.module('nbaAgc2App');

nbaAgc2App.service('Livefeed', function($resource){
    return $resource('/api/livefeed/:id', null, {
        getSingleFeed: {
            url: '/api/livefeed/aFeed',
            method: 'GET'
        },
        rateFeed: {
            url: '/api/livefeed/likePost/:id',
            method: 'GET'
        },
        addComment: {
            url: '/api/livefeed/addComment',
            method: 'POST'
        },
        getFeeds: {
            method: 'GET',
            url: '/api/livefeed/',
            isArray: true
        }
    });
});