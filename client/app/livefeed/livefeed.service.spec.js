/**
 * Created by Kingsley on 8/15/2016.
 */

'use strict';

describe('Service: Livefeed', function () {

    // load the service's module
    beforeEach(module('nbaAgc2App'));

    // instantiate service
    var Livefeed;
    beforeEach(inject(function (Livefeed) {
        Invoice = _Livefeed_;
    }));

    it('should do something', function () {
        expect(!!Livefeed).toBe(true);
    });

});
