/* eslint-env mocha */

import 'should';

describe('Number', () => {
    it('should be able to take a sign of the number', () => {
        [ 0, -0, Infinity, -Infinity, NaN ].map(element => element.sign).should.deepEqual([
            '+', '-', '+', '-', '+'
        ]);
    });

    it('should be able to provides arithmetic calculation features', () => {
        const [ alpha, beta, gamma ] = [ 0.1, 0.2, 0.3 ];

        // 0.1 + 0.2 = 0.30000000000000004 in IEEE 754 Floting point system
        Number(alpha.add(beta)).should.equal(gamma);

        // 0.3 - 0.1 = 0.19999999999999998 in IEEE 754 Floting point system
        Number(gamma.subtract(alpha)).should.equal(beta);

        // 0.1 * 0.2 = 0.020000000000000004 in IEEE 754 Floting point system
        Number(alpha.multiply(beta)).should.equal(0.02);

        // 0.3 / 0.1 = 2.9999999999999996 in IEEE 754 Floting point system
        Number(gamma.divide(alpha)).should.equal(3);
    });
});
