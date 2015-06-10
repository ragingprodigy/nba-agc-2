'use strict';

describe('Controller: OthersFormCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var OthersFormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OthersFormCtrl = $controller('OthersFormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
