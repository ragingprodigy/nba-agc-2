'use strict';

describe('Service: blocker', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var blockService;
  beforeEach(inject(function (_blocker_) {
    blockService = _blocker_;
  }));

  it('should do something', function () {
    expect(!!blockService).toBe(true);
  });

});
