'use strict';

angular.module('nbaAgc2App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conference_speakers', {
        url: '/conference_speakers',
        templateUrl: 'app/conference_speakers/conference_speakers.html',
        controller: 'ConferenceSpeakersCtrl'
      })
        .state('speaker_detail', {
            url: '/conference_speakers/:id/:name',
            templateUrl: 'app/conference_speakers/details.html',
            controller: 'SpeakerCtrl'
        });
  });