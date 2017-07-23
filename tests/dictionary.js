/* eslint-env mocha */
/* global Generic Dictionary Type */

import should from 'should';

describe('Dictionary', () => {
    let ordinalDictionary;

    it('should be able to construct with type parameters', () => {
        should.doesNotThrow(() => ordinalDictionary = new (Dictionary.$(Number, String)));
    });

    it('should be unable to construct without enough type parameters', () => {
        should.throws(() => ordinalDictionary = new Dictionary, TypeError);
        should.throws(() => ordinalDictionary = new (Dictionary.$(Number)), TypeError);
    });

    it('should be both instance and implementation of generic collection', () => {
        Type.of(ordinalDictionary).is(Dictionary).should.ok();
        Type.of(ordinalDictionary).is(Generic.$(2)).should.ok();
        Type.of(ordinalDictionary).is(Dictionary.$(Number, String)).should.ok();
        Type.of(ordinalDictionary).is(Dictionary.$(String, Number)).should.not.ok();
    });

    it('should be able to contain correct pair', () => {
        should.doesNotThrow(() => {
            ordinalDictionary.set(1, 'first');
            ordinalDictionary.set(2, 'second');
            ordinalDictionary.set(3, 'third');
        });

        ordinalDictionary.set(4, 'fourth').should.equal(ordinalDictionary);
    });

    it('should be unable to contain incorrect pair', () => {
        should.throws(() => ordinalDictionary.set(5, 5), TypeError);
    });

    it('should be work fine with prototype functions', () => {
        ordinalDictionary.size.should.equal(4);
        ordinalDictionary.get(2).should.equal('second');
        ordinalDictionary.delete(2).should.ok();
        ordinalDictionary.delete(2).should.not.ok();
        ordinalDictionary.has(2).should.not.ok();

        const keys = [ ...ordinalDictionary.keys() ];
        const values = [ ...ordinalDictionary.values() ];
        const entries = [ ...ordinalDictionary ];

        keys.should.deepEqual([ 1, 3, 4 ]);
        values.should.deepEqual([ 'first', 'third', 'fourth' ]);
        entries.should.deepEqual([ [ 1, 'first' ], [ 3, 'third' ], [ 4, 'fourth' ] ]);
    });
});
