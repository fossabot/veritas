# Veritas

[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

The extension library for pragmatists with elegance.

## Installation

```sh
npm install --save veritas
```

## Basic usage with examples

First of all,

```javascript
import 'veritas';
```

Simply,

```javascript
class Something {
    // blah blah blah ...
}

Something.enhance({
    name: 'morrighan'
});

const instance = new Something();

for(const key of Object.keys(instance)) {
    // the key 'name' must not found.
}
```

Furthermore,

```javascript
String.enhance({
    /**
     * {Function} String.prototype.replaceAll
     * Search and replace as far as possible.
     *
     * @param {RegExp|String} search
     * @param {String|Function} replacement
     * @return {String}
     **/
    replaceAll(searchValue, replaceValue) {
        let [string, replaced] = [this, this.replace(searchValue, replaceValue)];

        while(string !== replaced) {
            [string, replaced] = [replaced, replaced.replace(searchValue, replaceValue)];
        }

        return string;
    }
});

const string = 'Green Glass Grows Globes Greenly.';

console.log(string.replaceAll('G', 'C')); // Creen Class Crows Clobes Creenly.
```

Finally,

```javascript
Array.enhance({
    /**
     * {Getter} Array.prototype.odded
     * Return odded sequence.
     *
     * @return {Array}
     **/
    get odded() {
        return this.map(element => element * 2 - 1);
    },

    /**
     * {Getter} Array.prototype.zigzagged
     * Return zigzagged sequence.
     *
     * @return {Array}
     **/
    get zigzagged() {
        return this.map(element => Math.pow(-1, element + 1));
    }
});

const array = [1, 2, 3, 4, 5];

console.log(array.odded); // [1, 3, 5, 7, 9];
console.log(array.zigzagged); // [1, -1, 1, -1, 1];

// `hasOwnProperty` checking is unnecessary by Veritas.
for(const index in array) {
    if(array.hasOwnProperty(index)) {
        console.log(array[index]);
    }
}

// Do not worry. just do like this.
for(const element of array) {
    console.log(element);
}
```

Ta-da! We can extend standard built-in objects and user defined objects in elegantly without worrying about unexpected exceptions within Veritas we believe.

## License

Veritas is licensed under [LGPL-3.0](LICENSE).

[travis-image]: https://img.shields.io/travis/morrighan/veritas/master.svg
[travis-url]: https://travis-ci.org/morrighan/veritas
[coveralls-image]: https://img.shields.io/coveralls/morrighan/veritas/master.svg
[coveralls-url]: https://coveralls.io/github/morrighan/veritas?branch=master
[codeclimate-image]: https://img.shields.io/codeclimate/github/morrighan/veritas.svg
[codeclimate-url]: https://codeclimate.com/github/morrighan/veritas
