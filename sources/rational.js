/* global Complex */

import Type from './type';

const gcd = Function.typeBind(Number, Number, (alpha, beta) => alpha % beta ? gcd(beta, alpha % beta) : beta);

const fractionize = Function.typeBind(Number, number => {
    if(number === Math.floor(number)) {
        return { dividend: number, divisor: 1 };
    }

    if(1 / number === Math.floor(1 / number)) {
        return { dividend: 1, divisor: 1 / number };
    }

    let [ dividend, divisor, exponent ] = [ number, 1, 0 ];

    while(dividend * Math.pow(10, exponent) !== Math.floor(dividend * Math.pow(10, exponent))) {
        exponent += 1;
    }

    // Makes the number that expressed decimal to fractional expression.
    [ dividend, divisor ] = [ dividend, divisor ].map(element => element * Math.pow(10, exponent));

    // Reducts the fraction.
    [ dividend, divisor ] = [ dividend, divisor ].map(element => element / gcd(dividend, divisor));

    return { dividend, divisor };
});

export default class Rational {
    /**
     * {Constructor} Rational
     * Constructs rational number system.
     *
     * @param {Number} dividend
     * @param {Number} divisor
     **/
    constructor(dividend = 0, divisor = 1) {
        if(!Type.of(dividend).is(Number)) {
            throw new TypeError(`Dividend ${dividend} is not a number`);
        }

        if(!Type.of(divisor).is(Number)) {
            throw new TypeError(`Divisor ${divisor} is not a number`);
        }

        if(!Number.isFinite(dividend)) {
            throw new RangeError(`Dividend ${dividend} is not finite number`);
        }

        if(!Number.isFinite(divisor)) {
            throw new RangeError(`Divisor ${divisor} is not finite number`);
        }

        // Reducts and assigns the fraction.
        [ dividend, divisor ] = [ dividend, divisor ].map(element => element / gcd(dividend, divisor));

        this.dividend = dividend;
        this.divisor = divisor;

        // Defines arithmetic calculation.
        this.enlarge({
            add: Function.overload(overloader => {
                /**
                 * {Function} Rational.prototype.add
                 * Executes addition calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Number, number => this.add(Rational.from(number)));

                /**
                 * {Function} Rational.prototype.add
                 * Executes addition calculation with rational number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Rational, rational => (
                    new Rational(dividend * rational.divisor + rational.dividend * divisor, divisor * rational.divisor)
                ));

                /**
                 * {Function} Rational.prototype.add
                 * Executes addition calculation with complex number.
                 **/
                overloader(Complex, complex => Complex.from(this).add(complex));
            }),

            subtract: Function.overload(overloader => {
                /**
                 * {Function} Rational.prototype.subtract
                 * Executes subtraction calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Number, number => this.subtract(Rational.from(number)));

                /**
                 * {Function} Rational.prototype.subtract
                 * Executes subtraction calculation with rational number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Rational, rational => (
                    new Rational(dividend * rational.divisor - rational.dividend * divisor, divisor * rational.divisor)
                ));

                /**
                 * {Function} Rational.prototype.subtract
                 * Executes subtraction calculation with complex number.
                 **/
                overloader(Complex, complex => Complex.from(this).subtract(complex));
            }),

            multiply: Function.overload(overloader => {
                /**
                 * {Function} Rational.prototype.multiply
                 * Executes multiplication calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Number, number => this.multiply(Rational.from(number)));

                /**
                 * {Function} Rational.prototype.multiply
                 * Executes multiplication calculation with rational number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Rational, rational => (
                    new Rational(dividend * rational.dividend, divisor * rational.divisor)
                ));

                /**
                 * {Function} Rational.prototype.multiply
                 * Executes multiplication calculation with complex number.
                 **/
                overloader(Complex, complex => Complex.from(this).multiply(complex));
            }),

            divide: Function.overload(overloader => {
                /**
                 * {Function} Rational.prototype.divide
                 * Executes division calculation with real number.
                 *
                 * @param {Number} number
                 * @return {Rational}
                 **/
                overloader(Number, number => this.divide(Rational.from(number)));

                /**
                 * {Function} Rational.prototype.divide
                 * Executes division calculation with rational number.
                 *
                 * @param {Rational} target
                 * @return {Rational}
                 **/
                overloader(Rational, rational => (
                    new Rational(dividend * rational.divisor, divisor * rational.dividend)
                ));

                /**
                 * {Function} Rational.prototype.divide
                 * Executes division calculation with complex number.
                 **/
                overloader(Complex, complex => Complex.from(this).divide(complex));
            })
        });

        // Makes this instance to immutable.
        Object.freeze(this);
    }

    /**
     * {Function} Rational.from
     * Makes rational number from floating point real number.
     *
     * @param {Number|Rational} number
     * @return {Rational}
     **/
    static from(number) {
        if(Type.of(number).is(Rational)) {
            return number;
        }

        if(!Number.isFinite(number)) {
            throw new RangeError(`${number} is not finite number`);
        }

        const [ fraction, inverse ] = [ number, 1 / number ].map(fractionize);
        const [ fractionDigits, inverseDigits ] = [ fraction, inverse ].map(({ dividend, divisor }) => dividend + divisor);
        const { dividend, divisor } = fractionDigits > inverseDigits ? { dividend: inverse.divisor, divisor: inverse.dividend } : fraction;

        return new Rational(dividend, divisor);
    }

    /**
     * {Function} Rational.prototype.valueOf
     * Returns real number by division calculation.
     *
     * @return {Number}
     **/
    valueOf() {
        return this.dividend / this.divisor;
    }

    /**
     * {Function} Rational.prototype.toString
     * Returns stringified the rational number.
     *
     * @return {String}
     **/
    toString() {
        return this.valueOf().toString();
    }

    /**
     * {Getter} Number.prototype.sign
     * Returns sign of the number.
     *
     * @return {String}
     **/
    get sign() {
        return 1 / this < 0 ? '-' : '+';
    }
}
