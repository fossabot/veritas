import test from 'ava';

test('able to replace all target', $ => {
    $.is('Hello, world!'.replaceAll('l', 'x'), 'Hexxo, worxd!');
    $.is('Hello, world!'.replaceAll('l', () => 'x'), 'Hexxo, worxd!');
    $.is('Hello, world!'.replaceAll(/l/, 'x'), 'Hexxo, worxd!');
    $.is('Hello, world!'.replaceAll(/l/, () => 'x'), 'Hexxo, worxd!');
});

test('able to replace in sequently by mapping array', $ => {
    $.is('Hello, world!'.replaceSequently([ /l/g, 'x' ], [ /x/g, 'l' ]), 'Hello, world!');
});

test('able to makes to camelized', $ => {
    $.is('Hello, world!'.camelized, 'helloWorld');
});

test('able to makes to dasherized', $ => {
    $.is('Hello, world!'.dasherized, 'hello-world');
});

test('able to makes to generalized', $ => {
    $.is('Hello, world!'.generalized, 'Hello world');
});

test('able to makes to capitalized', $ => {
    $.is('Hello, world!'.capitalized, 'Hello World');
});
