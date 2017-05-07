import should from 'should';

describe('Type', () => {
    const assertMultipleValues = function assertMultipleValues(commonType, ...values) {
        const types = values.map(value => Type.of(value));

        types.every(type => type.is(commonType)).should.ok();
        types.reduce((previous, current) => previous === current && current).should.ok();
    };

    it('should be able to distinguish undefined and null', () => {
        Type.of(undefined).is(undefined).should.ok();
        Type.of(null).is(null).should.ok();
        Type.of(undefined).is(null).should.not.ok();
        Type.of(null).is(undefined).should.not.ok();
    });

    it('should be unable to construct more than once about same type', () => {
        should.throws(() => Reflect.construct(Type.$(undefined), []), ReferenceError);
    });

    it('should be able to think type of inherited constructor\'s instance is equals to ancestral constructor', () => {
        class Ancestor {

        }

        class Inherited extends Ancestor {

        }

        Type.of(new Inherited()).is(Ancestor).should.ok();
    });

    describe('should be able to think type of naked value is equals to type of boxed value', () => {
        it('about `[]` and `new Array()`', () => {
            assertMultipleValues(Array, [], Reflect.construct(Array, []));
        });

        it('about `{}` and `new Object()`', () => {
            assertMultipleValues(Object, {}, Reflect.construct(Object, []));
        });

        it('about `function() {}`, `() => {}`, `class {}` and `new Function()`', () => {
            assertMultipleValues(Function, function() {}, () => {}, class {}, Reflect.construct(Function, []));
        });

        it('about `true`, `false` and `new Boolean()`', () => {
            assertMultipleValues(Boolean, true, false, Reflect.construct(Boolean, []));
        });

        it('about `0`, `Infinity`, `NaN` and `new Number()`', () => {
            assertMultipleValues(Number, 0, Infinity, NaN, Reflect.construct(Number, []));
        });

        it('about `\'\'` and `new String()`', () => {
            assertMultipleValues(String, '', Reflect.construct(String, []));
        });

        it('about `/ /` and `new RegExp()`', () => {
            assertMultipleValues(RegExp, / /, Reflect.construct(RegExp, []));
        });
    });
});
