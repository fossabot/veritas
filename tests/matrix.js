/* eslint-env mocha */
/* global Matrix */

import should from 'should';

describe('Matrix', () => {
    const matrix = new Matrix([ [ 1, 2 ], [ 3, 4 ] ]);

    it('should be able to accept valid formed array', () => {
        should.throws(() => new Matrix(), TypeError);
        should.throws(() => new Matrix([]), TypeError);
        should.throws(() => new Matrix([ [], {} ]), TypeError);
        should.throws(() => new Matrix([ [ 1, 2 ], [ 3 ] ]), TypeError);
        should.throws(() => new Matrix([ [ 1, 2 ], [ 3, '4' ] ]), TypeError);
    });

    it('should be able to get size of both rows and columns', () => {
        matrix.rows.should.equal(2);
        matrix.columns.should.equal(2);
    });

    it('should be able to get specific element', () => {
        [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].map(path => (
            matrix.element(...path)
        )).should.deepEqual([ 1, 2, 3, 4 ]);
    });

    it('should be able to make transposed matrix', () => {
        matrix.transposed.data.should.deepEqual([ [ 1, 3 ], [ 2, 4 ] ]);
    });

    it('should be able to make adjugate matrix', () => {
        matrix.adjugate.data.map(row => (
            row.map(element => Number(element))
        )).should.deepEqual([ [ 4, -2 ], [ -3, 1 ] ]);
    });

    it('should be able to calculate trace', () => {
        Number(matrix.trace).should.equal(5);
    });

    it('should be able to calculate determinant', () => {
        Number(matrix.determinant).should.equal(-2);
    });

    it('should be able to calculate cofactor', () => {
        [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].map(path => (
            matrix.cofactor(...path)
        )).map(element => (
            Number(element)
        )).should.deepEqual([ 4, -3, -2, 1 ]);
    });

    it('should be able to calculate minor', () => {
        [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].map(path => (
            matrix.minor(...path)
        )).map(element => (
            Number(element)
        )).should.deepEqual([ 4, 3, 2, 1 ]);
    });

    it('should be able to make inverse matrix', () => {
        const inverse = matrix.inverse;

        [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].map(path => (
            inverse.element(...path)
        )).map(element => (
            Number(element)
        )).should.deepEqual([ -2, 1, 1.5, -0.5 ]);
    });

    it('should be able to make identity matrix', () => {
        const multiplied = matrix.multiply(Matrix.identityMatrix(2));

        [ [ 0, 0 ], [ 0, 1 ], [ 1, 0 ], [ 1, 1 ] ].map(path => (
            multiplied.element(...path)
        )).map(element => (
            Number(element)
        )).should.deepEqual([ 1, 2, 3, 4 ]);
    });
});
