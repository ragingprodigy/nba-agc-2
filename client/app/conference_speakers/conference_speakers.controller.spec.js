'use strict';

describe('Controller: ConferenceSpeakersCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var ConferenceSpeakersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ConferenceSpeakersCtrl = $controller('ConferenceSpeakersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
