function sumOfMultiples(x, y, z) {
    let sum = 0;

    for (let i = 1; i < z; i++) {
        if (i % x === 0 || i % y === 0) {
            sum = sum + i;
        }
    }

    return sum;
}

console.log("===== SUM OF MULTIPLES =====");
console.log("x=3, y=5, z=10  :", sumOfMultiples(3, 5, 10));
console.log("x=3, y=5, z=20  :", sumOfMultiples(3, 5, 20));
console.log("x=3, y=5, z=100 :", sumOfMultiples(3, 5, 100));
console.log("x=2, y=7, z=15  :", sumOfMultiples(2, 7, 15));