'use strict';

describe('Controller: MagistrateFormCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var MagistrateFormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MagistrateFormCtrl = $controller('MagistrateFormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
