const _from30to10 = {
    '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'a': 10, 'b': 11, 'e': 12, 'f': 13, 'g': 14, 'h': 15, 'i': 16, 'j': 17, 'k': 18,
    'l': 19, 'n': 20, 'q': 21, 'r': 22, 's': 23, 't': 24, 'u': 25, 'v': 26, 'w': 27,
    'y': 28, 'z': 29
};

const _from10to30 = {
    0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
    10: 'a', 11: 'b', 12: 'e', 13: 'f', 14: 'g', 15: 'h', 16: 'i', 17: 'j', 18: 'k',
    19: 'l', 20: 'n', 21: 'q', 22: 'r', 23: 's', 24: 't', 25: 'u', 26: 'v', 27: 'w',
    28: 'y', 29: 'z'
};

const Operation = {
    PLUS: 'p',
    MINUS: 'm',
    MULTIPLY: 'x',
    DIVIDE: 'd'
};

const Bracket = {
    LEFT: 'o',
    RIGHT: 'c'
};


const map30To10 = function(char) {
    return _from30to10[char];
};

const map10To30 = function(char) {
    return _from10to30[char];
};

const is30Number = function(char) {
    return char in _from30to10;
};

const isOperation = function(char) {
    return (Object.values(Operation).indexOf(char) > -1);
};

const isBracket = function(char) {
    return (Object.values(Bracket).indexOf(char) > -1);
};

const greater30Number = function(A, B) {
    A = A.split("").map(map30To10);
    B = B.split("").map(map30To10);

    if(A.length > B.length)
        return true;
    else if (A.length === B.length){
        for(let i = 0; i < A.length; i++) {
            if(A[i] > B[i])
                return true;
            else if(A[i] < B[i])
                return false;
        }
    }
    return false;
};

const convertPlusToMinus = function(A) {
    if(A[0] === map10To30(0))
        return A;
    return Operation.MINUS + A;
};

/* only for small number*/
const convert10To30 = function(d) {
    let data = parseInt(d);

    if(data < 0) {
        data = Math.abs(data);
        return Operation.MINUS + convert10To30(data);
    }

    let q = Math.floor(data / 30);
    let r = data % 30;

    if(q === 0)
        return map10To30(r);
    else
        return convert10To30(q.toString()) + map10To30(r);
};

const convert30To10 = function(data) {

    let minus = false;
    if(data[0] === Operation.MINUS) {
        minus = true;
        data = data.substr(1);
    }

    let result = 0;
    for(let i = 0; i < data.length; i++) {
        result *= 30;
        result += map30To10(data[i]);
    }

    if(minus) {
        return -result;
    }
    return result;
};

exports.Operation = Operation;
exports.Bracket = Bracket;
exports.is30Number = is30Number;
exports.isOperation = isOperation;
exports.isBracket = isBracket;
exports.greater30Number = greater30Number;
exports.map10To30 = map10To30;
exports.map30To10 = map30To10;
exports.convertPlusToMinus = convertPlusToMinus;
exports.convert10To30 = convert10To30;
exports.convert30To10 = convert30To10;



