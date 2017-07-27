import test from 'ava';

test('able to take a sign of the number', $ => {
    $.deepEqual([ 0, -0, Infinity, -Infinity, NaN ].map(element => element.sign), [ '+', '-', '+', '-', '+' ]);
});

test('able to provides arithmetic calculation features', $ => {
    const [ alpha, beta, gamma ] = [ 0.1, 0.2, 0.3 ];

    // 0.1 + 0.2 = 0.30000000000000004 in IEEE 754 Floting point system
    $.is(Number(alpha.add(beta)), gamma);

    // 0.3 - 0.1 = 0.19999999999999998 in IEEE 754 Floting point system
    $.is(Number(gamma.subtract(alpha)), beta);

    // 0.1 * 0.2 = 0.020000000000000004 in IEEE 754 Floting point system
    $.is(Number(alpha.multiply(beta)), 0.02);

    // 0.3 / 0.1 = 2.9999999999999996 in IEEE 754 Floting point system
    $.is(Number(gamma.divide(alpha)), 3);
});
