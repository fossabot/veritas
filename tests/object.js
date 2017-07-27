import test from 'ava';

test('able to freeze an object deeply', $ => {
    const testObject = {
        array: [ 1, 2, 3 ],

        nested: {
            array: [ 4, 5, 6 ],
            string: 'Hello, world!'
        }
    };

    Object.glaciate(testObject);

    $.throws(() => testObject.array.push(4), TypeError);
    $.throws(() => testObject.nested.array.push(7), TypeError);

    $.throws(() => {
        testObject.nested.string = 'Yeah!';
    }, TypeError);
});
