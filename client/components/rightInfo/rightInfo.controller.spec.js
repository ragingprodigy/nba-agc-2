'use strict';

describe('Controller: RightInfoCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var RightInfoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RightInfoCtrl = $controller('RightInfoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
