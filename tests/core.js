import test from 'ava';

const enlargement = {
    status: 'fine',

    compute(a, b) {
        return a + b;
    },

    get value() {
        return 'test';
    },

    set value(value) {
        value.count += 1;
    },

    *range() {
        yield* [ 1, 2, 3 ];
    },

    *[Symbol.iterator]() {
        yield* [ 4, 5, 6 ];
    }
};

const assertEnlarged = function assertEnlarged($, enlarged) {
    $.false(enlarged.propertyIsEnumerable('status'));
    $.false(enlarged.propertyIsEnumerable('compute'));
    $.false(enlarged.propertyIsEnumerable('value'));
    $.is(enlarged.status, 'fine');
    $.is(enlarged.compute(12, 34), 46);
    $.is(enlarged.value, 'test');

    const object = { count: 12 };

    enlarged.value = object;

    $.is(object.count, 13);
    $.deepEqual([ ...enlarged.range() ], [ 1, 2, 3 ]);
    $.deepEqual([ ...enlarged ], [ 4, 5, 6 ]);
};

test('ensure existence of functions as non-enumerable property', $ => {
    $.false(Function.prototype.propertyIsEnumerable('enlarge'));
    $.false(Function.prototype.propertyIsEnumerable('enhance'));
    $.false(Object.prototype.propertyIsEnumerable('enlarge'));
    $.is(typeof Function.prototype.enlarge, 'function');
    $.is(typeof Function.prototype.enhance, 'function');
    $.is(typeof Object.prototype.enlarge, 'function');
});

test('able to enlarge the function in non-enumerable', $ => {
    const testFunction = function testFunction() {

    };

    testFunction.enlarge(enlargement);
    assertEnlarged($, testFunction);
});

test('able to enhance the function in non-enumerable', $ => {
    class TestClass {

    }

    TestClass.enhance(enlargement);
    assertEnlarged($, new TestClass());
});

test('able to enlarge the object in non-enumerable', $ => {
    const testObject = {};

    testObject.enlarge(enlargement);
    assertEnlarged($, testObject);
});

test('unable to enlage when not an object provided', $ => {
    const testObject = {};

    $.throws(() => testObject.enlarge('string'), TypeError);
});
