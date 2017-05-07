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

        return new (this.$(constructor))();
    }

    /**
     * {Function} Type.prototype.is
     * Evaluates equality between type of the target and given type.
     *
     * @param {undefined|null|Constructor} type
     * @return {Boolean}
     **/
    is(type) {
        const [ target ] = this.$;

        return target === type || !!type && (type !== Function && target instanceof type || type.isPrototypeOf(target));
    }
}
