let givenPrime = 11;
let found = false;
let candidate = givenPrime + 1;

while (!found) {
    let isPrime = true;

    for (let i = 2; i < candidate; i++) {
        if (candidate % i === 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        found = true;
    } else {
        candidate++;
    }
}

console.log("Given Prime     :", givenPrime);
console.log("Next Prime      :", candidate);