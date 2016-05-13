'use strict';

describe('Service: Sessions', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var Sessions;
  beforeEach(inject(function (_Sessions_) {
    Sessions = _Sessions_;
  }));

  it('should do something', function () {
    expect(!!Sessions).toBe(true);
  });

});
