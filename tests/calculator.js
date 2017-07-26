/* eslint-env mocha */
/* global Complex Calculator */

import 'should';

describe('Calculator', () => {
    const random = Math.random();
    const complex = new Complex(random, random);

    const roughlyCheck = (alpha, beta) => (
        Math.abs(alpha - beta) <= Number.EPSILON || String(alpha - beta).replace(/.*e-(1\d)$/, '$1') >= 16
    );

    describe('should be able to calculate value of sine function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.sin(random), Math.sin(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.sin(complex);

            roughlyCheck(real, Math.sin(random) * Math.cosh(random)).should.ok();
            roughlyCheck(imaginary, Math.cos(random) * Math.sinh(random)).should.ok();
        });
    });

    describe('should be able to calculate value of cosine function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.cos(random), Math.cos(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.cos(complex);

            roughlyCheck(real, Math.cos(random) * Math.cosh(random)).should.ok();
            roughlyCheck(imaginary, -Math.sin(random) * Math.sinh(random)).should.ok();
        });
    });

    describe('should be able to calculate value of tangent function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.tan(random), Math.tan(random));
        });

        it('about the complex number', () => {
            (String(Calculator.tan(complex)) === String(Calculator.sin(complex).divide(Calculator.cos(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of secant function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.sec(random), 1 / Math.cos(random));
        });

        it('about the complex number', () => {
            (String(Calculator.sec(complex)) === String((1).divide(Calculator.cos(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of cosecant function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.csc(random), 1 / Math.sin(random));
        });

        it('about the complex number', () => {
            (String(Calculator.csc(complex)) === String((1).divide(Calculator.sin(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of cotangent function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.cot(random), 1 / Math.cos(random));
        });

        it('about the complex number', () => {
            (String(Calculator.cot(complex)) === String((1).divide(Calculator.tan(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic sine function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.sinh(random), Math.sinh(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.sinh(complex);

            roughlyCheck(real, Math.sinh(random) * Math.cos(random)).should.ok();
            roughlyCheck(imaginary, Math.cosh(random) * Math.sin(random)).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic cosine function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.cosh(random), Math.cosh(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.cosh(complex);

            roughlyCheck(real, Math.cosh(random) * Math.cos(random)).should.ok();
            roughlyCheck(imaginary, Math.sinh(random) * Math.sin(random)).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic tangent function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.tanh(random), Math.tanh(random));
        });

        it('about the complex number', () => {
            (String(Calculator.tanh(complex)) === String(Calculator.sinh(complex).divide(Calculator.cosh(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic secant function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.sech(random), 1 / Math.cosh(random));
        });

        it('about the complex number', () => {
            (String(Calculator.sech(complex)) === String((1).divide(Calculator.cosh(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic cosecant function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.csch(random), 1 / Math.sinh(random));
        });

        it('about the complex number', () => {
            (String(Calculator.csch(complex)) === String((1).divide(Calculator.sinh(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of hyperbolic cotangent function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.coth(random), 1 / Math.tanh(random));
        });

        it('about the complex number', () => {
            (String(Calculator.coth(complex)) === String((1).divide(Calculator.tanh(complex)))).should.ok();
        });
    });

    describe('should be able to calculate value of exponential function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.exp(random), Math.exp(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.exp(complex);

            roughlyCheck(real, Math.exp(random) * Math.cos(random)).should.ok();
            roughlyCheck(imaginary, Math.exp(random) * Math.sin(random)).should.ok();
        });
    });

    describe('should be able to calculate value of natural logarithm function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.log(random), Math.log(random));
        });

        it('about the complex number', () => {
            const { real, imaginary } = Calculator.log(complex);

            roughlyCheck(real, Math.log(Math.sqrt(2 * random * random))).should.ok();
            roughlyCheck(imaginary, Math.atan2(random, random)).should.ok();
        });
    });

    describe('should be able to calculate value of powered function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.pow(random, random), Math.pow(random, random));
        });

        it('about the complex number', () => {
            (String(Calculator.pow(complex, complex)) === String(Calculator.exp(complex.multiply(Calculator.log(complex))))).should.ok();
        });
    });

    describe('should be able to calculate value of square root function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.sqrt(random), Math.sqrt(random));
        });

        it('about the complex number', () => {
            (String(Calculator.sqrt(complex)) === String(Calculator.pow(complex, 1 / 2))).should.ok();
        });
    });

    describe('should be able to calculate value of cubic root function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.cbrt(random), Math.cbrt(random));
        });

        it('about the complex number', () => {
            (String(Calculator.cbrt(complex)) === String(Calculator.pow(complex, 1 / 3))).should.ok();
        });
    });

    describe('should be able to calculate value of square powered function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.square(random), Math.pow(random, 2));
        });

        it('about the complex number', () => {
            (String(Calculator.square(complex)) === String(Calculator.pow(complex, 2))).should.ok();
        });
    });

    describe('should be able to calculate value of cubic powered function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.cube(random), Math.pow(random, 3));
        });

        it('about the complex number', () => {
            (String(Calculator.cube(complex)) === String(Calculator.pow(complex, 3))).should.ok();
        });
    });

    describe('should be able to calculate value of absolute function', () => {
        it('about the real number', () => {
            roughlyCheck(Calculator.abs(random), Math.abs(random));
        });

        it('about the complex number', () => {
            roughlyCheck(Calculator.abs(complex), Math.sqrt(2 * random * random)).should.ok();
        });
    });
});
