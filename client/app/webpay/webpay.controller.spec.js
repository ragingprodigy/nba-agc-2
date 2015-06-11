'use strict';

describe('Controller: WebpayCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var WebpayCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WebpayCtrl = $controller('WebpayCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
