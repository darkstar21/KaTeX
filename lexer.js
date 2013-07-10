function Lexer() {
};

var normals = [
    [/^[/|@."`0-9]/, 'TEXTORD'],
    [/^[a-zA-Z]/, 'MATHORD'],
    [/^[*+-]/, 'BIN'],
    [/^[=<>]/, 'REL'],
    [/^[,;]/, 'PUNCT'],
    [/^\^/, '^'],
    [/^_/, '_'],
    [/^{/, '{'],
    [/^}/, '}'],
    [/^[(\[]/, 'OPEN'],
    [/^[)\]?!]/, 'CLOSE']
];

var funcs = [
    // Bin symbols
    'cdot', 'pm', 'div',
    // Rel symbols
    'leq', 'geq', 'neq', 'nleq', 'ngeq',
    // Open/close symbols
    'lvert', 'rvert',
    // Punct symbols
    'colon',
    // Spacing symbols
    'qquad', 'quad', ' ', 'space', ',', ':', ';',
    // Colors
    'blue', 'orange', 'pink', 'red', 'green', 'gray', 'purple',
    // Mathy functions
    "arcsin", "arccos", "arctan", "arg", "cos", "cosh", "cot", "coth", "csc",
    "deg", "dim", "exp", "hom", "ker", "lg", "ln", "log", "sec", "sin", "sinh",
    "tan", "tanh",
    // Other functions
    'dfrac', 'llap', 'rlap'
];
var anyFunc = new RegExp("^\\\\(" + funcs.join("|") + ")(?![a-zA-Z])");

Lexer.prototype.doMatch = function(match) {
    this.yytext = match;
    this.yyleng = match.length;

    this.yylloc.first_column = this._pos;
    this.yylloc.last_column = this._pos + match.length;

    this._pos += match.length;
    this._input = this._input.slice(match.length);
};

Lexer.prototype.lex = function() {
    // Get rid of whitespace
    var whitespace = this._input.match(/^\s*/)[0];
    this._pos += whitespace.length;
    this._input = this._input.slice(whitespace.length);

    if (this._input.length === 0) {
        return 'EOF';
    }

    var match;

    if ((match = this._input.match(anyFunc))) {
        this.doMatch(match[0]);

        if (match[1] === " ") {
            return "space";
        }
        return match[1];
    } else {
        for (var i = 0; i < normals.length; i++) {
            var normal = normals[i];

            if ((match = this._input.match(normal[0]))) {
                this.doMatch(match[0]);
                return normal[1];
            }
        }
    }

    throw "Unexpected character: '" + this._input[0] + "' at position " + this._pos;
};

Lexer.prototype.setInput = function(input) {
    this._input = input;
    this._pos = 0;

    this.yyleng = 0;
    this.yytext = "";
    this.yylineno = 0;
    this.yylloc = {
        first_line: 1,
        first_column: 0,
        last_line: 1,
        last_column: 0
    };
};

module.exports = new Lexer();
