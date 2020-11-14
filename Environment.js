/**
   * Environment names storage
   */
class Environment {
    /**
       * Create an environment with given record
       */
    constructor(record = {}, parent = null) {
        this.record = record;
        this.parent = parent;
    }

    /**
       * Creates a variable with given name and value
       */
    define(name, value) {
        this.record[name] = value;
        return value;
    }

    /**
       * Returns the value of a defined variable, or throws if is not defined
       */
    lookup(name) {
        return this.resolve(name).record[name];
    }

    /**
       * Update existing variable
       */

    assign(name, value) {
        this.resolve(name).record[name] = value;
        return value;
    }

    /**
     * Returns specific env in which a variable is defined, of throws if a variable is undefined
     */
    resolve(name) {
        if (this.record.hasOwnProperty(name)) {
            return this;
        }

        if (this.parent == null) {
            throw new ReferenceError(`Variable "${name}" is undefined`);
        }

        return this.parent.resolve(name);
    }
}

module.exports = Environment;
