/* global Rational */

import Type from './type';

const numericRegExpChunk = '(?:(?:(?:0|[1-9]\\d*)\\.?(?:\\d*)?(?:[eE][+-]?\\d+)?|\\.\\d+(?:[eE][+-]?\\d+)?|(?:0|[1-9]\\d*)(?:[eE][+-]?\\d+)?)|0(?:[bB][01]+|[oO][0-7]+|[xX][0-9a-fA-F]+))';
const complexRegExp = new RegExp(`^(${numericRegExpChunk})\\s*\([+-])\\s*(${numericRegExpChunk})i$`);
const Real = () => [ Number, Rational ];

export default class Complex {
    /**
     * {Constructor} Complex
     * Constructs complex number system.
     *
     * @param {Number|Rational} real
     * @param {Number|Rational} imaginary
     **/
    constructor(real = 0, imaginary = 0) {
        const [ realType, imaginaryType ] = [ real, imaginary ].map(Type.of);

        if(!(realType.is(Number) || realType.is(Rational))) {
            throw new TypeError(`Type of real part ${real} is not a number`);
        }

        if(!(imaginaryType.is(Number) || imaginaryType.is(Rational))) {
            throw new TypeError(`Type of imaginary part ${imaginary} is not a number`);
        }

        this.real = realType.is(Number) ? Rational.from(real) : real;
        this.imaginary = imaginaryType.is(Number) ? Rational.from(imaginary) : imaginary;

        // Defines arithmetic calculation.
        this.enlarge({
            add: Function.overload(overloader => {
                /**
                 * {Function} Complex.prototype.add
                 * Executes addition calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Real(), number => this.add(Complex.from(number)));

                /**
                 * {Function} Complex.prototype.add
                 * Executes addition calculation with complex number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Complex, complex => (
                    new Complex(real.add(complex.real), imaginary.add(complex.imaginary))
                ));
            }),

            subtract: Function.overload(overloader => {
                /**
                 * {Function} Complex.prototype.subtract
                 * Executes subtraction calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Real(), number => this.subtract(Complex.from(number)));

                /**
                 * {Function} Complex.prototype.subtract
                 * Executes subtraction calculation with complex number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Complex, complex => {
                    return new Complex(real.subtract(complex.real), imaginary.subtract(complex.imaginary));
                });
            }),

            multiply: Function.overload(overloader => {
                /**
                 * {Function} Complex.prototype.multiply
                 * Executes multiplication calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Real(), number => this.multiply(Complex.from(number)));

                /**
                 * {Function} Complex.prototype.multiply
                 * Executes multiplication calculation with complex number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Complex, complex =>  new Complex(
                    real.multiply(complex.real).subtract(imaginary.multiply(complex.imaginary)),
                    imaginary.multiply(complex.real).add(real.multiply(complex.imaginary)
                )));
            }),

            divide: Function.overload(overloader => {
                /**
                 * {Function} Complex.prototype.divide
                 * Executes division calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Real(), number => this.divide(Complex.from(number)));

                /**
                 * {Function} Complex.prototype.divide
                 * Executes division calculation with complex number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Complex, complex => {
                    const commonDivisor = complex.real.multiply(complex.real).add(complex.imaginary.multiply(complex.imaginary));

                    return new Complex(
                        real.multiply(complex.real).add(imaginary.multiply(complex.imaginary)).divide(commonDivisor),
                        imaginary.multiply(complex.real)).subtract(real.multiply(complex.imaginary).divide(commonDivisor)
                    );
                });
            })
        });

        // Makes this instance to immutable.
        Object.freeze(this);
    }

    /**
     * {Function} Complex.from
     * Makes complex number from a number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational}
     **/
    static from(target) {
        const targetType = Type.of(target);

        if(targetType.is(Complex)) {
            return target;
        }

        if(targetType.is(Number) || targetType.is(Rational)) {
            return new Complex(target, 0);
        }

        if(targetType.is(String)) {
            if(!complexRegExp.test(target)) {
                throw new SyntaxError(`${target} is not valid format of complex number`);
            }

            const [ real, sign, imaginary ] = complexRegExp.exec(target).slice(1);

            return new Complex(Number(real), Number(imaginary) * (sign === '+' ? 1 : -1));
        }

        throw new TypeError(`${target} is not a number`);
    }

    /**
     * {Function} Complex.prototype.valueOf
     * Returns stringified expression of the complex number.
     *
     * @return {String}
     **/
    valueOf() {
        return this.toString();
    }

    /**
     * {Function} Complex.prototype.toString
     * Returns stringified expression of the complex number.
     *
     * @return {String}
     **/
    toString() {
        const { real, imaginary } = this;

        return `${real} ${imaginary.sign} ${Math.abs(imaginary)}i`;
    }

    /**
     * {Getter} Complex.prototype.conjugate
     * Returns conjugate of the complex number.
     *
     * @return {Complex}
     **/
    get conjugate() {
        return new Complex(this.real, this.imaginary.multiply(-1));
    }
}

Complex.enlarge({
    get pureImaginary() {
        return new Complex(0, 1);
    }
});
