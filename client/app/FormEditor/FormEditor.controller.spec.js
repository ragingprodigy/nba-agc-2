'use strict';

describe('Controller: FormEditorCtrl', function () {

  // load the controller's module
  beforeEach(module('nbaAgc2App'));

  var FormEditorCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormEditorCtrl = $controller('FormEditorCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
