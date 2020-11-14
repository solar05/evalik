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
            return this.eval(exp[1], env) + this.eval(exp[2], env);
        }

        if (exp[0] === '*') {
            return this.eval(exp[1], env) * this.eval(exp[2], env);
        }

        if (exp[0] === '-') {
            return this.eval(exp[1], env) - this.eval(exp[2], env);
        }

        if (exp[0] === '/') {
            return this.eval(exp[1], env) / this.eval(exp[2], env);
        }

        // Comparison operators
        if (exp[0] === '>') {
            return this.eval(exp[1], env) > this.eval(exp[2], env);
        }

        if (exp[0] === '>=') {
            return this.eval(exp[1], env) >= this.eval(exp[2], env);
        }

        if (exp[0] === '<') {
            return this.eval(exp[1], env) < this.eval(exp[2], env);
        }

        if (exp[0] === '<=') {
            return this.eval(exp[1], env) <= this.eval(exp[2], env);
        }

        if (exp[0] === '=') {
            return this.eval(exp[1], env) === this.eval(exp[2], env);
        }

        // Block: sequence of expr
        if (exp[0] === 'begin') {
            const blockEnv = new Environment({}, env);
            return this._evalBlock(exp, blockEnv);
        }

        // Variable declaration: (var foo 5)
        if (exp[0] === 'var') {
            const [_, name, value] = exp;
            return env.define(name, this.eval(value, env));
        }

        // Variable setting (update): (set foo 5)
        if (exp[0] === 'set') {
            const [_, name, value] = exp;
            return env.assign(name, this.eval(value, env));
        }


        // Variable access: foo
        if (isVariableName(exp)) {
            return env.lookup(exp);
        }

        // if-expression
        if (exp[0] === 'if') {
            const [_tag, cond, conseq, alter] = exp;
            if (this.eval(cond, env)) {
                return this.eval(conseq, env);
            }
            return this.eval(alter, env);
        }

        //while-expression
        if (exp[0] === 'while') {
            const [_tag, cond, body] = exp;
            let result;
            while (this.eval(cond, env)) {
                result = this.eval(body, env);
            }
            return result;
        }


        throw `Not inplemented ${JSON.stringify(exp)}`;
    }

    _evalBlock(block, env) {
        let result;
        const [_tag, ...expressions] = block;

        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });

        return result;
    }
}

function isNumber(exp) {
    return typeof exp === 'number';
}

function isString(exp) {
    return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
}

function isVariableName(exp) {
    return typeof exp === 'string' && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(exp);
}

module.exports = Evalik;
