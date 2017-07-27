/* global Generic Type */

import test from 'ava';

class Container extends Generic.$(1) {
    constructor(...args) {
        const [ value ] = args;
        const $ = [];
        const privateData = {};

        super($, privateData);

        const [ type ] = $;
        const typeName = !type ? `${type}` : type.name;

        privateData.enlarge({
            valueValidate(value) {
                if(!Type.of(value).is(type)) {
                    throw new TypeError(`Type of value ${value} is not ${typeName}`);
                }
            }
        });

        if(args.length) {
            privateData.valueValidate(value);
        }

        let internalValue = value;

        this.enlarge({
            get value() {
                return internalValue;
            },

            set value(value) {
                privateData.valueValidate(value);

                internalValue = value;
            }
        });
    }
}

test('unable to work without positive type counts', $ => {
    $.throws(() => {
        new class InvalidContainer extends Generic.$(-1) {

        }
    }, RangeError);
});

test('unable to work without type parameters', $ => {
    $.throws(() => new (Container.$(123)), TypeError);
});

test('work fine with type parameters that are primitive types', $ => {
    try {
        throw new (Container.$(Number))(123);
    } catch(numberContainer) {
        $.notThrows(() => {
            numberContainer.value = 456;
        });

        $.throws(() => {
            numberContainer.value = 'bravo';
        }, TypeError);
    }

    try {
        throw new (Container.$(String))('alfa');
    } catch(stringContainer) {
        $.notThrows(() => {
            stringContainer.value = 'bravo';
        });

        $.throws(() => {
            stringContainer.value = 456;
        }, TypeError);
    }

    try {
        throw new (Container.$(undefined));
    } catch(undefinedContainer) {
        $.notThrows(() => {
            undefinedContainer.value = undefined;
        });

        $.throws(() => {
            undefinedContainer.value = null;
        }, TypeError);
    }

    try {
        throw new (Container.$(null));
    } catch(nullContainer) {
        $.notThrows(() => {
            nullContainer.value = null;
        });

        $.throws(() => {
            nullContainer.value = undefined;
        }, TypeError);
    }
});

test('work fine with type parameters that are generic types', $ => {
    try {
        throw new (Container.$(Container.$(Number)));
    } catch(nestedContainer) {
        $.notThrows(() => {
            nestedContainer.value = new (Container.$(Number))(789);
        });

        $.throws(() => {
            nestedContainer.value = new (Container.$(String))('charlie');
        }, TypeError);
    }

    try {
        throw new (Container.$(Generic.$(1)));
    } catch(genericContainer) {
        $.notThrows(() => {
            genericContainer.value = new (Container.$(String))('delta');
        });

        $.throws(() => {
            genericContainer.value = 'delta';
        }, TypeError);
    }
});

test('work fine if type parameters are enough', $ => {
    $.throws(() => Container.$(), TypeError);
    $.is(Container.$(Number, String), Container.$(Number));
});

test('work fine with type constraints', $ => {
    $.throws(() => {
        new class SubContainer extends Generic.$(1, { 0: 1 }) {
            constructor() {
                super([], {});
            }
        }
    }, RangeError);

    class Ancestor {

    }

    class Inherited extends Ancestor {

    }

    class SubContainer extends Generic.$(1, { 0: Ancestor }) {
        constructor() {
            super([], {});
        }
    }

    $.throws(() => new (SubContainer.$(Number)), TypeError);
    $.notThrows(() => new (SubContainer.$(Inherited)));
});
