Array.enlarge({
    /**
     * {Function} Array.allocate
     * Makes an array with mapping condition.
     *
     * @param {Number} length
     * @param {Function} mapFunction
     * @return {Array}
     **/
    allocate(length, mapFunction = element => element, thisArgument) {
        if(!(mapFunction === undefined || mapFunction instanceof Function)) {
            throw new TypeError(`${mapFunction} is not a function`);
        }

        return Array(length).fill().map(mapFunction, thisArgument);
    }
})
