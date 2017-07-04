import should from 'should';

describe('String', () => {
    it('should be able to replace all target', () => {
        'Hello, world!'.replaceAll('l', 'x').should.equal('Hexxo, worxd!');
        'Hello, world!'.replaceAll('l', () => 'x').should.equal('Hexxo, worxd!');
        'Hello, world!'.replaceAll(/l/, 'x').should.equal('Hexxo, worxd!');
        'Hello, world!'.replaceAll(/l/, () => 'x').should.equal('Hexxo, worxd!');
    });

    it('should be able to replace in sequently by mapping array', () => {
        'Hello, world!'.replaceSequently([ /l/g, 'x' ], [ /x/g, 'l' ]).should.equal('Hello, world!');
    });

    it('should be able to makes to camelized', () => {
        'Hello, world!'.camelized.should.equal('helloWorld');
    });

    it('should be able to makes to dasherized', () => {
        'Hello, world!'.dasherized.should.equal('hello-world');
    });

    it('should be able to makes to generalized', () => {
        'Hello, world!'.generalized.should.equal('Hello world');
    });

    it('should be able to makes to capitalized', () => {
        'Hello, world!'.capitalized.should.equal('Hello World');
    });
});
