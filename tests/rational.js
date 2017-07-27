/* global Rational */

import test from 'ava';

test('able to take a sign of the number', $ => {
    $.deepEqual([ 0, -0, 0.1, -0.1 ].map(element => Rational.from(element).sign), [ '+', '-', '+', '-' ]);
});

test('able to accept finite number', $ => {
    $.throws(() => new Rational('0', 1), TypeError);
    $.throws(() => new Rational(0, '1'), TypeError);
    $.throws(() => new Rational(Infinity, 1), RangeError);
    $.throws(() => new Rational(0, Infinity), RangeError);
});

test('immutable', $ => {
    const rational = new Rational(1, 10);

    $.throws(() => {
        [ rational.dividend, rational.divisor ] = [ 2, 5 ];
    }, TypeError);

    $.is(Number(rational), 0.1);
});

test('able to make a rational from number object', $ => {
    const [ number, rational ] = [ 0.1, new Rational(1, 10) ];

    $.is(Number(Rational.from(number)), number);
    $.is(Rational.from(rational), rational);
    $.throws(() => Rational.from(Infinity), RangeError);
});
