const utility = require('./utility');
const isOperation = utility.isOperation;
const isBracket = utility.isBracket;
const is30Number = utility.is30Number;


const TokenType = {
    NUMBER: 0,
    OPERATION: 1,
    BRACKET: 2
};

function Token(type, data) {
    this.type = type;
    this.data = data;
}


function Tokenizer(expr) {
    this._expr = expr;
    this._length = expr.length;
    this._index = 0;
}

Tokenizer.prototype.hasNext = function() {
    return this._index < this._length
};

Tokenizer.prototype.getNext = function() {
    let index = this._index;
    let char = this._expr[index];

    if (isOperation(char)) {
        this._index++;
        return new Token(TokenType.OPERATION, char);
    }
    else if (isBracket(char)) {
        this._index++;
        return new Token(TokenType.BRACKET, char);
    }
    else if (is30Number(char)) {
        let from = index;
        let numberLength = 0;
        while (index < this._length) {
            let _char = this._expr[index];
            if (is30Number(_char)) {
                numberLength++;
                index++;
            }
            else {
                break;
            }
        }

        this._index = index;
        let data = this._expr.substr(from, numberLength);
        return new Token(TokenType.NUMBER, data);
    }
    else {
        throw new NumberError(char + ' is wrong number');
    }
};

exports.TokenType = TokenType;
exports.Token = Token;
exports.Tokenizer = Tokenizer;