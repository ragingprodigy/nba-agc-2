'use strict';

describe('Controller: SanAndBenchCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var SanAndBenchCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SanAndBenchCtrl = $controller('SanAndBenchCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
