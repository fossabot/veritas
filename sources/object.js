Object.enlarge({
    /**
     * {Function} Object.glaciate
     * Freezes object deeply.
     *
     * @param {Object} object
     * @return {Object}
     **/
    glaciate(object) {
        Object.freeze(object);

        for(const key of Reflect.ownKeys(object)) {
            const property = object[key];

            if(typeof property !== 'object' || Object.isFrozen(property)) {
                continue;
            }

            Object.glaciate(property);
        }

        return object;
    }
});
