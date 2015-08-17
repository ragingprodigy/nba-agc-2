'use strict';

angular.module('nbaAgc2App')
.controller('ConferenceSessionsCtrl', function ($scope, Sessions, $location, $anchorScroll) {

    Sessions.query({}, function(data) {
        $scope.sessions = _.sortBy(data, 'start_time');
        $scope.buffer = {};

        $scope.days = _.uniq(_.map($scope.sessions, function(s){
            var date = new Date(s.start_time),
                anchor = $scope.week[date.getUTCDay()]+date.getUTCDate();
            if ($scope.buffer[anchor] ==undefined) { $scope.buffer[anchor] = []; }
            $scope.buffer[anchor].push(s);
            return anchor;
        }));
    });

    $scope.week = ['Sunday-','Monday-','Tuesday-','Wednesday-','Thursday-','Friday-','Saturday-'];

    $scope.jumpToDay = function(day) {
        $location.hash(day);
        $anchorScroll();
    };
})

.controller('ConferenceSessionCtrl', function($scope,$state,Sessions,$stateParams, Utils, $rootScope, $timeout){
    Sessions.get({id:$stateParams.id}, function(session){
        $scope.session = session;
        if ($scope.session.ratings.length) {
            var mR = $scope.session.ratings;
            $scope.comments = _.filter(mR, function(r){ return r.comment && r.comment!==''; });
            $scope.rate = _.reduce(mR, function(sum, r){ return sum + r.score; }, 0);
        } else {
            $scope.rate = 0;
        }

        $scope.rating = {
            score: 0,
            comment: ""
        };
    });

    if ($rootScope.isAuthenticated()) {
        $scope.me = $rootScope.$user._id;
    }

    $scope.yetToRate = function() {
        return !_.find($scope.session.ratings, function(s){ return s.user._id==$scope.me; });
    };

    $scope.showSpeaker = function(speaker){
        $state.go('speaker_detail', {id:speaker._id, name:Utils.slug(speaker.name)});
    };

    $scope.doRating = function(theForm) {
        if (theForm.$valid && window.confirm('Are you sure?')) {
            $scope.submitting = true;
            $scope.rating._id = $scope.session._id;

            Sessions.vote($scope.rating, function(response){
                $scope.submitting = false;
                response.user = $rootScope.$user;
                alert('Operation Successful!');
                $scope.session.ratings.push(response);
            }, function(e){
                $scope.submitting = false;
                alert(e.data.message);
            });
        }
    };

    $scope.newQuestion = {};

    $scope.loadMine = function() {
        Sessions.query({me:$scope.me, lean:true}, function(sessions){
            $scope.userSessions = sessions;
            console.log(sessions);
        });
    };

    $scope.sessionAttended = function() {
        return Utils.sessionAttended($scope.userSessions, $scope.session);
    };

    $scope.askQuestion = function(theform) {
        if (theform.$valid && $scope.sessionAttended()) {
            $scope.submitting = true;
            var pf = $rootScope.cUser,
                payLoad = {
                    _id:$scope.session._id,
                    question: $scope.newQuestion.question,
                    name: $scope.newQuestion.anonymous ? 'Anonymous' : (pf.prefix + ' ' + pf.firstName + ' ' + pf.surname + ' ' + pf.suffix)
                };

            Sessions.askQuestion(payLoad, function(response){
                $scope.session = response;

                $scope.submitting = false;
                $scope.newQuestion = {};
                theform.$setPristine();
            }, function(err) {
                alert('Error encountered while submitting question');
                $scope.submitting = false;
            });
        }
    };

    $scope.deleteQuestion = function(question) {
          if ((question.owner == $rootScope.cUser.user) && confirm('Are you sure?')) {
              $scope.session.$deleteQuestion({question_id:question._id}).then(function(r){
                  $scope.session = r;
              });
          } else {
              alert('You do not own this question.');
          }
    };

    $scope.sessionOpen = function() {
        return $scope.session && moment().isBefore($scope.session.end_time);
    };

    $scope.ratingOpen = function() {
        return $scope.session && moment().isAfter($scope.session.rating_start) && moment($scope.session.rating_start).endOf('day').isAfter(moment());
    };

    $scope.ratingStarted = function() {
        return $scope.session && moment().isAfter($scope.session.rating_start);
    };

    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.attendSession = function() {
        if ($scope.sessionAttended()) {
            alert('You have already registered to attend this session');
        } else {
            $scope.submitting = true;
            Sessions.attend({_id:$scope.session._id}, function(){
                $scope.loadMine();
                alert('Registration Successful');
                $scope.submitting = false;
            }, function(response) {
                alert(response.data.message);
                $scope.submitting = false;
            });
        }
    };

    $scope.unAttendSession = function() {
        if ($scope.sessionAttended()) {
            $scope.submitting = true;

            Sessions.unAttend({_id:$scope.session._id}, function(){
                $scope.loadMine();
                alert('Action Successful!');
                $scope.submitting = false;
            }, function(response) {
                alert(response.data.message);
                $scope.submitting = false;
            });
        } else {
            alert('You can only un-attend a session you have once registered for.');
        }
    };

    $timeout(function() {
        return $scope.loadMine();
    }, 1000);

});
