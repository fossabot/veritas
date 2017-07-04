import should from 'should';

describe('Generic', () => {
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

    it('should be unable to work without positive type counts', () => {
        should.throws(() => {
            class InvalidContainer extends Generic.$(-1) {

            }
        }, RangeError);
    });

    it('should be unable to work without type parameters', () => {
        should.throws(() => new (Container.$(123)), TypeError);
    });

    it('should be work fine with type parameters that are primitive types', () => {
        try {
            throw new (Container.$(Number))(123);
        } catch(numberContainer) {
            should.doesNotThrow(() => {
                numberContainer.value = 456;
            });

            should.throws(() => {
                numberContainer.value = 'bravo';
            }, TypeError);
        }

        try {
            throw new (Container.$(String))('alfa');
        } catch(stringContainer) {
            should.doesNotThrow(() => {
                stringContainer.value = 'bravo';
            });

            should.throws(() => {
                stringContainer.value = 456;
            }, TypeError);
        }

        try {
            throw new (Container.$(undefined));
        } catch(undefinedContainer) {
            should.doesNotThrow(() => {
                undefinedContainer.value = undefined;
            });

            should.throws(() => {
                undefinedContainer.value = null;
            }, TypeError);
        }

        try {
            throw new (Container.$(null));
        } catch(nullContainer) {
            should.doesNotThrow(() => {
                nullContainer.value = null;
            });

            should.throws(() => {
                nullContainer.value = undefined;
            }, TypeError);
        }
    });

    it('should be work fine with type parameters that are generic types', () => {
        try {
            throw new (Container.$(Container.$(Number)));
        } catch(nestedContainer) {
            should.doesNotThrow(() => {
                nestedContainer.value = new (Container.$(Number))(789);
            });

            should.throws(() => {
                nestedContainer.value = new (Container.$(String))('charlie');
            }, TypeError);
        }

        try {
            throw new (Container.$(Generic.$(1)));
        } catch(genericContainer) {
            should.doesNotThrow(() => {
                genericContainer.value = new (Container.$(String))('delta');
            });

            should.throws(() => {
                genericContainer.value = 'delta';
            }, TypeError);
        }
    });

    it('should be work fine if type parameters are enough', () => {
        should.throws(() => Container.$(), TypeError);
        (Container.$(Number, String) === Container.$(Number)).should.ok();
    });

    it('should be work fine with type constraints', () => {
        should.throws(() => {
            class SubContainer extends Generic.$(1, { 0: 1 }) {
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

        should.throws(() => new (SubContainer.$(Number)), TypeError);
        should.doesNotThrow(() => new (SubContainer.$(Inherited)));
    });
});
