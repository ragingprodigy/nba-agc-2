'use strict';

describe('Controller: MagistrateCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var MagistrateCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MagistrateCtrl = $controller('MagistrateCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
