function abs() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.abs(arguments[0]);
    }

    let result = [];

    for (let i = 0; i < arguments.length; i++) {
        result.push(Math.abs(arguments[i]));
    }

    return result;
}

function ceil() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.ceil(arguments[0]);
    }

    let result = [];

    for (let i = 0; i < arguments.length; i++) {
        result.push(Math.ceil(arguments[i]));
    }

    return result;
}

function floor() {
    if (arguments.length === 0) {
        return 0;
    }

    if (arguments.length === 1) {
        return Math.floor(arguments[0]);
    }

    let result = [];

    for (let i = 0; i < arguments.length; i++) {
        result.push(Math.floor(arguments[i]));
    }

    return result;
}

console.log("===== ABS =====");
console.log("abs()             :", abs());
console.log("abs(-4.7)         :", abs(-4.7));
console.log("abs(-4.7, -4.4)   :", abs(-4.7, -4.4));
console.log("abs(-1, -2, -3)   :", abs(-1, -2, -3));

console.log("===== CEIL =====");
console.log("ceil()            :", ceil());
console.log("ceil(4.1)         :", ceil(4.1));
console.log("ceil(4.1, 4.9)    :", ceil(4.1, 4.9));
console.log("ceil(1.1, 2.2, 3.3):", ceil(1.1, 2.2, 3.3));

console.log("===== FLOOR =====");
console.log("floor()           :", floor());
console.log("floor(4.9)        :", floor(4.9));
console.log("floor(4.7, 4.4)   :", floor(4.7, 4.4));
console.log("floor(1.9, 2.8, 3.7):", floor(1.9, 2.8, 3.7));