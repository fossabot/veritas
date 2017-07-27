/* global Generic Dictionary Type */

import test from 'ava';

let ordinalDictionary;

test('able to construct with type parameters', $ => {
    $.notThrows(() => ordinalDictionary = new (Dictionary.$(Number, String)));
});

test('unable to construct without enough type parameters', $ => {
    $.throws(() => ordinalDictionary = new Dictionary, TypeError);
    $.throws(() => ordinalDictionary = new (Dictionary.$(Number)), TypeError);
});

test('both instance and implementation of generic collection', $ => {
    $.true(Type.of(ordinalDictionary).is(Dictionary));
    $.true(Type.of(ordinalDictionary).is(Generic.$(2)));
    $.true(Type.of(ordinalDictionary).is(Dictionary.$(Number, String)));
    $.false(Type.of(ordinalDictionary).is(Dictionary.$(String, Number)));
});

test('able to contain correct pair', $ => {
    $.notThrows(() => {
        ordinalDictionary.set(1, 'first');
        ordinalDictionary.set(2, 'second');
        ordinalDictionary.set(3, 'third');
    });

    $.is(ordinalDictionary.set(4, 'fourth'), ordinalDictionary);
});

test('unable to contain incorrect pair', $ => {
    $.throws(() => ordinalDictionary.set(5, 5), TypeError);
});

test('work fine with prototype functions', $ => {
    $.is(ordinalDictionary.size, 4);
    $.is(ordinalDictionary.get(2), 'second');
    $.true(ordinalDictionary.delete(2));
    $.false(ordinalDictionary.delete(2));
    $.false(ordinalDictionary.has(2));

    const keys = [ ...ordinalDictionary.keys() ];
    const values = [ ...ordinalDictionary.values() ];
    const entries = [ ...ordinalDictionary ];

    $.deepEqual(keys, [ 1, 3, 4 ]);
    $.deepEqual(values, [ 'first', 'third', 'fourth' ]);
    $.deepEqual(entries, [ [ 1, 'first' ], [ 3, 'third' ], [ 4, 'fourth' ] ]);
});
