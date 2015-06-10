'use strict';

describe('Controller: BenchFormCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var BenchFormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BenchFormCtrl = $controller('BenchFormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
