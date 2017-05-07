const { Set, WeakMap, Symbol } = global;
const identities = new WeakMap;
const undefinedIdentity = Symbol(undefined);
const nullIdentity = Symbol(null);

Function.enlarge({
    /**
     * {Function} Function.getOwnIdentity
     * Returns unique identity of the target.
     *
     * @param {undefined|null|Function} target
     * @return {Symbol}
     **/
    getOwnIdentity(target) {
        if(target === undefined) {
            return undefinedIdentity;
        }

        if(target === null) {
            return nullIdentity;
        }

        if(!(target instanceof Function)) {
            throw new TypeError(`${target} is not a function or undefined or null`);
        }

        return target.identity;
    },

    /**
     * {Function} Function.overload
     * Provides function overloading.
     *
     * @param {Function} abstractor
     * @return {Function}
     **/
    overload(abstractor) {
        let otherwise = function overloaded() {
            throw new TypeError('Otherwise case is undefined');
        };

        const contexts = new Set;

        const overloader = function overloader(...condition) {
            switch(condition.length) {
                case 0:
                    throw new TypeError('Otherwise case should be a function');

                case 1:
                    return otherwise = condition[0];
            }

            const context = condition.pop();

            for(const parameter of condition) {
                if(parameter === undefined || parameter === null || parameter instanceof Function) {
                    continue;
                }

                throw new TypeError(`${parameter} is not a function or undefined or null`);
            }

            if(!(context instanceof Function)) {
                throw new TypeError(`${context} is not a function`);
            }

            contexts.add({ condition, context });
        };

        const overloaded = function overloaded(...args) {
            try {
                for(const { condition, context } of contexts) {
                    if(condition.length !== args.length || !condition.every((parameter, index) => {
                        const target = args[index] === undefined || args[index] === null ? args[index] : args[index].constructor;

                        return target === parameter || !!parameter && (parameter !== Function && target instanceof parameter || parameter.isPrototypeOf(target))
                    })) {
                        continue;
                    }

                    throw context;
                }

                throw otherwise;
            } catch(context) {
                return Reflect[new.target ? 'construct' : 'apply'](context, ...(new.target ? [ args ] : [ this, args ]));
            }
        };

        abstractor(overloader);

        return overloaded;
    },

    /**
     * {Function} Function.typeHint
     * Provides type hinting.
     *
     * @param {undefined|null|Constructor}... types
     * @return {Function}
     **/
    typeHint(...types) {
        const context = types.pop();

        if(!(context instanceof Function)) {
            throw new TypeError(`${context} is not a function`);
        }

        const contextName = context.name || 'anonymous';

        const typeHinted = function typeHinted(...args) {
            if(args.length < types.length) {
                throw new TypeError(`${contextName} requires ${types.length} type${types.length > 1 ? 's' : ''} at least`);
            }

            for(const [ index, argument ] of args.slice(0, types.length).map((argument, index) => [ index, argument ])) {
                const target = argument === undefined || argument === null ? argument : argument.constructor;

                if(target === types[index] || !!types[index] && (types[index] !== Function && target instanceof types[index] || types[index].isPrototypeOf(target))) {
                    continue;
                }

                const ordinalIndex = (index + 1) + (index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th');

                throw new TypeError(`Type which ${ordinalIndex} argument of ${contextName} should be ${types[index].name}`);
            }

            return Reflect[new.target ? 'construct' : 'apply'](context, ...(new.target ? [ args ] : [ this, args ]));
        };

        const nameDescriptor = Reflect.getOwnPropertyDescriptor(typeHinted, 'name');

        nameDescriptor.value = contextName;

        Reflect.defineProperty(typeHinted, 'name', nameDescriptor);

        return typeHinted;
    },


    /**
     * {Function} Function.typeBind
     * Provides type binding.
     *
     * @param {undefined|null|Constructor}... types
     * @return {Function}
     **/
    typeBind(...types) {
        const context = types.pop();

        if(!(context instanceof Function)) {
            throw new TypeError(`${context} is not a function`);
        }

        const contextName = context.name || 'anonymous';

        const typeBound = function typeBound(...args) {
            if(args.length < types.length) {
                throw new TypeError(`${contextName} requires ${types.length} type${types.length > 1 ? 's' : ''} at least`);
            }

            const mappedArgs = args.map((argument, index) => {
                const target = argument === undefined || argument === null ? argument : argument.constructor;

                return types[index] === undefined || types[index] === null ? types[index] : target === types[index] || !!types[index] && (types[index] !== Function && target instanceof types[index] || types[index].isPrototypeOf(target)) ? argument : new types[index](argument);
            });

            return Reflect[new.target ? 'construct' : 'apply'](context, ...(new.target ? [ mappedArgs ] : [ this, mappedArgs ]));
        };

        const nameDescriptor = Reflect.getOwnPropertyDescriptor(typeBound, 'name');

        nameDescriptor.value = contextName;

        Reflect.defineProperty(typeBound, 'name', nameDescriptor);

        return typeBound;
    }
});

Function.enhance({
    /**
     * {Getter} Function.prototype.identity
     * Returns unique identity of the function.
     *
     * @return {Symbol}
     **/
    get identity() {
        if(identities.has(this)) {
            return identities.get(this);
        }

        const symbol = Symbol(this.name);

        identities.set(this, symbol);

        return symbol;
    },

    /**
     * {Getter} Function.prototype.prototypeChain
     * Returns prototype chain of the function.
     *
     * @return {Symbol}
     **/
    get prototypeChain() {
        const chain = [];

        for(let prototype = this; prototype !== null; prototype = Reflect.getPrototypeOf(prototype)) {
            chain.push(prototype);
        }

        return chain.map(constructor => constructor.prototype || constructor);
    },

    /**
     * {Getter} Function.prototype.repressed
     * Returns repressed function that cannot throw an error.
     *
     * @return {Function}
     **/
    get repressed() {
        return (...args) => {
            try {
                throw Reflect[new.target ? 'construct' : 'apply'](this, ...(new.target ? [ args ] : [ this, args ]));
            } catch(result) {
                return result;
            }
        };
    }
});
