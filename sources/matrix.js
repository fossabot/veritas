import Rational from './rational';
import Complex from './complex';
import Type from './type';

const Numeric = [ Number, Rational, Complex ];

export default class Matrix {
    /**
     * {Constructor} Matrix
     * Linear algebraic matrix system.
     **/
    constructor(data) {
        if(!Array.isArray(data)) {
            throw new TypeError(`${data} is not an array`);
        }

        const validation = (
            // A matrix should not be empty.
            data.length &&

            // Every row of the matrix should be an array.
            data.every(row => Array.isArray(row)) &&

            // Every column length of the matrix should be the same.
            data.map(row => row.length).reduce((current, next) => current === next ? next : false) &&

            // Every element of the matrix should be a number.
            data.every(row => row.every(column => Type.of(column).is(Numeric)))
        );

        if(!validation) {
            throw new TypeError(`${data} is not valid form of matrix`);
        }

        this.data = data;

        this.enlarge({
            add: Function.overload(overloader => {
                /**
                 * {Function} Matrix.prototype.add
                 * Executes addition calculation with a number.
                 *
                 * @param {Number|Rational|Complex} number
                 * @return {Matrix}
                 **/
                overloader(Numeric, number => {
                    const data = Array.allocate(this.rows, () => Array.allocate(this.columns, () => null));

                    for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                        for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                            data[columnIndex][rowIndex] = this.element(rowIndex, columnIndex).add(number);
                        }
                    }

                    return new Matrix(data);
                });

                /**
                 * {Function} Matrix.prototype.add
                 * Executes addition calculation with a matrix.
                 *
                 * @param {Matrix} number
                 * @return {Matrix}
                 **/
                overloader(Matrix, matrix => {
                    const data = Array.allocate(this.rows, () => Array.allocate(this.columns, () => null));

                    for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                        for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                            data[columnIndex][rowIndex] = this.element(rowIndex, columnIndex).add(matrix.element(rowIndex, columnIndex));
                        }
                    }

                    return new Matrix(data);
                });
            }),

            /**
             * {Function} Matrix.prototype.add
             * Executes subtraction calculation.
             *
             * @param {Number|Rational|Complex|Matrix} target
             * @return {Matrix}
             **/
            subtract: Function.typeHint([ ...Numeric, Matrix ], target => this.add(target.multiply(-1))),

            multiply: Function.overload(overloader => {
                /**
                 * {Function} Matrix.prototype.add
                 * Executes multiplication calculation with a number.
                 *
                 * @param {Number|Rational|Complex} number
                 * @return {Matrix}
                 **/
                overloader(Numeric, number => {
                    const data = Array.allocate(this.rows, () => Array.allocate(this.columns, () => null));

                    for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                        for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                            data[columnIndex][rowIndex] = this.element(rowIndex, columnIndex).multiply(number);
                        }
                    }

                    return new Matrix(data);
                });

                /**
                 * {Function} Matrix.prototype.add
                 * Executes multiplication calculation with a matrix.
                 *
                 * @param {Matrix} number
                 * @return {Matrix}
                 **/
                overloader(Matrix, matrix => {
                    if(this.columns !== matrix.rows) {
                        throw new RangeError('Rows size of the matrix is not the same with column size of provided matrix');
                    }

                    const data = Array.allocate(this.rows, () => Array.allocate(this.columns, () => null));

                    for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
                        for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                            data[rowIndex][columnIndex] = Array.allocate(this.rows, (element, index) => index).reduce((current, next) => (
                                this.element(rowIndex, next).multiply(matrix.element(next, columnIndex)).add(current)
                            ), 0);
                        }
                    }

                    return new Matrix(data);
                });
            })
        });

        // Makes this instance to immutable.
        Object.glaciate(this);
    }

    /**
     * {Getter} Matrix.prototype.rows
     * Returns row length of the matrix.
     *
     * @return {Number}
     **/
    get rows() {
        return this.data.length;
    }

    /**
     * {Getter} Matrix.prototype.columns
     * Returns column length of the matrix.
     *
     * @return {Number}
     **/
    get columns() {
        return this.data[0].length;
    }

    /**
     * {Function} Matrix.prototype.element
     * Returns selected element of the matrix.
     *
     * @param {Number} row
     * @param {Number} column
     * @return {Number|Rational|Complex}
     **/
    element(row, column) {
        return this.data[row][column];
    }

    /**
     * {Getter} Matrix.prototype.transposed
     * Makes transposed matrix.
     *
     * @return {Matrix}
     **/
    get transposed() {
        const data = Array.allocate(this.columns, () => Array.allocate(this.rows, () => null));

        for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                data[columnIndex][rowIndex] = this.element(rowIndex, columnIndex);
            }
        }

        return new Matrix(data);
    }

    /**
     * {Getter} Matrix.prototype.adjugate
     * Makes adjugate matrix.
     *
     * @return {Matrix}
     **/
    get adjugate() {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        const data = Array.allocate(this.rows, () => Array.allocate(this.columns, () => null));

        for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                data[rowIndex][columnIndex] = this.cofactor(rowIndex, columnIndex);
            }
        }

        return new Matrix(data).transposed;
    }

    /**
     * {Getter} Matrix.prototype.trace
     * Calculates trace of the matrix.
     *
     * @return {Number}
     **/
    get trace() {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        return this.data.map((row, index) => row[index]).reduce((current, next) => current + next, 0);
    }

    /**
     * {Getter} Matrix.prototype.determinant
     * Calculates determinant of the matrix.
     *
     * @return {Number}
     **/
    get determinant() {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        switch(this.rows) {
            case 1:
                return this.element(0, 0);

            case 2:
                return this.element(0, 0).multiply(this.element(1, 1)).subtract(this.element(0, 1).multiply(this.element(1, 0)));
        }

        return Array.allocate(this.rows, (element, index) => index).reduce((current, next) => (
            current.add(this.element(0, next).multiply(this.cofactor(0, next)))
        ), 0);
    }

    /**
     * {Function} Matrix.prototype.cofactor
     * Calculates cofactor of the matrix.
     *
     * @param {Number} row
     * @param {Number} column
     * @return {Number}
     **/
    cofactor(row, column) {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        return Math.pow(-1, row.add(column)).multiply(this.minor(row, column));
    }

    /**
     * {Function} Matrix.prototype.minor
     * Calculates minor of the matrix.
     *
     * @param {Number} row
     * @param {Number} column
     * @return {Number}
     **/
    minor(row, column) {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        const data = Array.allocate(this.rows - 1, () => Array.allocate(this.columns - 1, () => null));

        for(let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            if(rowIndex === row) {
                continue;
            }

            for(let columnIndex = 0; columnIndex < this.columns; columnIndex++) {
                if(columnIndex === column) {
                    continue;
                }

                data[rowIndex > row ? rowIndex - 1 : rowIndex][columnIndex > column ? columnIndex - 1 : columnIndex] = this.element(rowIndex, columnIndex);
            }
        }

        return new Matrix(data).determinant;
    }

    /**
     * {Getter} Matrix.prototype.inverse
     * Makes inverse matrix.
     *
     * @return {Matrix}
     **/
    get inverse() {
        if(this.rows !== this.columns) {
            throw new TypeError('The matrix is not square form');
        }

        const { determinant } = this;

        if(!determinant) {
            throw new RangeError('Determinant of the matrix is equals to 0');
        }

        return this.adjugate.multiply((1).divide(determinant));
    }

    /**
     * {Function} Matrix.identityMatrix
     * Makes identity matrix.
     *
     * @param {Number} size
     * @return {Matrix}
     **/
    static identityMatrix(size) {
        const data = Array.allocate(size, (row, rowIndex) => (
            Array.allocate(size, (column, columnIndex) => rowIndex === columnIndex ? 1 : 0)
        ));

        return new Matrix(data);
    }
}
