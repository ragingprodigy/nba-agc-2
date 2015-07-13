'use strict';

describe('Service: AccessCheck', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var AccessCheck;
  beforeEach(inject(function (_AccessCheck_) {
    AccessCheck = _AccessCheck_;
  }));

  it('should do something', function () {
    expect(!!AccessCheck).toBe(true);
  });

});
