import Generic from './generic';
import Type from './type';

const { Map, Symbol } = global;

export default class Dictionary extends Generic.$(2) {
    /**
     * {Constructor} Dictionary
     * Constructs encapsulated map by type constraints.
     *
     * @param {Array} iterable
     **/
    constructor(iterable = []) {
        const $ = [];
        const privateData = { map: new Map };

        super($, privateData);

        const [ keyType, valueType ] = $;
        const [ keyTypeName, valueTypeName ] = $.map(type => !type ? `${type}` : type.name);

        privateData.enlarge({
            /**
             * {Function} Dictionary.prototype.keyValidate
             * Validates provided key type parameter
             *
             * @private
             * @param {keyType} key
             * @return {undefined}
             **/
            keyValidate(key) {
                if(!Type.of(key).is(keyType)) {
                    throw new TypeError(`Type of key ${key} is not ${keyTypeName}`);
                }
            },

            /**
             * {Function} Dictionary.prototype.valueValidate
             * Validates provided value type parameter
             *
             * @private
             * @param {keyType} key
             * @param {valueType} value
             * @return {undefined}
             **/
            valueValidate(key, value) {
                if(!Type.of(value).is(valueType)) {
                    throw new TypeError(`Type which value of key ${key} is not ${valueTypeName}`);
                }
            }
        });

        for(const [ key, value ] of iterable) {
            privateData.keyValidate(key);
            privateData.valueValidate(key, value);
            privateData.map.set(key, value);
        }
    }

    /**
     * {Getter} Dictionary.prototype.size
     * Returns the number of elements in a Dictionary object.
     *
     * @return {Number}
     **/
    get size() {
        return this.privateData.map.size;
    }

    /**
     * {Function} Dictionary.prototype.clear
     * Removes all elements from a Dictionary object.
     *
     * @return {undefined}
     **/
    clear() {
        return this.privateData.map.clear();
    }

    /**
     * {Function} Dictionary.prototype.delete
     * Removes the specified element from a Dictionary object.
     *
     * @param {keyType} key
     * @return {Boolean}
     **/
    delete(key) {
        this.privateData.keyValidate(key);

        return this.privateData.map.delete(key);
    }

    /**
     * {Generator} Dictionary.prototype.entries
     * Returns a new Iterator object that contains the [key, value] pairs for each element in the Dictionary object in insertion order.
     *
     * @return {Iterator}
     **/
    *entries() {
        yield* this.privateData.map.entries();
    }

    /**
     * {Function} Dictionary.prototype.forEach
     * Executes a provided function once per each [key, value] pair in the Dictionary object in insertion order.
     *
     * @param {Function} callback
     * @param {?} thisArgument
     * @return {undefined}
     **/
    forEach(callback, thisArgument) {
        for(const [ key, value ] of this) {
            callback.apply(thisArgument, [ value, key, this ]);
        }
    }

    /**
     * {Function} Dictionary.prototype.get
     * Returns a specified element from a Dictionary object.
     *
     * @param {keyType} key
     * @return {valueType}
     **/
    get(key) {
        this.privateData.keyValidate(key);

        return this.privateData.map.get(key);
    }

    /**
     * {Function} Dictionary.prototype.has
     * Returns a boolean indicating whether an element with the specified key exists or not.
     *
     * @param {keyType} key
     * @return {Boolean}
     **/
    has(key) {
        this.privateData.keyValidate(key);

        return this.privateData.map.has(key);
    }

    /**
     * {Generator} Dictionary.prototype.keys
     * Returns a new Iterator object that contains the keys for each element in the Dictionary object in insertion order.
     *
     * @return {Iterator}
     **/
    *keys() {
        yield* this.privateData.map.keys();
    }

    /**
     * {Function} Dictionary.prototype.set
     * Adds a new element with a specified key and value to a Dictionary object.
     *
     * @param {keyType} key
     * @param {valueType} value
     * @return {Dictionary}
     **/
    set(key, value) {
        this.privateData.keyValidate(key);
        this.privateData.valueValidate(key, value);
        this.privateData.map.set(key, value);

        return this;
    }

    /**
     * {Generator} Dictionary.prototype.values
     * Returns a new Iterator object that contains the values for each element in the Dictionary object in insertion order.
     *
     * @return {Iterator}
     **/
    *values() {
        yield* this.privateData.map.values();
    }

    /**
     * {Generator} Dictionary.prototype[@@iterator]
     * Same as entries property.
     *
     * @return {Iterator}
     **/
    *[Symbol.iterator]() {
        yield* this.entries();
    }
}
