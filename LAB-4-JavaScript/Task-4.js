function roundMe() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.round(arguments[0]);
    }

    let result = [];

    for (let i = 0; i < arguments.length; i++) {
        result.push(Math.round(arguments[i]));
    }

    return result;
}

console.log("roundMe()          :", roundMe());
console.log("roundMe(4.7)       :", roundMe(4.7));
console.log("roundMe(4.4)       :", roundMe(4.4));
console.log("roundMe(4.7, 4.4)  :", roundMe(4.7, 4.4));
console.log("roundMe(1.1, 2.5, 3.9) :", roundMe(1.1, 2.5, 3.9));