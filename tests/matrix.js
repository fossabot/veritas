/* eslint-env mocha */
/* global Matrix */

import should from 'should';

describe('Matrix', () => {
    const matrix = new Matrix([ [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ] ]);
    const unsquared = new Matrix([ [ 1, 2, 3 ], [ 4, 5, 6 ] ]);
    const indexes = [ ...Array.dimentional(3, 3) ];

    describe('should be able to execute arithmetic operation without division', () => {
        it('with algebraic number', () => {
            const [ addition, subtraction, multiplication ] = [
                matrix.add(1), matrix.subtract(1), matrix.multiply(1)
            ];

            indexes.map(path => (
                Number(addition.element(...path))
            )).should.deepEqual([ 2, 3, 4, 5, 6, 7, 8, 9, 10 ]);

            indexes.map(path => (
                Number(subtraction.element(...path))
            )).should.deepEqual([ 0, 1, 2, 3, 4, 5, 6, 7, 8 ]);

            indexes.map(path => (
                Number(multiplication.element(...path))
            )).should.deepEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
        });

        it('with other matrix', () => {
            const [ addition, subtraction, multiplication ] = [
                matrix.add(matrix), matrix.subtract(matrix), matrix.multiply(matrix)
            ];

            indexes.map(path => (
                Number(addition.element(...path))
            )).should.deepEqual([ 2, 4, 6, 8, 10, 12, 14, 16, 18 ]);

            indexes.map(path => (
                Number(subtraction.element(...path))
            )).should.deepEqual([ 0, 0, 0, 0, 0, 0, 0, 0, 0 ]);

            indexes.map(path => (
                Number(multiplication.element(...path))
            )).should.deepEqual([ 30, 36, 42, 66, 81, 96, 102, 126, 150 ]);

            should.throws(() => matrix.multiply(new Matrix([ [ 1, 2 ], [ 3, 4 ] ])), RangeError);
        });
    });

    it('should be able to accept valid formed array', () => {
        should.throws(() => new Matrix(), TypeError);
        should.throws(() => new Matrix([]), TypeError);
        should.throws(() => new Matrix([ [], {} ]), TypeError);
        should.throws(() => new Matrix([ [ 1, 2 ], [ 3 ] ]), TypeError);
        should.throws(() => new Matrix([ [ 1, 2 ], [ 3, '4' ] ]), TypeError);
    });

    it('should be able to get size of both rows and columns', () => {
        matrix.rows.should.equal(3);
        matrix.columns.should.equal(3);
    });

    it('should be able to get specific element', () => {
        indexes.map(path => (
            matrix.element(...path)
        )).should.deepEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);
    });

    it('should be able to make transposed matrix', () => {
        matrix.transposed.data.should.deepEqual([ [ 1, 4, 7 ], [ 2, 5, 8 ], [ 3, 6, 9 ] ]);
    });

    it('should be able to make adjugate matrix', () => {
        matrix.adjugate.data.map(row => (
            row.map(element => Number(element))
        )).should.deepEqual([ [ -3, 6, -3 ], [ 6, -12, 6 ], [ -3, 6, -3 ] ]);

        should.throws(() => unsquared.adjugate, TypeError);
    });

    it('should be able to calculate trace', () => {
        Number(matrix.trace).should.equal(15);
        should.throws(() => unsquared.trace, TypeError);
    });

    it('should be able to calculate determinant', () => {
        Number(matrix.determinant).should.equal(0);
        should.throws(() => unsquared.determinant, TypeError);
    });

    it('should be able to calculate cofactor', () => {
        indexes.map(path => (
            Number(matrix.cofactor(...path))
        )).should.deepEqual([ -3, 6, -3, 6, -12, 6, -3, 6, -3 ]);

        should.throws(() => unsquared.determinant, TypeError);
    });

    it('should be able to calculate minor', () => {
        indexes.map(path => (
            Number(matrix.minor(...path))
        )).should.deepEqual([ -3, -6, -3, -6, -12, -6, -3, -6, -3 ]);

        should.throws(() => unsquared.determinant, TypeError);
    });

    it('should be able to make inverse matrix', () => {
        should.throws(() => matrix.inverse, RangeError);

        const inverse = new Matrix([ [ 0, 0, 1 ], [ 0, 1, 0 ], [ 1, 0, 0 ] ]).inverse;

        indexes.map(path => (
            Number(inverse.element(...path))
        )).should.deepEqual([ 0, 0, 1, 0, 1, 0, 1, 0, 0 ]);
    });

    it('should be able to make identity matrix', () => {
        const multiplied = matrix.multiply(Matrix.identityMatrix(3));

        indexes.map(path => (
            Number(multiplied.element(...path))
        )).should.deepEqual([ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]);

        should.throws(() => unsquared.determinant, TypeError);
    });
});
