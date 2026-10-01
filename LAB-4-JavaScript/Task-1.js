var name = "Ali Hassan";
var age = 22;
var email = "alihassan@email.com";
var isStudent = true;
var cgpa = 3.7;

var biography = {
    name: name,
    age: age,
    email: email,
    isStudent: isStudent,
    cgpa: cgpa,
    address: {
        city: "Lahore",
        country: "Pakistan",
        zipCode: "54000"
    },
    degreeProgram: {
        title: "Full Stack Web Development",
        university: "Virtual University",
        duration: "4 Years",
        currentSemester: 3
    }
};

console.log("===== MY BIOGRAPHY =====");
console.log("Name       :", biography.name);
console.log("Age        :", biography.age);
console.log("Email      :", biography.email);
console.log("Is Student :", biography.isStudent);
console.log("CGPA       :", biography.cgpa);
console.log("--- Address ---");
console.log("City       :", biography.address.city);
console.log("Country    :", biography.address.country);
console.log("Zip Code   :", biography.address.zipCode);
console.log("--- Degree Program ---");
console.log("Title      :", biography.degreeProgram.title);
console.log("University :", biography.degreeProgram.university);
console.log("Duration   :", biography.degreeProgram.duration);
console.log("Semester   :", biography.degreeProgram.currentSemester);
console.log("========================");