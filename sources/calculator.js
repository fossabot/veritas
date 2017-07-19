import Rational from './rational';
import Complex from './complex';
import Type from './type';

const Real = [ Number, Rational ];

const Calculator = {
    sin: Function.overload(overloader => {
        /**
         * {Function} Calculator.sin
         * Calculates sine value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.sin(number));

        /**
         * {Function} Calculator.sin
         * Calculates sine value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, ({ real, imaginary }) => new Complex(
            Calculator.sin(real).multiply(Calculator.cosh(imaginary)),
            Calculator.cos(real).multiply(Calculator.sinh(imaginary))
        ));
    }),

    cos: Function.overload(overloader => {
        /**
         * {Function} Calculator.cos
         * Calculates cosine value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.cos(number));

        /**
         * {Function} Calculator.cos
         * Calculates cosine value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, ({ real, imaginary }) => new Complex(
            Calculator.cos(real).multiply(Calculator.cosh(imaginary)),
            Calculator.sin(real).multiply(Calculator.sinh(imaginary)).multiply(-1)
        ));
    }),

    /**
     * {Function} Calculator.tan
     * Calculates tangent value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    tan(number) {
        return Calculator.sin(number).divide(Calculator.cos(number));
    },

    /**
     * {Function} Calculator.sec
     * Calculates secant value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    sec(number) {
        return (1).divide(Calculator.cos(number));
    },

    /**
     * {Function} Calculator.csc
     * Calculates cosecant value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    csc(number) {
        return (1).divide(Calculator.sin(number));
    },

    /**
     * {Function} Calculator.cot
     * Calculates cotangent value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    cot(number) {
        return (1).divide(Calculator.tan(number));
    },

    /**
     * {Function} Calculator.sinh
     * Calculates hyperbolic sine value of the number.
     *
     * @param {Number|Rational|Complex}
     * @return {Rational|Complex}
     **/
    sinh(number) {
        return Calculator.exp(number).subtract(Calculator.exp(number.multiply(-1))).divide(2);
    },

    /**
     * {Function} Calculator.cosh
     * Calculates hyperbolic cosine value of the number.
     *
     * @param {Number|Rational|Complex}
     * @return {Rational|Complex}
     **/
    cosh(number) {
        return Calculator.exp(number).add(Calculator.exp(number.multiply(-1))).divide(2);
    },

    /**
     * {Function} Calculator.tanh
     * Calculates hyperbolic tangent value of the number.
     *
     * @param {Number|Rational|Complex}
     * @return {Rational|Complex}
     **/
    tanh(number) {
        return Calculator.sinh(number).divide(Calculator.cosh(number));
    },

    /**
     * {Function} Calculator.sec
     * Calculates hyperbolic secant value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    sech(number) {
        return (1).divide(Calculator.cosh(number));
    },

    /**
     * {Function} Calculator.csc
     * Calculates hyperbolic cosecant value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    csch(number) {
        return (1).divide(Calculator.sinh(number));
    },

    /**
     * {Function} Calculator.cot
     * Calculates hyperbolic cotangent value of the number.
     *
     * @param {Number|Rational|Complex} number
     * @return {Rational|Complex}
     **/
    coth(number) {
        return (1).divide(Calculator.tanh(number));
    },

    exp: Function.overload(overloader => {
        /**
         * {Function} Calculator.exp
         * Calculates value of `e ^ x`.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.exp(number));

        /**
         * {Function} Calculator.exp
         * Calculates value of `e ^ (a + bi)`.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, ({ real, imaginary }) => new Complex(
            Calculator.exp(real).multiply(Calculator.cos(imaginary)),
            Calculator.exp(real).multiply(Calculator.sin(imaginary))
        ));
    }),

    log: Function.overload(overloader => {
        /**
         * {Function} Calculator.log
         * Calculates log value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number|Complex}
         **/
        overloader(Real, number => (
            number >= 0 ? Math.log(number) : new Complex(Math.log(-number), Math.PI)
        ));

        /**
         * {Function} Calculator.log
         * Calculates log value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, complex => !(complex.real + complex.imaginary) ? -Infinity : new Complex(
            Calculator.log(Calculator.abs(complex)),
            Math.atan2(complex.imaginary, complex.real)
        ));
    }),


    pow(alpha, beta) {
        if([ alpha, beta ].every(target => Type.of(target).is(Real))) {
            return Math.pow(alpha, beta);
        }

        return Calculator.exp(beta.multiply(Calculator.log(alpha)));
    },

    sqrt: Function.overload(overloader => {
        /**
         * {Function} Calculator.sqrt
         * Calculates square root value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.sqrt(number));

        /**
         * {Function} Calculator.sqrt
         * Calculates square root value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, complex => Calculator.pow(complex, 1 / 2));
    }),

    cbrt: Function.overload(overloader => {
        /**
         * {Function} Calculator.cbrt
         * Calculates cubic root value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.cbrt(number));

        /**
         * {Function} Calculator.cbrt
         * Calculates cubic root value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, complex => Calculator.pow(complex, 1 / 3));
    }),

    /**
     * {Function} calculate.square
     * Calculates value of `x ^ 2`.
     *
     * @param {Number|Rational|Complex} number
     * @return {Number|Complex}
     **/
    square(number) {
        return Calculator.pow(number, 2);
    },

    /**
     * {Function} calculate.cube
     * Calculates value of `x ^ 3`.
     *
     * @param {Number|Rational|Complex} number
     * @return {Number|Complex}
     **/
    cube(number) {
        return Calculator.pow(number, 3);
    },

    abs: Function.overload(overloader => {
        /**
         * {Function} Calculator.abs
         * Calculates absolute value of the real number.
         *
         * @param {Number|Rational} number
         * @return {Number}
         **/
        overloader(Real, number => Math.abs(number));

        /**
         * {Function} Calculator.abs
         * Calculates absolute value of the complex number.
         *
         * @param {Complex} complex
         * @return {Complex}
         **/
        overloader(Complex, ({ real, imaginary }) => (
            Calculator.sqrt(real.multiply(real).add(imaginary.multiply(imaginary)))
        ));
    }),
};

export default Calculator;
