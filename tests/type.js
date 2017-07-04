import should from 'should';

const GeneratorFunction = (function *() {}).constructor;
const AsyncFunction = (async () => {}).constructor;

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
        should.throws(() => new (Type.$(undefined)), ReferenceError);
    });

    it('should be able to think type of inherited constructor\'s instance is equals to ancestral constructor', () => {
        class Ancestor {

        }

        class Inherited extends Ancestor {

        }

        Type.of(new Inherited).is(Ancestor).should.ok();
    });

    describe('should be able to think type of naked value is equals to type of boxed value', () => {
        it('about `[]` and `new Array`', () => {
            assertMultipleValues(Array, [], new Array);
        });

        it('about `{}` and `new Object`', () => {
            assertMultipleValues(Object, {}, new Object);
        });

        it('about `function() {}`, `() => {}`, `class {}` and `new Function`', () => {
            assertMultipleValues(Function, function() {}, () => {}, class {}, new Function);
        });

        it('about `function *() {}` and `new GeneratorFunction`', () => {
            assertMultipleValues(GeneratorFunction, function *() {}, new GeneratorFunction);
        });

        it('about `async function() {}`, `async () => {}` and `new AsyncFunction`', () => {
            assertMultipleValues(AsyncFunction, async function() {}, async () => {}, new AsyncFunction);
        });

        it('about `true`, `false` and `new Boolean`', () => {
            assertMultipleValues(Boolean, true, false, new Boolean);
        });

        it('about `0`, `Infinity`, `NaN` and `new Number`', () => {
            assertMultipleValues(Number, 0, Infinity, NaN, new Number);
        });

        it('about `\'\'` and `new String`', () => {
            assertMultipleValues(String, '', new String);
        });

        it('about `/ /` and `new RegExp`', () => {
            assertMultipleValues(RegExp, / /, new RegExp);
        });
    });

    it('should be able to think that both generator function and async function is a function', () => {
        [
            function() {}, () => {}, class {}, new Function, function *() {}, new GeneratorFunction, async function() {}, async () => {}, new AsyncFunction
        ].every(value => Type.of(value).is(Function)).should.ok();
    });
});
