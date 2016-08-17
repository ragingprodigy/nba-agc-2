'use strict';

describe('Controller: LiveFeedCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var LiveFeedCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LiveFeedCtrl = $controller('LiveFeedCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
