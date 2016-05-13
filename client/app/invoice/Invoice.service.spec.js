'use strict';

describe('Service: Invoice', function () {

  // load the service's module
  beforeEach(module('nbaAgc2App'));

  // instantiate service
  var Invoice;
  beforeEach(inject(function (_Invoice_) {
    Invoice = _Invoice_;
  }));

  it('should do something', function () {
    expect(!!Invoice).toBe(true);
  });

});
