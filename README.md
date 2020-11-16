# Description
My implementation of dynamic AST interpreter that called Evalik!

# Specs
- Self-evaluating expressions (numbers, strings)
- Binary operations (math, comparison)
- Variable declaration and access
- Block expressions
- Branches (if and switch expressions)
- Loops
- Increment, decrement (adding assign +=, sub assign -=)
- Lambda functions
- Function declarations
- Function call (IILE)
- Classes
- Modules
- Imports
- REPL (./bin/evalik -i)

# Commands
Evalik can directly executes like ./bin/evalik, interpreter has three options:
- `-i` runs REPL;
- `-e <some code>`  runs code after flag;
- `-f <path to file>` executes code from specified file.

Also project has dockerfile:
- `make build` builds image;
- `make run` run REPL.
