Array.enlarge({
    allocate(length, mapFunction = element => element, thisArgument) {
        if(!(mapFunction === undefined || mapFunction instanceof Function)) {
            throw new TypeError(`${mapFunction} is not a function`);
        }

        return Array(length).fill().map(mapFunction, thisArgument);
    }
})
