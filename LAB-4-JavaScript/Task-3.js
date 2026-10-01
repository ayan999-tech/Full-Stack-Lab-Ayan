function createPhoneNumber(numbers) {
    let areaCode = "";
    let firstPart = "";
    let secondPart = "";

    for (let i = 0; i < 3; i++) {
        areaCode = areaCode + numbers[i];
    }

    for (let i = 3; i < 6; i++) {
        firstPart = firstPart + numbers[i];
    }

    for (let i = 6; i < 10; i++) {
        secondPart = secondPart + numbers[i];
    }

    let phoneNumber = "(" + areaCode + ") " + firstPart + "-" + secondPart;

    return phoneNumber;
}

let result = createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]);
console.log("Phone Number :", result);