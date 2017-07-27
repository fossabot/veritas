import test from 'ava';

test('able to allocate with provided length', $ => {
    $.deepEqual(Array.allocate(3), [ undefined, undefined, undefined ]);
    $.is(Array.allocate(10, (element, index) => index + 1).reduce((sum, value) => sum + value, 0), 55);
});

test('unable to accept incorrect mapping function', $ => {
    $.throws(() => Array.allocate(3, true), TypeError);
});

test('able to calculates sum and product', $ => {
    const array = Array.allocate(10, (element, index) => index + 1);
    const { sum, product } = array;

    $.is(sum, 55);
    $.is(product, 3628800);
});

test('able to make iterator of sequence', $ => {
    $.is([ ...Array.range(11) ].sum, 55);
    $.is([ ...Array.range(1, 11) ].sum, 55);
    $.is([ ...Array.range(1, 100, 2) ].sum, 2500);
});

test('able to make iterator of multi-dimentional sequence', $ => {
    const data = Array.allocate(2, () => Array.allocate(3, () => Array.allocate(4, () => null)));
    const random = Math.random();

    for(const [ first, second, third ] of Array.dimentional(2, 3, 4)) {
        data[first][second][third] = random;
    }

    $.is(data.map(first => first.map(second => second.sum).sum).sum, random * 24);
});
