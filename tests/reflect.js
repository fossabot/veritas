import test from 'ava';

test('able to get property descriptor inherited by parent', $ => {
    $.deepEqual(
        Reflect.getItsPropertyDescriptor([], 'valueOf'),
        Reflect.getOwnPropertyDescriptor(Object.prototype, 'valueOf')
    );
});

test('able to get all properties', $ => {
    const properties = {};

    for(const prototype of [ Object, Function, Array ].map(constructor => constructor.prototype)) {
        for(const propertyKey of Reflect.ownKeys(prototype)) {
            properties[propertyKey] = prototype;
        }
    }

    $.deepEqual(Object.keys(Reflect.itsProperties([])), Object.keys(properties));
});
