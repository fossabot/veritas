/* global Complex Calculator */

import test from 'ava';

const random = Math.random();
const complex = new Complex(random, random);

const compareMercifully = (alpha, beta, precision = 16) => (
    Math.abs(alpha - beta) <= Number.EPSILON ||
    String(alpha - beta).replace(/.*e-(1\d)$/, '$1') >= precision ||
    compareMercifully(alpha, beta, precision - 1)
);

test('able to calculate value of sine function about the real number', $ => {
    $.true(compareMercifully(Calculator.sin(random), Math.sin(random)));
});

test('able to calculate value of sine function about the complex number', $ => {
    const { real, imaginary } = Calculator.sin(complex);

    $.true(compareMercifully(real, Math.sin(random) * Math.cosh(random)));
    $.true(compareMercifully(imaginary, Math.cos(random) * Math.sinh(random)));
});

test('able to calculate value of cosine function about the real number', $ => {
    $.is(Calculator.cos(random), Math.cos(random));
});

test('able to calculate value of cosine function about the complex number', $ => {
    const { real, imaginary } = Calculator.cos(complex);

    $.true(compareMercifully(real, Math.cos(random) * Math.cosh(random)));
    $.true(compareMercifully(imaginary, -Math.sin(random) * Math.sinh(random)));
});

test('able to calculate value of tangent function about the real number', $ => {
    $.true(compareMercifully(Calculator.tan(random), Math.tan(random)));
});

test('able to calculate value of tangent function about the complex number', $ => {
    $.is(String(Calculator.tan(complex)), String(Calculator.sin(complex).divide(Calculator.cos(complex))));
});

test('able to calculate value of secant function about the real number', $ => {
    $.true(compareMercifully(Calculator.sec(random), 1 / Math.cos(random)));
});

test('able to calculate value of secant function about the complex number', $ => {
    $.is(String(Calculator.sec(complex)), String((1).divide(Calculator.cos(complex))));
});

test('able to calculate value of cosecant function about the real number', $ => {
    $.true(compareMercifully(Calculator.csc(random), 1 / Math.sin(random)));
});

test('able to calculate value of cosecant function about the complex number', $ => {
    $.is(String(Calculator.csc(complex)), String((1).divide(Calculator.sin(complex))));
});

test('able to calculate value of cotangent function about the real number', $ => {
    $.true(compareMercifully(Calculator.cot(random), 1 / Math.cos(random)));
});

test('able to calculate value of cotangent function about the complex number', $ => {
    $.is(String(Calculator.cot(complex)), String((1).divide(Calculator.tan(complex))));
});

test('able to calculate value of hyperbolic sine function about the real number', $ => {
    $.is(Calculator.sinh(random), Math.sinh(random));
});

test('able to calculate value of hyperbolic sine function about the complex number', $ => {
    const { real, imaginary } = Calculator.sinh(complex);

    $.true(compareMercifully(real, Math.sinh(random) * Math.cos(random)));
    $.true(compareMercifully(imaginary, Math.cosh(random) * Math.sin(random)));
});

test('able to calculate value of hyperbolic cosine function about the real number', $ => {
    $.is(Calculator.cosh(random), Math.cosh(random));
});

test('able to calculate value of hyperbolic cosine function about the complex number', $ => {
    const { real, imaginary } = Calculator.cosh(complex);

    $.true(compareMercifully(real, Math.cosh(random) * Math.cos(random)));
    $.true(compareMercifully(imaginary, Math.sinh(random) * Math.sin(random)));
});

test('able to calculate value of hyperbolic tangent function about the real number', $ => {
    $.true(compareMercifully(Calculator.tanh(random), Math.tanh(random)));
});

test('able to calculate value of hyperbolic tangent function about the complex number', $ => {
    $.is(String(Calculator.tanh(complex)), String(Calculator.sinh(complex).divide(Calculator.cosh(complex))));
});

test('able to calculate value of hyperbolic secant function about the real number', $ => {
    $.true(compareMercifully(Calculator.sech(random), 1 / Math.cosh(random)));
});

test('able to calculate value of hyperbolic secant function about the complex number', $ => {
    $.is(String(Calculator.sech(complex)), String((1).divide(Calculator.cosh(complex))));
});

test('able to calculate value of hyperbolic cosecant function about the real number', $ => {
    $.true(compareMercifully(Calculator.csch(random), 1 / Math.sinh(random)));
});

test('able to calculate value of hyperbolic cosecant function about the complex number', $ => {
    $.is(String(Calculator.csch(complex)), String((1).divide(Calculator.sinh(complex))));
});

test('able to calculate value of hyperbolic cotangent function about the real number', $ => {
    $.true(compareMercifully(Calculator.coth(random), 1 / Math.tanh(random)));
});

test('able to calculate value of hyperbolic cotangent function about the complex number', $ => {
    $.is(String(Calculator.coth(complex)), String((1).divide(Calculator.tanh(complex))));
});

test('able to calculate value of exponential function about the real number', $ => {
    $.is(Calculator.exp(random), Math.exp(random));
});

test('able to calculate value of exponential function about the complex number', $ => {
    const { real, imaginary } = Calculator.exp(complex);

    $.true(compareMercifully(real, Math.exp(random) * Math.cos(random)));
    $.true(compareMercifully(imaginary, Math.exp(random) * Math.sin(random)));
});

test('able to calculate value of natural logarithm function about the real number', $ => {
    $.is(Calculator.log(random), Math.log(random));

    const { real, imaginary } = Calculator.log(-random);

    $.true(compareMercifully(real, Math.log(random)));
    $.true(compareMercifully(imaginary, Math.PI));
});

test('able to calculate value of natural logarithm function about the complex number', $ => {
    const { real, imaginary } = Calculator.log(complex);

    $.true(compareMercifully(real, Math.log(Math.sqrt(2 * random * random))));
    $.true(compareMercifully(imaginary, Math.atan2(random, random)));
    $.is(Calculator.log(new Complex(0, 0)), -Infinity);
});

test('able to calculate value of powered function about the real number', $ => {
    $.is(Calculator.pow(random, random), Math.pow(random, random));
});

test('able to calculate value of powered function about the complex number', $ => {
    $.is(String(Calculator.pow(complex, complex)), String(Calculator.exp(complex.multiply(Calculator.log(complex)))));
});

test('able to calculate value of square root function about the real number', $ => {
    $.is(Calculator.sqrt(random), Math.sqrt(random));
});

test('able to calculate value of square root function about the complex number', $ => {
    $.is(String(Calculator.sqrt(complex)), String(Calculator.pow(complex, 1 / 2)));
});

test('able to calculate value of cubic root function about the real number', $ => {
    $.is(Calculator.cbrt(random), Math.cbrt(random));
});

test('able to calculate value of cubic root function about the complex number', $ => {
    $.is(String(Calculator.cbrt(complex)), String(Calculator.pow(complex, 1 / 3)));
});

test('able to calculate value of square powered function about the real number', $ => {
    $.is(Calculator.square(random), Math.pow(random, 2));
});

test('able to calculate value of square powered function about the complex number', $ => {
    $.is(String(Calculator.square(complex)), String(Calculator.pow(complex, 2)));
});

test('able to calculate value of cubic powered function about the real number', $ => {
    $.is(Calculator.cube(random), Math.pow(random, 3));
});

test('able to calculate value of cubic powered function about the complex number', $ => {
    $.is(String(Calculator.cube(complex)), String(Calculator.pow(complex, 3)));
});

test('able to calculate value of absolute function about the real number', $ => {
    $.is(Calculator.abs(random), Math.abs(random));
});

test('able to calculate value of absolute function about the complex number', $ => {
    $.true(compareMercifully(Calculator.abs(complex), Math.sqrt(2 * random * random)));
});
