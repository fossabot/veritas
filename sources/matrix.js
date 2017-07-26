import Rational from './rational';
import Complex from './complex';
import Type from './type';

const Numeric = [ Number, Rational, Complex ];
const initializeData = (rows, columns) => Array.allocate(rows, () => Array.allocate(columns, () => null));

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
                    const { rows, columns } = this;
                    const data = initializeData(rows, columns);

                    for(const [ row, column ] of Array.dimentional(rows, columns)) {
                        data[row][column] = this.element(row, column).add(number);
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
                    const { rows, columns } = this;
                    const data = initializeData(rows, columns);

                    for(const [ row, column ] of Array.dimentional(rows, columns)) {
                        data[row][column] = this.element(row, column).add(matrix.element(row, column));
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
                    const { rows, columns } = this;
                    const data = initializeData(rows, columns);

                    for(const [ row, column ] of Array.dimentional(rows, columns)) {
                        data[row][column] = this.element(row, column).multiply(number);
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
                    const { rows, columns } = this;

                    if(columns !== matrix.rows) {
                        throw new RangeError('Rows size of the matrix is not the same with column size of provided matrix');
                    }

                    const data = initializeData(rows, columns);

                    for(const [ row, column ] of Array.dimentional(rows, columns)) {
                        data[row][column] = [ ...Array.range(rows) ].reduce((current, next) => (
                            this.element(row, next).multiply(matrix.element(next, column)).add(current)
                        ), 0);
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
        const { rows, columns } = this;
        const data = initializeData(columns, rows);

        for(const [ row, column ] of Array.dimentional(rows, columns)) {
            data[column][row] = this.element(row, column);
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
        const { rows, columns } = this;

        if(rows !== columns) {
            throw new TypeError('The matrix is not square form');
        }

        const data = initializeData(rows, columns);

        for(const [ row, column ] of Array.dimentional(rows, columns)) {
            data[column][row] = this.cofactor(row, column);
        }

        return new Matrix(data);
    }

    /**
     * {Getter} Matrix.prototype.trace
     * Calculates trace of the matrix.
     *
     * @return {Number}
     **/
    get trace() {
        const { rows, columns } = this;

        if(rows !== columns) {
            throw new TypeError('The matrix is not square form');
        }

        return this.data.map((row, index) => row[index]).sum;
    }

    /**
     * {Getter} Matrix.prototype.determinant
     * Calculates determinant of the matrix.
     *
     * @return {Number}
     **/
    get determinant() {
        const { rows, columns } = this;

        if(rows !== columns) {
            throw new TypeError('The matrix is not square form');
        }

        switch(rows) {
            case 1:
                return this.element(0, 0);

            case 2:
                return this.element(0, 0).multiply(this.element(1, 1)).subtract(this.element(0, 1).multiply(this.element(1, 0)));
        }

        return [ ...Array.range(rows) ].reduce((current, next) => (
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
        const { rows, columns } = this;

        if(rows !== columns) {
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
        const { rows, columns } = this;

        if(rows !== columns) {
            throw new TypeError('The matrix is not square form');
        }

        const data = initializeData(rows - 1, columns - 1);

        for(const [ rowIndex, columnIndex ] of Array.dimentional(rows, columns)) {
            if(rowIndex === row || columnIndex === column) {
                continue;
            }

            data[rowIndex - (rowIndex > row ? 1 : 0)][columnIndex - (columnIndex > column ? 1 : 0)] = this.element(rowIndex, columnIndex);
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
        const { rows, columns, determinant } = this;

        if(rows !== columns) {
            throw new TypeError('The matrix is not square form');
        }

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
