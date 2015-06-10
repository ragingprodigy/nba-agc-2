'use strict';

describe('Controller: JudgeFormCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var JudgeFormCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JudgeFormCtrl = $controller('JudgeFormCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
