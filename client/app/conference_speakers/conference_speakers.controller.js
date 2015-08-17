'use strict';

angular.module('nbaAgc2App')
.controller('ConferenceSpeakersCtrl', function ($scope, Speakers, $state, Utils) {
    $scope.speakers = Speakers.query({lean:true});

    $scope.showSpeakerDetail = function(id, name){
          $state.go('speaker_detail', {id:id, name: Utils.slug(name)});
    };
})

.controller('SpeakerCtrl', function($scope, $stateParams, Speakers){
    Speakers.get({id:$stateParams.id}, function(speaker){
        $scope.speaker = speaker;
    });
});
