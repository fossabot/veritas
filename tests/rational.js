/* eslint-env mocha */
/* global Rational */

import should from 'should';

describe('Rational', () => {
    it('should be able to take a sign of the number', () => {
        [ 0, -0, 0.1, -0.1 ].map(element => Rational.from(element).sign).should.deepEqual([
            '+', '-', '+', '-'
        ]);
    });

    it('should be able to accept finite number', () => {
        should.throws(() => new Rational('0', 1), TypeError);
        should.throws(() => new Rational(0, '1'), TypeError);
        should.throws(() => new Rational(Infinity, 1), RangeError);
        should.throws(() => new Rational(0, Infinity), RangeError);
    });

    it('should be immutable', () => {
        const rational = new Rational(1, 10);

        should.throws(() => {
            [ rational.dividend, rational.divisor ] = [ 2, 5 ];
        }, TypeError);

        Number(rational).should.equal(0.1);
    });

    it('should be able to make a rational from number object', () => {
        const [ number, rational ] = [ 0.1, new Rational(1, 10) ];

        Number(Rational.from(number)).should.equal(number);
        Rational.from(rational).should.equal(rational);
        should.throws(() => Rational.from(Infinity), RangeError);
    });
});
