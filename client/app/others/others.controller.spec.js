'use strict';

describe('Controller: OthersCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var OthersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OthersCtrl = $controller('OthersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
