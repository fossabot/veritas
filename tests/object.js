/* eslint-env mocha */

import should from 'should';

describe('Object', () => {
    it('should be able to freeze an object deeply', () => {
        const testObject = {
            array: [ 1, 2, 3 ],

            nested: {
                array: [ 4, 5, 6 ],
                string: 'Hello, world!'
            }
        };

        Object.glaciate(testObject);

        should.throws(() => testObject.array.push(4), TypeError);
        should.throws(() => testObject.nested.array.push(7), TypeError);

        should.throws(() => {
            testObject.nested.string = 'Yeah!';
        }, TypeError);
    });
});
