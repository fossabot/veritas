import Rational from './rational';
import Complex from './complex';

Number.enhance({
    /**
     * {Getter} Number.prototype.sign
     * Returns sign of the number.
     *
     * @return {String}
     **/
    get sign() {
        return 1 / this < 0 ? '-' : '+';
    }
});

for(const operator of [ 'add', 'subtract', 'multiply', 'divide' ]) {
    Number.enhance({
        [operator]: Function.overload(overloader => {
            /**
             * {Function} Number.prototype.[add|subtract|multiply|divide]
             * Executes extended arithmetic calculation by rational number system.
             *
             * @param {Number} target
             * @return {Rational}
             **/
            overloader(Number, function(number) {
                return Rational.from(this)[operator](number);
            });

            /**
             * {Function} Number.prototype.[add|subtract|multiply|divide]
             * Executes extended arithmetic calculation by number system of target.
             *
             * @param {Rational|Complex} target
             * @return {Rational|Complex}
             **/
            overloader([ Rational, Complex ], function(target) {
                return target.constructor.from(this)[operator](target);
            });
        })
    });
}
