function NumberError(message) {
    this.message = message;
    this.name = 'NumberError';
}

NumberError.prototype.toString = function() {
    return this.name + ': "' + this.message + '"';
};

function ParseError(message) {
    this.message = message;
    this.name = 'ParseError';
}
ParseError.prototype.toString = function() {
    return this.name + ': "' + this.message + '"';
};

function DivideError(message) {
    this.message = message;
    this.name = 'DivideError';
}
DivideError.prototype.toString = function() {
    return this.name + ': "' + this.message + '"';
};

exports.NumberError = NumberError;
exports.ParseError = ParseError;
exports.DivideError = DivideError;