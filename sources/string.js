String.enhance({
    /**
     * {Function} String.prototype.replaceAll
     * Makes search condition to replacement value.
     *
     * @param {String|RegExp} search
     * @param {String|Function} replacement
     * @return {String}
     **/
    replaceAll: Function.typeHint([ String, RegExp ], [ String, Function ], function replaceAll(search, replacement) {
        let [ string, replaced ] = [ this, this.replace(search, replacement) ];

        while(string !== replaced) {
            [ string, replaced ] = [ replaced, replaced.replace(search, replacement) ];
        }

        return string;
    }),

    /**
     * {Function} String.prototype.replaceSequently
     * Executes replacing in sequently by mapping array
     *
     * @param ...{Array<String|RegExp, String|Function>} mappingArray
     * @return {String}
     **/
    replaceSequently(...mappingArray) {
        let string = this;

        for(const [ search, replacement ] of mappingArray) {
            string = string.replace(search, replacement);
        }

        return string;
    },

    /**
     * {Getter} String.prototype.camelized
     * Makes original string to camelized.
     *
     * @return {String}
     **/
    get camelized() {
        return this.trim().replaceSequently(
            [ /[^a-z\s]/gi, '' ],
            [ /\s+/g, ' ' ],
            [ /\s([a-z])/gi, (match, character) => character.toUpperCase() ],
            [ /^([A-Z])/, character => character.toLowerCase() ]
        );
    },

    /**
     * {Getter} String.prototype.dasherized
     * Makes original string to dasherized.
     *
     * @return {String}
     **/
    get dasherized() {
        return this.trim().replaceSequently(
            [ /([A-Z])/g, '-$1' ],
            [ /[^a-z]/gi, '-' ],
            [ /^-|-$/g, '' ],
            [ /--+/g, '-' ]
        ).toLowerCase();
    },

    /**
     * {Getter} String.prototype.generalized
     * Makes original string to generalized.
     *
     * @return {String}
     **/
    get generalized() {
        return this.toLowerCase().replaceSequently(
            [ /[^a-z\s]/gi, ' ' ],
            [ /\s+/g, ' ' ],
            [ /^\s|\s$/, '' ],
            [ /^./, character => character.toUpperCase() ]
        );
    },

    /**
     * {Getter} String.prototype.capitalized
     * Makes original string to capitalized.
     *
     * @return {String}
     **/
    get capitalized() {
        return this.trim().replaceSequently(
            [ /[^a-z\s]/gi, ' ' ],
            [ /^\s+|\s+$/, '' ],
            [ /\s+/, ' ' ],
            [ /\s([a-z])/g, character => character.toUpperCase() ]
        );
    }
});
