import './core';
import './array';
import './function';
import './string';
import './reflect';

import Generic from './generic';
export { Generic };

import Type from './type';
export { Type };

import Dictionary from './dictionary';
export { Dictionary };

global.enlarge({ Generic, Type, Dictionary });
