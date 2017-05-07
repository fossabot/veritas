import should from 'should';

describe('Core', () => {
    const enlargement = {
        status: 'fine',

        compute(a, b) {
            return a + b;
        },

        get value() {
            return 'test';
        },

        set value(value) {
            value.count += 1;
        },

        *range() {
            yield* [ 1, 2, 3 ];
        },

        *[Symbol.iterator]() {
            yield* [ 4, 5, 6 ];
        }
    };

    const assertEnlarged = function assertEnlarged(enlarged) {
        enlarged.should.have.not.enumerable('status');
        enlarged.should.have.not.enumerable('compute');
        enlarged.should.have.not.enumerable('value');
        enlarged.status.should.equal('fine');
        enlarged.compute(12, 34).should.equal(46);
        enlarged.value.should.equal('test');

        const object = { count: 12 };

        enlarged.value = object;

        object.count.should.equal(13);
        [ ...enlarged.range() ].should.deepEqual([ 1, 2, 3 ]);
        [ ...enlarged ].should.deepEqual([ 4, 5, 6 ]);
    };

    it('should be ensure existence of functions as non-enumerable property', () => {
        Function.prototype.should.have.not.enumerable('enlarge');
        Function.prototype.should.have.not.enumerable('enhance');
        Object.prototype.should.have.not.enumerable('enlarge');
        Function.prototype.enlarge.should.be.a.Function();
        Function.prototype.enhance.should.be.a.Function();
        Object.prototype.enlarge.should.be.a.Function();
    });

    it('should be able to enlarge the function in non-enumerable', () => {
        const testFunction = function testFunction() {

        };

        testFunction.enlarge(enlargement);
        assertEnlarged(testFunction);
    });

    it('should be able to enhance the function in non-enumerable', () => {
        class TestClass {

        }

        TestClass.enhance(enlargement);
        assertEnlarged(new TestClass());
    });

    it('should be able to enlarge the object in non-enumerable', () => {
        const testObject = {};

        testObject.enlarge(enlargement);
        assertEnlarged(testObject);
    });

    it('should be unable to enlage when not an object provided', () => {
        const testObject = {};

        should.throws(() => {
            testObject.enlarge('string');
        }, TypeError);
    });
});
