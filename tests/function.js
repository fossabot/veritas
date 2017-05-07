import should from 'should';

describe('Function', () => {
    it('should be able to identify a function', () => {
        for(const target of [ undefined, null, Object, Function ]) {
            (Function.getOwnIdentity(target) === Function.getOwnIdentity(target)).should.ok();
        }

        for(const target of [ Object, Function ]) {
            (target.identity === target.identity).should.ok();
        }
    });

    it('should be able to check the prototype chain of a function', () => {
        class Alfa {

        }

        class Bravo extends Alfa {

        }

        class Charlie extends Bravo {

        }

        const { prototypeChain } = Charlie;

        prototypeChain.should.deepEqual([ Charlie, Bravo, Alfa, Function, Object ].map(constructor => constructor.prototype));
    });

    it('should be able to repress a function', () => {
        const thrower = function thrower() {
            throw Reflect.construct(Error, []);
        };

        should.throws(() => thrower());
        should.doesNotThrow(() => thrower.repressed());
    });

    it('should be unable to identify not a function', () => {
        for(const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
            should.throws(() => Function.getOwnIdentity(target), TypeError);
        }
    });

    it('should be able to overload functions', () => {
        const convert = Function.overload(overloader => {
            overloader(Number, number => String(number));
            overloader(String, string => Number(string));
        });

        convert('123').should.equal(123);
        convert(123).should.equal('123');

        const add = Function.overload(overloader => {
            overloader(Number, String, (alfa, bravo) => alfa + Number(bravo));
            overloader(String, Number, (alfa, bravo) => Number(alfa) + bravo);
        });

        add(123, '456').should.equal(579);
        add('123', 456).should.equal(579);

        const getSum = Function.overload(overloader => {
            overloader(Number, number => number);
            overloader(Number, Number, (alfa, bravo) => alfa + bravo);
            overloader(Number, Number, Number, (alfa, bravo, charlie) => alfa + bravo + charlie);
            overloader(() => NaN);
        });

        getSum(123).should.equal(123);
        getSum(123, 456).should.equal(579);
        getSum(123, 456, 789).should.equal(1368);
        getSum('').should.be.NaN();
    });

    it('should be unable to overload functions if invalid conditition provided', () => {
        const invalidOtherwiseConvert = Function.overload(overloader => {
            overloader(Number, number => String(number));
            overloader(123456789);
        });

        should.throws(() => invalidOtherwiseConvert('123'), TypeError);

        const undefinedOtherwiseConvert = Function.overload(() => {});

        should.throws(() => undefinedOtherwiseConvert('456'), TypeError);
    });

    it('should be able to hint type constraints', () => {
        const toUpperCase = Function.typeHint(String, string => string.toUpperCase());
        const toDouble = Function.typeHint(Number, number => number * 2);

        toUpperCase('abc').should.equal('ABC');
        toDouble(123).should.equal(246);
        should.throws(() => toUpperCase(456), TypeError);
        should.throws(() => toDouble('def'), TypeError);
    });

    it('should be able to bind type constraints', () => {
        const dateConsumer = date => date.toISOString();

        should.throws(() => dateConsumer('2016-01-01T00:00:00.000Z'), TypeError);

        const dateBoundConsumer = Function.typeBind(Date, dateConsumer);

        dateBoundConsumer('2016-01-01T00:00:00.000Z').should.equal('2016-01-01T00:00:00.000Z');

        const nullify = Function.typeBind(null, argument => argument);

        for(const target of [ true, false, NaN, Infinity, 'alfa', 'bravo', /(?:)/ ]) {
            (nullify(target) === null).should.ok();
        }
    });
});
