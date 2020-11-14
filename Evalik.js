const assert = require('assert');

const Environment = require('./Environment.js');

/**
  * Evalik interpeter.
  */

class Evalik {
    /**
       * Creates Evalik instance with global env
       */
    constructor(global = new Environment()) {
        this.global = global;
    }


    /**
       * Evaluates an expression in given env
       */
    eval(exp, env = this.global) {
        //SELF-evaluating expressions
        if (isNumber(exp)) {
            return exp;
        }

        if (isString(exp)) {
            return exp.slice(1, -1);
        }

        // Math operations
        if (exp[0] === '+') {
            return this.eval(exp[1]) + this.eval(exp[2]);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1]) * this.eval(exp[2]);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1]) - this.eval(exp[2]);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1]) / this.eval(exp[2]);
        }

        // Variable declaration
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            return env.define(name, value);
        }

        throw `Not inplemented ${JSON.stringify(exp)}`;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

const evalik = new Evalik();

// Types
assert.strictEqual(evalik.eval(1), 1);
assert.strictEqual(evalik.eval('"Hello, world!"'), 'Hello, world!');

// Math
assert.strictEqual(evalik.eval(['+', 1, 5]), 6);
assert.strictEqual(evalik.eval(['+', ['+', 6, 4], 5]), 15);
assert.strictEqual(evalik.eval(['+', ['*', 6, 4], 5]), 29);
assert.strictEqual(evalik.eval(['-', ['*', 6, 4], 5]), 19);
assert.strictEqual(evalik.eval(['-', 5, ['*', 6, 4]]), -19);
assert.strictEqual(evalik.eval(['/', 10, ['/', 6, 3]]), 5);

// Variables
assert.strictEqual(evalik.eval(['var', 'x', 5]), 5);


console.log("Assertions passed!");
