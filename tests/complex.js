/* global Complex */

import test from 'ava';

test('able to accept real number', $ => {
    $.throws(() => new Complex('0', 1), TypeError);
    $.throws(() => new Complex(0, '1'), TypeError);
});

test('able to provides arithmetic calculation features', $ => {
    const [ alpha, beta, gamma ] = [ 0.1, 0.2, 0.3 ].map(number => new Complex(number, number));

    // (0.1 + 0.1i) + (0.2 + 0.2i) = 0.3 + 0.3i
    $.is(String(alpha.add(beta)), String(gamma));

    // (0.2 + 0.2i) - (0.1 + 0.1i) = 0.1 + 0.1i
    $.is(String(beta.subtract(alpha)), String(alpha));

    // (0.1 + 0.1i) * (0.2 + 0.2i) = 0 + 0.04i
    $.is(String(alpha.multiply(beta)), '0 + 0.04i');

    // (0.1 + 0.1i) / (0.2 + 0.2i) = 0.25 + 0.02i
    $.is(String(alpha.divide(beta)), '0.25 + 0.02i');
});

test('immutable', $ => {
    const complex = new Complex(1, 0);

    $.throws(() => {
        [ complex.real, complex.imaginary ] = [ 2, 1 ];
    }, TypeError);

    $.is(String(complex), '1 + 0i');
});

test('able to make a complex from real number object', $ => {
    const [ number, complex ] = [ 1, new Complex(1, 0) ];

    $.is(String(Complex.from(number)), '1 + 0i');
    $.is(Complex.from(complex), complex);
    $.throws(() => Complex.from(Infinity), RangeError);
});

test('able to make a complex from valid string expression', $ => {
    $.is(String(Complex.from('1 + 0i')), '1 + 0i');
    $.is(String(Complex.from('1 - 0i')), '1 - 0i');
    $.throws(() => Complex.from('Hello'), SyntaxError);
});

test('unable to make a complex from invalid object', $ => {
    $.throws(() => Complex.from([]), TypeError);
    $.throws(() => Complex.from({}), TypeError);
    $.throws(() => Complex.from(true), TypeError);
    $.throws(() => Complex.from(/ /), TypeError);
});

test('able to make string from complex number object', $ => {
    $.is(String(Complex.from('1 + 0i')), Complex.from('1 + 0i').valueOf());
    $.is(String(Complex.from('1 + 0i')), Complex.from('1 + 0i').toString());
});

test('able to make conjugate complex number', $ => {
    const complex = new Complex(1, 1);
    const conjugate = complex.conjugate;

    $.is(String(complex.add(conjugate)), '2 + 0i');
});

test('able to provide pure imaginary number', $ => {
    $.is(String(Complex.pureImaginary), '0 + 1i');
});
