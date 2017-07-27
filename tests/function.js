import test from 'ava';

test('able to identify a function', $ => {
    for(const target of [ undefined, null, Object, Function ]) {
        $.is(Function.getOwnIdentity(target), Function.getOwnIdentity(target));
    }

    for(const target of [ Object, Function ]) {
        $.is(target.identity, target.identity);
    }
});

test('able to check the prototype chain of a function', $ => {
    class Alfa {

    }

    class Bravo extends Alfa {

    }

    class Charlie extends Bravo {

    }

    const { prototypeChain } = Charlie;

    $.deepEqual(prototypeChain, [ Charlie, Bravo, Alfa, Function, Object ].map(constructor => constructor.prototype));
});

test('able to repress a function', $ => {
    const thrower = function thrower() {
        throw new Error;
    };

    $.throws(() => thrower());
    $.notThrows(() => thrower.repressed());
});

test('unable to identify not a function', $ => {
    for(const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
        $.throws(() => Function.getOwnIdentity(target), TypeError);
    }
});

test('able to overload functions', $ => {
    const convert = Function.overload(overloader => {
        overloader(Number, number => String(number));
        overloader(String, string => Number(string));
        overloader(() => NaN);
    });

    $.is(convert('123'), 123);
    $.is(convert(123), '123');
    $.true(Number.isNaN(convert(undefined)));

    const add = Function.overload(overloader => {
        overloader(Number, String, (alfa, bravo) => alfa + Number(bravo));
        overloader(String, Number, (alfa, bravo) => Number(alfa) + bravo);
    });

    $.is(add(123, '456'), 579);
    $.is(add('123', 456), 579);

    const getSum = Function.overload(overloader => {
        overloader(Number, number => number);
        overloader(Number, Number, (alfa, bravo) => alfa + bravo);
        overloader(Number, Number, Number, (alfa, bravo, charlie) => alfa + bravo + charlie);
        overloader(() => NaN);
    });

    $.is(getSum(123), 123);
    $.is(getSum(123, 456), 579);
    $.is(getSum(123, 456, 789), 1368);
    $.true(Number.isNaN(getSum('')));

    const typelessAdd = Function.overload(overloader => {
        overloader([ Number, String ], [ Number, String ], (alfa, bravo) => Number(alfa) + Number(bravo));
    });

    $.is(typelessAdd(123, '456'), 579);
    $.is(typelessAdd('123', 456), 579);
});

test('unable to overload functions if invalid conditition provided', $ => {
    const invalidOtherwiseConvert = Function.overload(overloader => {
        overloader(Number, number => String(number));
        overloader(123456789);
    });

    $.throws(() => invalidOtherwiseConvert('123'), TypeError);

    const undefinedOtherwiseConvert = Function.overload(() => {});

    $.throws(() => undefinedOtherwiseConvert('456'), TypeError);
});

test('able to hint type constraints', $ => {
    const toUpperCase = Function.typeHint(String, string => string.toUpperCase());
    const toDouble = Function.typeHint(Number, number => number * 2);

    $.is(toUpperCase('abc'), 'ABC');
    $.is(toDouble(123), 246);
    $.throws(() => toUpperCase(456), TypeError);
    $.throws(() => toDouble('def'), TypeError);

    const typelessToDouble = Function.typeHint([ Number, String ], number => Number(number) * 2);

    $.is(typelessToDouble(123), 246);
    $.is(typelessToDouble('123'), 246);
});

test('able to bind type constraints', $ => {
    const dateConsumer = date => date.toISOString();

    $.throws(() => dateConsumer('2016-01-01T00:00:00.000Z'), TypeError);

    const dateBoundConsumer = Function.typeBind(Date, dateConsumer);

    $.is(dateBoundConsumer('2016-01-01T00:00:00.000Z'), '2016-01-01T00:00:00.000Z');

    const nullify = Function.typeBind(null, argument => argument);

    for(const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
        $.is(nullify(target), null);
    }
});
