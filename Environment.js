/**
   * Environment names storage
   */
class Environment {
    /**
       * Create an environment with given record
       */
    constructor(record = {}) {
        this.record = record;
    }

    /**
       * Creates a variable with given name and value
       */
    define(name, value) {
        this.record[name] = value;
        return value;
    }
}

module.exports = Environment;
