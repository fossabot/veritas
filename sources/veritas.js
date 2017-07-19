// Veritas infracore.
import './core';

// Extension of standard built-in objects.
import './function';
import './array';
import './number';
import './string';
import './reflect';

// Advanced numeric calculation system.
import Rational from './rational';
import Complex from './complex';
import Matrix from './matrix';
import Calculator from './calculator';

// Generic programming extension and applied instances.
import Generic from './generic';
import Type from './type';
import Dictionary from './dictionary';

// Export and expose object defined by Veritas to global namespace.
export {
    Calculator, Rational, Complex, Matrix,
    Generic, Type, Dictionary
};

global.enlarge({
    Calculator, Rational, Complex, Matrix,
    Generic, Type, Dictionary
});
