for(const [ target, type ] of [
    [ Function.prototype, 'enlarge' ], [ Function.prototype, 'enhance' ], [ Object.prototype, 'enlarge' ]
]) {
    Reflect.defineProperty(target, type, {
        value(descriptors, overriding = true) {
            const boundary = type === 'enlarge' ? this : this.prototype;

            if(!(descriptors instanceof Object)) {
                throw new TypeError(`${descriptors} is not an object`);
            }

            for(const key of Reflect.ownKeys(descriptors)) {
                if(key in boundary && !overriding) {
                    continue;
                }

                const descriptor = Reflect.getOwnPropertyDescriptor(descriptors, key);

                Reflect.defineProperty(boundary, key, Object.assign(descriptor, { enumerable: false }));
            }
        },
        writable: true,
        configurable: true
    });
}

global.enlarge({
    Promise: global.Promise || Promise,
    Map: global.Map || Map,
    Set: global.Set || Set,
    WeakMap: global.WeakMap || WeakMap,
    WeakSet: global.WeakSet || WeakSet,
    Symbol: global.Symbol || Symbol
});
