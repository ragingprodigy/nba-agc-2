'use strict';

describe('Controller: GroupPayCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var GroupPayCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GroupPayCtrl = $controller('GroupPayCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
