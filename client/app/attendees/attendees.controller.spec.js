'use strict';

describe('Controller: AttendeesCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var AttendeesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AttendeesCtrl = $controller('AttendeesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
