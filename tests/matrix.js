/* global Matrix */

import test from 'ava';

const matrix = new Matrix([ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]);
const unsquared = new Matrix([ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
const indexes = [ ...Array.dimentional(3, 3) ];

test('able to execute arithmetic operation without division with algebraic number', $ => {
    const [ addition, subtraction, multiplication ] = [
        matrix.add(1), matrix.subtract(1), matrix.multiply(1)
    ];

    $.deepEqual(indexes.map(path => Number(addition.element(...path))), [ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);
    $.deepEqual(indexes.map(path => Number(subtraction.element(...path))), [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);
    $.deepEqual(indexes.map(path => Number(multiplication.element(...path))), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
});

test('able to execute arithmetic operation without division with other matrix', $ => {
    const [ addition, subtraction, multiplication ] = [
        matrix.add(matrix), matrix.subtract(matrix), matrix.multiply(matrix)
    ];

    $.deepEqual(indexes.map(path => Number(addition.element(...path))), [ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);
    $.deepEqual(indexes.map(path => Number(subtraction.element(...path))), [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);
    $.deepEqual(indexes.map(path => Number(multiplication.element(...path))), [ 30, 36, 42, 66, 81, 96, 102, 126, 150 ]);
    $.throws(() => matrix.multiply(new Matrix([ [ 1, 2 ], [ 3, 4 ] ])), RangeError);
});

test('able to accept valid formed array', $ => {
    $.throws(() => new Matrix(), TypeError);
    $.throws(() => new Matrix([]), TypeError);
    $.throws(() => new Matrix([ [], {} ]), TypeError);
    $.throws(() => new Matrix([ [ 1, 2 ], [ 3 ] ]), TypeError);
    $.throws(() => new Matrix([ [ 1, 2 ], [ 3, '4' ] ]), TypeError);
});

test('able to get size of both rows and columns', $ => {
    $.is(matrix.rows, 3);
    $.is(matrix.columns, 3);
});

test('able to get specific element', $ => {
    $.deepEqual(indexes.map(path => matrix.element(...path)), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
});

test('able to make transposed matrix', $ => {
    $.deepEqual(matrix.transposed.data, [ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ]);
});

test('able to make adjugate matrix', $ => {
    $.deepEqual(matrix.adjugate.data.map(row => (
        row.map(element => Number(element))
    )), [ [ -3, 6, -3 ], [ 6, -12, 6 ], [ -3, 6, -3 ] ]);

    $.throws(() => unsquared.adjugate, TypeError);
});

test('able to calculate trace', $ => {
    $.is(Number(matrix.trace), 15);
    $.throws(() => unsquared.trace, TypeError);
});

test('able to calculate determinant', $ => {
    const random = Math.random();

    $.is(Number(new Matrix([ [ random ] ]).determinant), random);
    $.is(Number(matrix.determinant), 0);
    $.throws(() => unsquared.determinant, TypeError);
});

test('able to calculate cofactor', $ => {
    $.deepEqual(indexes.map(path => Number(matrix.cofactor(...path))), [ -3, 6, -3, 6, -12, 6, -3, 6, -3 ]);
    $.throws(() => unsquared.cofactor(0, 0), TypeError);
});

test('able to calculate minor', $ => {
    $.deepEqual(indexes.map(path => Number(matrix.minor(...path))), [ -3, -6, -3, -6, -12, -6, -3, -6, -3 ]);
    $.throws(() => unsquared.minor(0, 0), TypeError);
});

test('able to make inverse matrix', $ => {
    $.throws(() => matrix.inverse, RangeError);

    const inverse = new Matrix([ [ 0, 0, 1 ], [ 0, 1, 0 ], [ 1, 0, 0 ] ]).inverse;

    $.deepEqual(indexes.map(path => Number(inverse.element(...path))), [ -0, 0, 1, 0, 1, 0, 1, 0, -0 ]);
    $.throws(() => unsquared.inverse, TypeError);
});

test('able to make identity matrix', $ => {
    const multiplied = matrix.multiply(Matrix.identityMatrix(3));

    $.deepEqual(indexes.map(path => Number(multiplied.element(...path))), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
});
