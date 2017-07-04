import { deepStrictEqual } from 'assert';

const { Map, Set, Symbol } = global;
const any = [ undefined, null, Function ];
const generics = new Map;
const containers = new Set;
const Generic = {};

Generic.enlarge({
    /**
     * {Function} Generic.$
     * Generates boundary of generic.
     *
     * @param {Number} count
     * @return {Boundary}
     **/
    $(count, constraints) {
        if(count < 0) {
            throw new RangeError('Type count should be a natural number');
        }

        constraints = Object.assign(Array.allocate(count, () => any), constraints || {}).map((constraint, index) => {
            const ordinalIndex = `${index + 1}${!index ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'}`;

            if(typeof constraint === 'number') {
                if(constraint === index) {
                    throw new RangeError(`${ordinalIndex} constraint is self pointed`);
                }

                if(constraint >= count) {
                    throw new RangeError(`${count} type${count > 1 ? 's' : ''} provided. but ${ordinalIndex} constraint point at ${constraint}`);
                }
            }

            return constraint instanceof Array ? constraint : [ constraint ];
        });

        for(const [ restraints, boundary ] of generics) {
            if(restraints.length !== count || deepStrictEqual.repressed(constraints, restraints)) {
                continue;
            }

            return boundary;
        }

        class Boundary {
            /**
             * {Constructor} Boundary
             * Allocates type parameters to inherited constructor.
             *
             * @param {Array} $
             * @param {Object} privateData
             **/
            constructor($ = [], privateData = {}) {
                try {
                    for(const { types, Container } of containers) {
                        if(Container !== new.target) {
                            continue;
                        }

                        throw types;
                    }
                } catch(types) {
                    Object.assign($, types);
                    Object.freeze($);

                    Reflect.defineProperty(this, '$', { get: () => $, configurable: true });
                    Reflect.defineProperty(this, 'privateData', { get: () => privateData, configurable: true });

                    return;
                }

                throw new TypeError('Generic constructor requires types');
            }

            /**
             * {Function} Boundary.$
             * Allocate types and ready for construct.
             *
             * @param ...{undefined|null|Constructor} types
             * @return {Constructor}
             **/
            static $(...args) {
                if(count > args.length) {
                    throw new TypeError(`${this.name} requires ${count} type${count > 1 ? 's' : ''} at least`);
                }

                const types = args.slice(0, count);

                for(const [ index, type ] of types.entries()) {
                    const typeName = !type ? `${type}` : type.name;

                    if(type !== undefined && type !== null && !(type instanceof Function)) {
                        throw new TypeError(`${typeName} is not a function or undefined or null`);
                    }

                    const constraint = constraints[index];

                    if(constraint.map(parameter => (
                        typeof parameter === 'number' ? types[parameter] : parameter
                    )).some(parameter => (
                        type === parameter || !!parameter && (parameter === Function && type instanceof parameter || parameter.isPrototypeOf(type))
                    ))) {
                        continue;
                    }

                    throw new TypeError(`${typeName} is not ${constraint.map(parameter => !parameter ? `${parameter}` : parameter.name).join(' or ')} or ${constraint.length > 1 ? 'their' : 'its'} child`);
                }

                for(const { types: parameters, Container } of containers) {
                    if(deepStrictEqual.repressed(types, parameters) || !this.isPrototypeOf(Container)) {
                        continue;
                    }

                    return Container;
                }

                class Container extends this {

                }

                const descriptor = Reflect.getOwnPropertyDescriptor(Container, 'name');

                descriptor.value = `${this.name}<${types.map(type => !type ? `${type}` : type.name).join(', ')}>`;

                Reflect.defineProperty(Container, 'name', descriptor);
                Reflect.defineProperty(Container.prototype, Symbol.toStringTag, descriptor);

                Container.enlarge({ $: undefined });
                containers.add({ types, Container });

                return Container;
            }
        }

        const descriptor = Reflect.getOwnPropertyDescriptor(Boundary, 'name');

        descriptor.value = `Generic<${Array.allocate(count, (element, index) => (
            `$${index}${
                !deepStrictEqual.repressed(constraints[index], any) ? '' :
                ` : ${constraints[index].map(constraint => !constraint ? `$${constraint}` : constraint.name).join(' | ')}`
            }`
        )).join(', ')}>`;

        Reflect.defineProperty(Boundary, 'name', descriptor);

        generics.set(constraints, Boundary);

        return Boundary;
    }
});

export default Generic;
