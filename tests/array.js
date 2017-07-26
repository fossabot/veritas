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

    it('should be able to calculates sum and product', () => {
        const array = Array.allocate(10, (element, index) => index + 1);
        const { sum, product } = array;

        (sum === 55 && product == 3628800).should.ok();
    });

    it('should be able to make iterator of sequence', () => {
        ([ ...Array.range(11) ].sum === 55).should.ok();
        ([ ...Array.range(1, 11) ].sum === 55).should.ok();
        ([ ...Array.range(1, 100, 2) ].sum === 2500).should.ok();
    });

    it('should be able to make iterator of multi-dimentional sequence', () => {
        const data = Array.allocate(2, () => Array.allocate(3, () => Array.allocate(4, () => null)));
        const random = Math.random();

        for(const [ first, second, third ] of Array.dimentional(2, 3, 4)) {
            data[first][second][third] = random;
        }

        (data.map(first => first.map(second => second.sum).sum).sum === random * 24).should.ok();
    });
});
