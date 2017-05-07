describe('Reflect', () => {
    it('should be able to get property descriptor inherited by parent', () => {
        Reflect.getItsPropertyDescriptor([], 'valueOf').should.deepEqual(Reflect.getOwnPropertyDescriptor(Object.prototype, 'valueOf'));
    });

    it('should be able to get all properties', () => {
        const properties = {};

        for(const prototype of [ Object, Function, Array ].map(constructor => constructor.prototype)) {
            for(const propertyKey of Reflect.ownKeys(prototype)) {
                properties[propertyKey] = prototype;
            }
        }

        Reflect.itsProperties([]).should.deepEqual(properties);
    });
});
