'use strict';

describe('Controller: PapersCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var PapersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PapersCtrl = $controller('PapersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
