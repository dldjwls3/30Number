
/*
automata?
it is too hard to implement for me;
i think it is too hard to debug;
 */
const Basic30NumberCalculator = require('./Basic30NumberCalculator');
const utility = require('./utility');
const Stack = require('./Stack');
const token = require('./Tokenizer');
const error = require('./Error');
const Token = token.Token;
const TokenType = token.TokenType;
const Tokenizer = token.Tokenizer;

const basic30NumberCalculator = new Basic30NumberCalculator();
const Operation = utility.Operation;
const Bracket = utility.Bracket;
const map10To30 = utility.map10To30;
const convert30To10 = utility.convert30To10;

const ParseError = error.ParseError;
const debug = true;

function Parser_30Number_BigInteger(expr) {
    const stack = new Stack();
    const tokenizer = new Tokenizer(expr);

    /*
    Call this function when meeting right bracket.
    Poping token from stack, compute expression until left bracket is poped.
     */
    let ComputeToLeftBracket = function() {
        /*
        error case
        1. there is not left bracket
         */
        while(!stack.empty()) {
            let op2Token = stack.pop();
            if(stack.empty()) {
                break;
            }
            let opToken = stack.pop();
            if(opToken.type === TokenType.BRACKET) {
                return op2Token;
            }

            let op1Token = stack.pop();
            let result = basic30NumberCalculator.compute(op1Token.data, op2Token.data, opToken.data);
            let resultToken = new Token(TokenType.NUMBER, result);
            stack.push(resultToken);
        }
        throw new ParseError('Brackets does not match');
    };

    /*
    Call this function when meeting expression's end.
    Poping token from stack, compute expression until stack is empty.
    */
    let ComputeTheRemains = function () {
        while (!stack.empty()) {
            let op2Token = stack.pop();
            if (stack.empty()) {
                return op2Token;
            }
            let opToken = stack.pop();
            if (opToken.type === TokenType.BRACKET) {
                break;
            }
            let op1Token = stack.pop();
            let result = basic30NumberCalculator.compute(op1Token.data, op2Token.data, opToken.data);
            let resultToken = new Token(TokenType.NUMBER, result);
            stack.push(resultToken);
        }
        throw new ParseError('Expression may not be ended');
    };

    /*
    This function checks grammar(states).
    When the input token matches grammar(states),
    do only one of three actions(for recursive state check purpose); compute or push to stack or throw error
    */
    let PushToStackCycle = function (t) {
/*
    error case
       head type, next type
    1. number, left bracket
    2. number, number
    3. op, binary op
    4. op, right bracket
    5. left bracket, right bracket
    6. left bracket, binary op

    7. empty, binary op
    8. empty, right bracket

    9. op, op, op

    when next token is right bracket, we start to pop.
    so never head type is right bracket.

    we assume the state of current stack is correct
*/

        let token = t;
        while (true) {
            let head = stack.head();
            if (token.type === TokenType.NUMBER) {
                if (!stack.empty() && head.type === TokenType.NUMBER) {
                    throw new ParseError('number token is followed by number token');
                }

                if (!stack.empty() &&
                    (head.data === Operation.MULTIPLY || head.data === Operation.DIVIDE)) {
                    stack.pop();
                    let op1Token = stack.pop();
                    let op2Token = token;
                    let result = basic30NumberCalculator.compute(op1Token.data, op2Token.data, head.data);
                    token = new Token(TokenType.NUMBER, result);
                    continue;
                }

                stack.push(token);
                break;
            }
            /*
            case
                head type, next type
             1. empty, minus -> transform to number
             2. number minus
             3. left bracket, minus -> transform to number
             4. operation, minus -> transform to number
             */
            else if (token.data === Operation.MINUS) {
                if (!tokenizer.hasNext()) {
                    throw new ParseError('there should be number');
                }

                if (stack.empty() ||
                    head.type === TokenType.BRACKET || head.type === TokenType.OPERATION) {
                    token = tokenizer.getNext();
                    token.data = Operation.MINUS + token.data;
                    continue;
                }

                stack.push(token);
                break;
            }
            else if (token.type === TokenType.OPERATION) {
                if (stack.empty() || head.type === TokenType.OPERATION || head.type === TokenType.BRACKET) {
                    throw new ParseError('operation token should be immediately after number token');
                }

                stack.push(token);
                break;
            }
            else if (token.type === TokenType.BRACKET && token.data === Bracket.LEFT) {
                if (!stack.empty() && head.type === TokenType.NUMBER) {
                    throw new ParseError('left bracket token should not be after number token');
                }

                stack.push(token);
                break;
            }
            else if (token.type === TokenType.BRACKET && token.data === Bracket.RIGHT) {
                if (stack.empty()) {
                    throw new ParseError('Brackets does not match');
                }
                if (head.type === TokenType.BRACKET) {
                    throw new ParseError('There is no token between brackets');
                }
                if (head.type === TokenType.OPERATION) {
                    throw new ParseError('Right bracket should not be after operation token');
                }

                token = ComputeToLeftBracket();
                continue;
            }
            else {
                throw new ParseError('something is wrong');
            }
        }
    };

    while(tokenizer.hasNext()) {
        let token = tokenizer.getNext();
        PushToStackCycle(token);
    }

    let head = stack.head();
    if(stack.empty()) {
        throw new ParseError('Expression is empty');
    }
    if(head.type === TokenType.BRACKET || head.type === TokenType.OPERATION) {
        throw new ParseError('Expression may not be ended');
    }
    let resultToken = ComputeTheRemains();
    return resultToken.data;
}

function exprGenerator() {
    return 'ipad2';
}

function testParser(n) {

    for(let i = 0; i < n; i++) {
        let expr = exprGenerator();
        console.log('expr: ' + expr);
        let result = Parser_30Number_BigInteger(expr);
        console.log('result10: ' + convert30To10(result));
        console.log('result30: ' + result);
    }

}

console.log(Parser_30Number_BigInteger('ipad2'));