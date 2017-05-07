Reflect.enlarge({
    /**
     * {Function} Reflect.getItsPropertyDescriptor
     * Returns a property descriptor of the given property if it exists on the object, undefined otherwise.
     *
     * @param {Object} target
     * @param {String} propertyKey
     * @return {Object|undefined}
     **/
    getItsPropertyDescriptor(target, propertyKey) {
        for(const prototype of target.constructor.prototypeChain) {
            if(!prototype.hasOwnProperty(propertyKey)) {
                continue;
            }

            return Reflect.getOwnPropertyDescriptor(prototype, propertyKey);
        }
    },

    /**
     * {Function} Reflect.itsProperties
     * Returns an object of the target object's own property keys and values.
     *
     * @param {Object} target
     * @return {Object}
     **/
    itsProperties(target) {
        const properties = {};

        for(const prototype of target.constructor.prototypeChain.reverse()) {
            for(const propertyKey of Reflect.ownKeys(prototype)) {
                properties[propertyKey] = prototype;
            }
        }

        return properties;
    }
});
