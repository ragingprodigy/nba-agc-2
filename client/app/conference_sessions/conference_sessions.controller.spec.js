'use strict';

describe('Controller: ConferenceSessionsCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var ConferenceSessionsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConferenceSessionsCtrl = $controller('ConferenceSessionsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
