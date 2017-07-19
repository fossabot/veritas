import Generic from './generic';

const { WeakMap } = global;
const types = new WeakMap;
const predefined = { undefined() {}, null() {} };

export default class Type extends Generic.$(1) {
    /**
     * {Constructor} Type
     * Encapsulates type of the target.
     **/
    constructor() {
        const $ = [];

        super($);

        const key = !$[0] ? predefined[`${$[0]}`] : $[0];

        if(types.has(key)) {
            throw new ReferenceError(`${new.target.name} is already constructed`);
        }

        types.set(key, this);

        this.enlarge({
            is: Function.overload(overloader => {
                /**
                 * {Function} Type.prototype.is
                 * Evaluates equality between type of the target and the given type.
                 *
                 * @param {undefined|null|Constructor} type
                 * @return {Boolean}
                 **/
                overloader([ undefined, null, Function ], type => (
                    $[0] === type || !!type && (type !== Function && $[0] instanceof type || type.isPrototypeOf($[0]))
                ));

                /**
                 * {Function} Type.prototype.is
                 * Evaluates to exist type of the target in the given array.
                 *
                 * @param {Array<undefined|null|Constructor>} types
                 * @return {Boolean}
                 **/
                overloader(Array, types => types.some(type => this.is(type)));
            })
        });
    }

    /**
     * {Function} Type.of
     * Returns encapsulated type of the target.
     *
     * @param {?} target
     * @return {Type}
     **/
    static of(target) {
        const constructor = target === undefined || target === null ? target : target.constructor;
        const key = !constructor ? predefined[`${constructor}`] : constructor;

        if(types.has(key)) {
            return types.get(key);
        }

        return new (Type.$(constructor))();
    }
}
