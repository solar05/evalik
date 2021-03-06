const assert = require('assert');

const Environment = require('./Environment.js');
const Transformer = require('./transform/Transformer.js');
const evalikParser = require('./parser/evalikParser.js');

const fs = require('fs');

/**
  * Evalik interpeter.
  */

class Evalik {
    /**
       * Creates Evalik instance with global env
       */
    constructor(global = GlobalEnv) {
        this.global = global;
        this._transformer = new Transformer();
    }

    /**
      * Evaluates global code wrapping into a block
      */
    evalGlobal(exp) {
        return this._evalBody(exp, this.global);
    }

    /**
       * Evaluates an expression in given env
       */
    eval(exp, env = this.global) {
        //SELF-evaluating expressions
        if (this._isNumber(exp)) {
            return exp;
        }

        if (this._isString(exp)) {
            return exp.slice(1, -1);
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
            const [_, ref, value] = exp;

            //Assigment to property
            if (ref[0] === 'prop') {
                const [_tag, instance, propName] = ref;
                const instanceEnv = this.eval(instance, env);
                return instanceEnv.define(propName, this.eval(value, env));
            }
            return env.assign(ref, this.eval(value, env));
        }


        // Variable access: foo
        if (this._isVariableName(exp)) {
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

        //Func declaration
        // (def square (x) (* x x))
        if (exp[0] === 'def') {
            const [_tag, name, params, body] = exp;

            // JIT-transpiling to a var declaration
            const varExpression =
                  this._transformer.transformDefToVarLambda(exp);

            return this.eval(varExpression, env);
        }

        // switch expression (switch (cond1 block1) (cond2 block2) ...)
        if (exp[0] === 'switch') {
            const ifExp = this._transformer
                  .transformSwitchToIf(exp);

            return this.eval(ifExp, env);
        }

        // for loop
        if (exp[0] === 'for') {
            const whileExp = this._transformer
                  .transformForToWhile(exp);

            return this.eval(whileExp, env);
        }

        // increment by one (inc foo)
        if (exp[0] === 'inc') {
            const [_tag, name] = exp;
            const value = env.lookup(name);

            const setExp = this._transformer
                  .transformIncToSet(name, value);

            return this.eval(setExp, env);
        }

        // decrement by one (dec foo)
        if (exp[0] === 'dec') {
            const [_tag, name] = exp;
            const value = env.lookup(name);

            const setExp = this._transformer
                  .transformDecToSet(name, value);

            return this.eval(setExp, env);
        }


        // Add assign (+= foo)
        if (exp[0] === '+=') {
            const [_tag, name, num] = exp;
            const value = env.lookup(name);

            const setExp = this._transformer
                  .transformIncToSet(name, value, num);

            return this.eval(setExp, env);
        }

        // Sub assign (-= foo)
        if (exp[0] === '-=') {
            const [_tag, name, num] = exp;
            const value = env.lookup(name);

            const setExp = this._transformer
                  .transformDecToSet(name, value, num);

            return this.eval(setExp, env);
        }

        //Lambda func (lambda (x) (* x x))
        if (exp[0] === 'lambda') {
            const [_tag, params, body] = exp;

            return {
                params,
                body,
                env //Closure
            };
        }

        //Class declaration (class <name> <parent> <body>)
        if (exp[0] === 'class') {
            const [_tag, name, parent, body] = exp;

            const parentEnv = this.eval(parent, env) || env;
            const classEnv = new Environment({}, parentEnv);

            //Body is evaluated in the class env
            this._evalBody(body, classEnv);

            //Class is accesible by name
            return env.define(name, classEnv);
        }

        //Inherint expression (super <class name>)
        if (exp[0] === 'super') {
            const [_tag, className] = exp;
            return this.eval(className, env).parent;
        }


        if (exp[0] === 'new') {
            const classEnv = this.eval(exp[1], env);
            // An instance of a class is an environment,
            // the parent component of instance environment is set to its class
            const instanceEnv = new Environment({}, classEnv);

            const args = exp
                  .slice(2)
                  .map(arg => this.eval(arg, env));

            this._callUserDefinedFunction(classEnv.lookup('constructor'),
                                          [instanceEnv, ...args]);

            return instanceEnv;
        }

        //Property access (prop <instance> <name>)
        if (exp[0] == 'prop') {
            const [_tag, instance, name] = exp;

            const instanceEnv = this.eval(instance, env);
            return instanceEnv.lookup(name);
        }

        // Module declaration (module <name> <body>)
        if (exp[0] === 'module') {
            const [_tag, name, body] = exp;
            const moduleEnv = new Environment({}, env);

            this._evalBody(body, moduleEnv);
            return env.define(name, moduleEnv);
        }

        if (exp[0] === 'import') {
            const [_tag, name] = exp;

            const moduleSrc = fs.readFileSync(`${__dirname}/modules/${name}.ev`, 'utf-8');
            const body = evalikParser.parse(`(begin ${moduleSrc})`);
            const moduleExp = ['module', name, body];

            return this.eval(moduleExp, this.global);
        }

        //Func calls
        // (print "Hello, world!")
        // (+ x 5)
        // (> foo bar)
        if (Array.isArray(exp)) {
            const fn = this.eval(exp[0], env);
            const args = exp
                  .slice(1)
                  .map(arg => this.eval(arg, env));

            // Native functions
            if (typeof fn === 'function') {
                return fn(...args);
            }

            // User-defined functions
            return this._callUserDefinedFunction(fn, args);
        }

        throw `Not inplemented ${JSON.stringify(exp)}`;
    }

    _callUserDefinedFunction(fn, args) {
        const activationRecord = {};

        fn.params.forEach((param, index) => {
            activationRecord[param] = args[index];
        });

        const activationEnv = new Environment(
            activationRecord,
            fn.env // static scope
        );

        return this._evalBody(fn.body, activationEnv);
    }

    _evalBody(body, env) {
        if (body[0] === 'begin') {
            return this._evalBlock(body, env);
        }
        return this.eval(body, env);
    }

    _evalBlock(block, env) {
        let result;
        const [_tag, ...expressions] = block;
        expressions.forEach(exp => {
            result = this.eval(exp, env);
        });
        return result;
    }

    _isNumber(exp) {
        return typeof exp === 'number';
    }

    _isString(exp) {
        return typeof exp === 'string' && exp[0] === '"' && exp.slice(-1) === '"';
    }

    _isVariableName(exp) {
        return typeof exp === 'string' && /^[+\-*/<>=a-zA-Z0-9_]+$/.test(exp);
    }

}

/**
   * Default global env
   */
const GlobalEnv = new Environment({
    null: null,
    true: true,
    false: false,
    VERSION: '0.1',

    //Math operations
    '+'(...args) {
        return args.reduce((acc, num) => acc + num);
    },
    '-'(...args) {
        if (args.length === 1) {
            return -args[0];
        }
        return args.reduce((acc, num) => acc - num);
    },
    '*'(...args) {
        return args.reduce((acc, num) => acc * num);
    },
    '/'(op1, op2) {
        return op1 / op2;
    },

    //Comparison operations
    '>'(op1, op2) {
        return op1 > op2;
    },
    '<'(op1, op2) {
        return op1 < op2;
    },
    '>='(op1, op2) {
        return op1 >= op2;
    },
    '<='(op1, op2) {
        return op1 <= op2;
    },
    '='(op1, op2) {
        return op1 === op2;
    },
    print(...args) {
        console.log(...args);
    }
});

module.exports = Evalik;
