Array.enhance({
    /**
     * {Getter} Array.prototype.sum
     * Calculates sum of the array.
     *
     * @return {Number}
     **/
    get sum() {
        return this.reduce((current, next) => current + next, 0);
    },

    /**
     * {Getter} Array.prototype.product
     * Calculates product of the array.
     *
     * @return {Number}
     **/
    get product() {
        return this.reduce((current, next) => current * next, 1);
    }
});

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
        if(arguments.length > 1 && !(mapFunction instanceof Function)) {
            throw new TypeError(`${mapFunction} is not a function`);
        }

        return Array(length).fill().map(mapFunction, thisArgument);
    },

    /**
     * {Generator} Array.range
     * Makes iterator of sequence by provided arguments. (Inspired by Python built-in function `range`)
     *
     * @param {Number} start
     * @param {Number} stop
     * @param {Number} step
     * @return {Iterator}
     **/
    *range(...args) {
        const [ start, stop, step ] = args.length === 1 ? [ 0, args[0], 1 ] : args.length === 2 ? [ ...args, 1 ] : args;
        const size = Math.ceil((stop - start) / step);

        for(let index = 0; index < size; index++) {
            yield start + index * step;
        }
    },

    /**
     * {Generator} Array.dimentional
     * Makes iterator of multi-dimentional sequence by provided dimention sizes.
     *
     * @param {Array<Number>} dimentions
     * @return {Iterator}
     **/
    *dimentional(...dimentions) {
        const { product: size, length: dimention } = dimentions;

        for(const element of Array.range(size)) {
            yield Array.allocate(dimention, (subElement, index) => (
                element * dimentions.slice(0, index + 1).product / size % dimentions[index] | 0
            ));
        }
    }
})
