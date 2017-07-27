/* global Type */

import test from 'ava';

const GeneratorFunction = (function *() {}).constructor;
const AsyncFunction = (async () => {}).constructor;

const assertMultipleValues = function assertMultipleValues($, commonType, ...values) {
    const types = values.map(value => Type.of(value));

    $.true(types.every(type => type.is(commonType)));
    $.truthy(types.reduce((previous, current) => previous === current && current));
};

test('able to distinguish undefined and null', $ => {
    $.true(Type.of(undefined).is(undefined));
    $.true(Type.of(null).is(null));
    $.false(Type.of(undefined).is(null));
    $.false(Type.of(null).is(undefined));
});

test('unable to construct more than once about same type', $ => {
    $.throws(() => new (Type.$(undefined)), ReferenceError);
});

test('able to think type of inherited constructor\'s instance is equals to ancestral constructor', $ => {
    class Ancestor {

    }

    class Inherited extends Ancestor {

    }

    $.true(Type.of(new Inherited).is(Ancestor));
});

test('able to think type of naked value is equals to type of boxed value about `[]` and `new Array`', $ => {
    assertMultipleValues($, Array, [], new Array);
});

test('able to think type of naked value is equals to type of boxed value about `{}` and `new Object`', $ => {
    assertMultipleValues($, Object, {}, new Object);
});

test('able to think type of naked value is equals to type of boxed value about `function() {}`, `() => {}`, `class {}` and `new Function`', $ => {
    assertMultipleValues($, Function, function() {}, () => {}, class {}, new Function);
});

test('able to think type of naked value is equals to type of boxed value about `function *() {}` and `new GeneratorFunction`', $ => {
    assertMultipleValues($, GeneratorFunction, function *() {}, new GeneratorFunction);
});

test('able to think type of naked value is equals to type of boxed value about `async function() {}`, `async () => {}` and `new AsyncFunction`', $ => {
    assertMultipleValues($, AsyncFunction, async function() {}, async () => {}, new AsyncFunction);
});

test('able to think type of naked value is equals to type of boxed value about `true`, `false` and `new Boolean`', $ => {
    assertMultipleValues($, Boolean, true, false, new Boolean);
});

test('able to think type of naked value is equals to type of boxed value about `0`, `Infinity`, `NaN` and `new Number`', $ => {
    assertMultipleValues($, Number, 0, Infinity, NaN, new Number);
});

test('able to think type of naked value is equals to type of boxed value about `\'\'` and `new String`', $ => {
    assertMultipleValues($, String, '', new String);
});

test('able to think type of naked value is equals to type of boxed value about `/ /` and `new RegExp`', $ => {
    assertMultipleValues($, RegExp, / /, new RegExp);
});

test('able to think that both generator function and async function is a function', $ => {
    $.true([
        // Basic form of function declaration.
        function() {},
        new Function,

        // Lambda expression.
        () => {},

        // Class declaration.
        class {},

        // Generator declaration.
        function *() {},
        new GeneratorFunction,

        // Asynchronous function declaration.
        async function() {},
        async () => {},
        new AsyncFunction
    ].every(value => Type.of(value).is(Function)));
});
