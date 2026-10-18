
const studentsDB = [
  { id: 101, name: 'Ali',  completedCourses: ['CS301', 'CS302'] },
  { id: 102, name: 'Sara', completedCourses: ['CS301'] },
  { id: 103, name: 'Hina', completedCourses: [] }
];

const coursesDB = [
  { code: 'CS401', prerequisite: 'CS302', totalSeats: 2,  enrolledStudents: [105, 106] },
  { code: 'CS402', prerequisite: 'CS301', totalSeats: 30, enrolledStudents: [105] },
  { code: 'CS403', prerequisite: 'CS302', totalSeats: 5,  enrolledStudents: [101] }
];

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = studentsDB.find(s => s.id === studentId);
    if (!student) {
      callback(new Error(`Student with ID ${studentId} does not exist.`), null);
      return;
    }
    callback(null, student);
  }, 300);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = coursesDB.find(c => c.code === courseCode);
    if (!course) {
      callback(new Error(`Course ${courseCode} does not exist.`), null);
      return;
    }
    const hasPrerequisite = student.completedCourses.includes(course.prerequisite);
    if (!hasPrerequisite) {
      callback(new Error(`Student ${student.name} has not completed prerequisite: ${course.prerequisite}.`), null);
      return;
    }
    callback(null, course);
  }, 300);
}

function checkAvailableSeats(student, course, callback) {
  setTimeout(() => {
    const alreadyRegistered = course.enrolledStudents.includes(student.id);
    if (alreadyRegistered) {
      callback(new Error(`Student ${student.name} is already registered in ${course.code}.`), null);
      return;
    }
    const seatsAvailable = course.enrolledStudents.length < course.totalSeats;
    if (!seatsAvailable) {
      callback(new Error(`Course ${course.code} is full. No seats available.`), null);
      return;
    }
    callback(null, { student, course });
  }, 300);
}

function registerCourse(student, course, callback) {
  setTimeout(() => {
    course.enrolledStudents.push(student.id);
    const confirmation = {
      studentId: student.id,
      course:    course.code,
      status:    'REGISTERED'
    };
    callback(null, confirmation);
  }, 300);
}

function startRegistration(studentId, courseCode, callback) {
  loadStudent(studentId, (err, student) => {
    if (err) {
      callback(err, null);
      return;
    }

    checkPrerequisites(student, courseCode, (err, course) => {
      if (err) {
        callback(err, null);
        return;
      }

      checkAvailableSeats(student, course, (err, data) => {
        if (err) {
          callback(err, null);
          return;
        }

        registerCourse(data.student, data.course, (err, confirmation) => {
          if (err) {
            callback(err, null);
            return;
          }
          callback(null, confirmation);
        });
      });
    });
  });
}


function runTest(label, studentId, courseCode) {
  console.log(`\n TEST: ${label}`);
  console.log('------------------------------------------------------------');
  startRegistration(studentId, courseCode, (err, result) => {
    if (err) {
      console.log(`FAILED  → ${err.message}`);
    } else {
      console.log('SUCCESS → Registration Confirmation:');
      console.log(result);
    }
  });
}

console.log('============================================================');
console.log('   CAMPUSFLOW — LEGACY COURSE REGISTRATION (CALLBACKS)      ');
console.log('============================================================');

runTest('Valid Registration (Ali → CS402)',           101, 'CS402');
runTest('Student Does Not Exist (ID 999)',            999, 'CS401');
runTest('Prerequisite Not Completed (Hina → CS401)', 103, 'CS401');
runTest('Course Full (Ali → CS401)',                  101, 'CS401');
runTest('Already Registered (Ali → CS403)',           101, 'CS403');

console.log('\n============================================================');
console.log(' WHY CALLBACK NESTING BECOMES A PROBLEM');
console.log('============================================================');
console.log(`
Each step depends on the result of the previous step.
Because JavaScript is asynchronous, the only way to chain
dependent operations with callbacks is to nest them inside
each other.

With 4 steps, the code is already 4 levels deep.
If there were 8 or 10 steps, the code would look like this:

  step1(function() {
    step2(function() {
      step3(function() {
        step4(function() {
          step5(function() {
            ...
          });
        });
      });
    });
  });

This is called CALLBACK HELL. It causes three major problems:

1. READABILITY   — deeply nested code is hard to follow and
                   understand, especially for other developers.

2. ERROR HANDLING — each level must manually check for errors
                    and pass them upward. One missed check
                    silently breaks the whole chain.

3. MAINTENANCE   — adding, removing, or reordering a step
                   requires restructuring the entire nesting,
                   which introduces bugs easily.

Promises and async/await were introduced specifically to
solve this problem by making async chains look flat and linear.
`);