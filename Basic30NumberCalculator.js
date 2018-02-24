const utility = require('./utility');
const error = require('./Error');
const Operation = utility.Operation;
const greater30Number = utility.greater30Number;
const map10To30 = utility.map10To30;
const map30To10 = utility.map30To10;
const convertPlusToMius = utility.convertPlusToMinus;
const convert10To30 = utility.convert10To30;
const convert30To10 = utility.convert30To10;
const DivideError = error.DivideError;

function Basic30NumberCalculator() {
}

Basic30NumberCalculator.prototype.plus = function(A, B) {
    if(A[0] === Operation.MINUS && B[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.plus(A.substr(1), B.substr(1));
        return convertPlusToMius(ret);
    }
    else if(A[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.minus(B, A.substr(1));
    }
    else if(B[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.minus(A, B.substr(1));
    }

    /* plus process*/
    A = A.split("").map(map30To10).reverse();
    B = B.split("").map(map30To10).reverse();
    let R = [];
    for(let i = 0; i < Math.max(A.length, B.length); i++) {
        let a = (A[i] === undefined) ? 0 : A[i];
        let b = (B[i] === undefined) ? 0 : B[i];
        let r = (R[i] === undefined) ? 0 : R[i];
        R[i] = (a + b + r) % 30;
        if(a + b + r >= 30)
            R[i+1] = Math.floor((a + b + r) / 30);
    }
    return R.map(map10To30).reverse().join("");
};

Basic30NumberCalculator.prototype.minus = function(A, B) {
    if(A[0] === Operation.MINUS && B[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.minus(B.substr(1), A.substr(1));
    }
    else if(A[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.plus(A.substr(1), B);
        return convertPlusToMius(ret)
    }
    else if(B[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.plus(A, B.substr(1));
    }


    /* if A < B, swap */
    let minus = false;
    if(!greater30Number(A, B)) {
       minus = true;
       let temp = A;
       A = B;
       B = temp;
    }

    /* minus process*/
    let R = [];
    let i;
    A = A.split("").map(map30To10).reverse();
    B = B.split("").map(map30To10).reverse();
    for(i = 0; i < A.length; i++) {
        let a = A[i];
        let b = (B[i] === undefined) ? 0 : B[i];

        if(a < b) {
            B[i+1] = (B[i+1] === undefined) ? 1 : B[i+1] + 1;
            a = a + 30;
        }
        R[i] = a - b;
    }

    /* remove front zeroes */
    i = i - 1;
    for(; i > 0; i--) {
        if(R[i] !== 0) {
            break;
        }
        delete R[i];
    }

    if(minus) {
        let ret = R.map(map10To30).reverse().join("");
        return convertPlusToMius(ret)
    }
    return R.map(map10To30).reverse().join("");
};

Basic30NumberCalculator.prototype.multiply = function(A, B) {
    if(A[0] === Operation.MINUS && B[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.multiply(A.substr(1), B.substr(1));
    }
    else if(A[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.multiply(A.substr(1), B);
        return convertPlusToMius(ret);
    }
    else if(B[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.multiply(A, B.substr(1));
        return convertPlusToMius(ret);
    }

    let R = [];
    let i, j;
    for(i = 0; i < A.length + B.length; i++) {
        R[i] = 0;
    }

    /* multiply process*/
    A = A.split("").map(map30To10).reverse();
    B = B.split("").map(map30To10).reverse();
    for(i = 0; i < A.length; i++) {
        for(j = 0; j < B.length; j++) {
            let r = A[i] * B[j] + R[i+j];
            let q = 0;
            if(r >= 30) {
                q = Math.floor(r / 30);
                r = r % 30;
                R[i+j+1] += q;
            }
            R[i+j] = r;
        }
    }

    /* remove front zeroes */
    for(i = A.length + B.length - 1; i > 0; i--) {
        if(R[i] !== 0) {
            break;
        }
        delete R[i];
    }

    return R.map(map10To30).reverse().join("");
};


Basic30NumberCalculator.prototype.divide = function(A, B) {
    if(A[0] === Operation.MINUS && B[0] === Operation.MINUS) {
        return Basic30NumberCalculator.prototype.divide(A.substr(1), B.substr(1));
    }
    else if(A[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.divide(A.substr(1), B);
        return convertPlusToMius(ret);
    }
    else if(B[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.divide(A, B.substr(1));
        return convertPlusToMius(ret);
    }

    if(B === map10To30(0)) {
        throw new DivideError('divide by 0');
    }

    let q = map10To30(0);
    while(true) {
        if(greater30Number(B, A)) {
            return q;
        }

        if(A.length === B.length) {
            return Basic30NumberCalculator.prototype.plus(q,  naiveDivide(A,B)[0]);
        }

        let frontA = A.substr(0, B.length + 1);
        let backA = A.substr(B.length + 1);
        let shift = backA.length;

        let i;
        for(i = 0; i < backA.length - 1; i++) {
            if(backA[i] !== map10To30(0))
                break;
        }
        backA = backA.substr(i);

        let tempQR = naiveDivide(frontA, B);
        let tempQ = Basic30NumberCalculator.prototype.shift(tempQR[0], shift);
        let tempR = Basic30NumberCalculator.prototype.shift(tempQR[1], shift);
        q = Basic30NumberCalculator.prototype.plus(q, tempQ);
        A = Basic30NumberCalculator.prototype.plus(tempR, backA);


    }
};

Basic30NumberCalculator.prototype.shift = function(A, n) {
    if(A[0] === map10To30(0)) {
        return A;
    }
    if(A[0] === Operation.MINUS) {
        let ret = Basic30NumberCalculator.prototype.shift(A.substr(1), n);
        return convertPlusToMius(ret);
    }
    return A + map10To30(0).repeat(n);
};

Basic30NumberCalculator.prototype.compute = function(op1, op2, op) {
    switch (op) {
        case Operation.PLUS: return Basic30NumberCalculator.prototype.plus(op1, op2);
        case Operation.MINUS: return Basic30NumberCalculator.prototype.minus(op1, op2);
        case Operation.MULTIPLY: return Basic30NumberCalculator.prototype.multiply(op1, op2);
        case Operation.DIVIDE: return Basic30NumberCalculator.prototype.divide(op1, op2);
    }
};

function naiveDivide(a, b) {
    if(greater30Number(b, a)) {
        return [convert10To30(0), a];
    }

    let A = a.split("").map(map30To10).reverse();
    let B = b.split("").map(map30To10).reverse();

    let frontA = 0;
    let frontB = B[B.length - 1];
    for(let i = A.length - 1; i >= B.length - 1; i--) {
        frontA *= 30;
        frontA += A[i];
    }

    let q = Math.floor(frontA / frontB);
    let r;
    while(true) {
        r = Basic30NumberCalculator.prototype.multiply(convert10To30(q), b);
        r = Basic30NumberCalculator.prototype.minus(a, r);

        if(r[0] === Operation.MINUS) {
            q--;
        }
        else {
            break;
        }

    }

    return [convert10To30(q), r];
}

function randomPair(both) {
    const Flength = 100000000000000;
    let isFirstMinus = Math.random() > 0.5;
    let first = Math.floor(Math.random() * Flength);
    if(both && isFirstMinus) {
        first = -first;
    }

    const Slength = 100000;
    let isSecondMinus = Math.random() > 0.5;
    let second = Math.floor(Math.random() * Slength);
    if(both && isSecondMinus) {
        second = -second;
    }

    return [first, second];
}


/* for test */
function testCompute(n, op) {
    let mock, answer, input, result10, result30;

    for(let i = 0; i < n; i++) {
        mock = randomPair(false);
        switch (op) {
            case Operation.PLUS: answer = mock[0] + mock[1]; break;
            case Operation.MINUS: answer = mock[0] - mock[1]; break;
            case Operation.MULTIPLY: answer = mock[0] * mock[1]; break;
            case Operation.DIVIDE: answer = Math.floor(mock[0] / mock[1]); break;
        }
        input = [convert10To30(mock[0]), convert10To30(mock[1])];
        result30 = Basic30NumberCalculator.prototype.compute(input[0], input[1], op);
        result10 = convert30To10(result30);

        if(answer === result10) {
            console.log('same');
        }
        else {
            console.log('mock0: ' + mock[0].toString().padStart(10) + ' mock1: ' + mock[1].toString().padStart(10));
            console.log('input0: ' + input[0].padStart(9) + ' input1: ' + input[1].padStart(9));
            console.log('answer: ' + answer.toString().padStart(29));
            console.log('result10: ' + result10.toString().padStart(27) + ' result30: ' + result30.padStart(7));
        }

    }

}

//testCompute(100, 'd');
//console.log(convert30To10(Basic30NumberCalculator.prototype.divide('10', '2')));

module.exports = Basic30NumberCalculator;