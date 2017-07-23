/* eslint-env mocha */
/* global Complex */

import should from 'should';

describe('Complex', () => {
    it('should be able to accept real number', () => {
        should.throws(() => new Complex('0', 1), TypeError);
        should.throws(() => new Complex(0, '1'), TypeError);
    });

    it('should be able to provides arithmetic calculation features', () => {
        const [ alpha, beta, gamma ] = [ 0.1, 0.2, 0.3 ].map(number => new Complex(number, number));

        // (0.1 + 0.1i) + (0.2 + 0.2i) = 0.3 + 0.3i
        String(alpha.add(beta)).should.equal(String(gamma));

        // (0.2 + 0.2i) - (0.1 + 0.1i) = 0.1 + 0.1i
        String(beta.subtract(alpha)).should.equal(String(alpha));

        // (0.1 + 0.1i) * (0.2 + 0.2i) = 0 + 0.04i
        String(alpha.multiply(beta)).should.equal('0 + 0.04i');

        // (0.1 + 0.1i) / (0.2 + 0.2i) = 0.25 + 0.02i
        String(alpha.divide(beta)).should.equal('0.25 + 0.02i');
    });

    it('should be immutable', () => {
        const complex = new Complex(1, 0);

        should.throws(() => {
            [ complex.real, complex.imaginary ] = [ 2, 1 ];
        }, TypeError);

        String(complex).should.equal('1 + 0i');
    });

    it('should be able to make a complex from real number object', () => {
        const [ number, complex ] = [ 1, new Complex(1, 0) ];

        String(Complex.from(number)).should.equal('1 + 0i');
        Complex.from(complex).should.equal(complex);
        should.throws(() => Complex.from('Hello'), SyntaxError);
        should.throws(() => Complex.from(Infinity), RangeError);
    });

    it('should be able to make conjugate complex number', () => {
        const complex = new Complex(1, 1);
        const conjugate = complex.conjugate;

        String(complex.add(conjugate)).should.equal('2 + 0i');
    });

    it('should be able to provide pure imaginary number', () => {
        String(Complex.pureImaginary).should.equal('0 + 1i');
    });
});
