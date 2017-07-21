/* eslint-env mocha */

import should from 'should';

describe('Array', () => {
    it('should be able to allocate with provided length', () => {
        Array.allocate(3).should.deepEqual([ undefined, undefined, undefined ]);
        Array.allocate(10, (element, index) => index + 1).reduce((sum, value) => sum + value, 0).should.equal(55);
    });

    it('should be unable to accept incorrect mapping function', () => {
        should.throws(() => Array.allocate(3, true), TypeError);
    });
});
