
class Person {
  constructor(name, email) {
    this.name  = name;
    this.email = email;
  }

  introduce() {
    return `Hi, I am ${this.name} and my email is ${this.email}.`;
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks  = marks;
  }

  getResult() {
    if (this.marks >= 50) {
      return `PASS (Marks: ${this.marks})`;
    } else {
      return `FAIL (Marks: ${this.marks})`;
    }
  }

  introduce() {
    const parentIntro = super.introduce();
    return `${parentIntro} I am a Student. Roll No: ${this.rollNo}. Result: ${this.getResult()}.`;
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    const parentIntro = super.introduce();
    return `${parentIntro} I am a Faculty Member. Employee ID: ${this.employeeId}. Department: ${this.department}.`;
  }
}

const student1 = new Student('Ali',  'ali@uni.edu',  'BS-101', 82);
const student2 = new Student('Sara', 'sara@uni.edu', 'BS-102', 45);
const faculty1 = new FacultyMember('Dr. Khan',   'khan@uni.edu',  'EMP-201', 'Computer Science');
const faculty2 = new FacultyMember('Prof. Nida', 'nida@uni.edu',  'EMP-202', 'Artificial Intelligence');


const users = [student1, student2, faculty1, faculty2];

console.log('============================================================');
console.log('         CAMPUSFLOW — USER HIERARCHY & DYNAMIC this         ');
console.log('============================================================');

console.log('\n SECTION 1 — Runtime Polymorphism (forEach + introduce())');
console.log('------------------------------------------------------------');
users.forEach(user => console.log(user.introduce()));

console.log('\n SECTION 2 — instanceof Checks');
console.log('------------------------------------------------------------');
console.log(`student1 instanceof Student      : ${student1 instanceof Student}`);
console.log(`student1 instanceof Person       : ${student1 instanceof Person}`);
console.log(`student1 instanceof FacultyMember: ${student1 instanceof FacultyMember}`);
console.log(`faculty1 instanceof FacultyMember: ${faculty1 instanceof FacultyMember}`);
console.log(`faculty1 instanceof Person       : ${faculty1 instanceof Person}`);


console.log('\n SECTION 3 — call() with Guest Speaker');
console.log('------------------------------------------------------------');

const guest = {
  name:  'Dr. Ahmed',
  email: 'ahmed@example.com'
};

const guestIntro = Person.prototype.introduce.call(guest);
console.log(`call() result: ${guestIntro}`);

console.log('\n SECTION 4 — Detached Method Problem');
console.log('------------------------------------------------------------');

const fn = student1.introduce;

let detachedResult;
try {
  detachedResult = fn();
  console.log(`Detached fn() result: ${detachedResult}`);
} catch (error) {
  console.log(`Detached fn() error : ${error.message}`);
  console.log('Reason: this is undefined in strict mode when method is detached from its object.');
}

console.log('\n SECTION 5 — bind() Safe Bound Version');
console.log('------------------------------------------------------------');

const boundFn = student1.introduce.bind(student1);
console.log(`bound fn() result: ${boundFn()}`);

console.log('\n============================================================');


