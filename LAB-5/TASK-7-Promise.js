
const studentsDB = [
  { id: 101, name: 'Ali',  email: 'ali@uni.edu',  phone: '0300-1234567', completedCourses: ['CS301', 'CS302'] },
  { id: 102, name: 'Sara', email: 'sara@uni.edu', phone: '0300-9876543', completedCourses: ['CS301'] }
];

const coursesDB = [
  { code: 'CS401', prerequisite: 'CS302', totalSeats: 30, enrolledStudents: [] },
  { code: 'CS402', prerequisite: 'CS303', totalSeats: 2,  enrolledStudents: [105, 106] }
];


function getStudent(studentId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = studentsDB.find(s => s.id === studentId);
      if (!student) {
        reject(new Error(`Student ID ${studentId} not found.`));
      } else {
        resolve(student);
      }
    }, 200);
  });
}

function getCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const course = coursesDB.find(c => c.code === courseCode);
      if (!course) {
        reject(new Error(`Course ${courseCode} not found.`));
      } else {
        resolve(course);
      }
    }, 200);
  });
}

function checkPrerequisites(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const completed = student.completedCourses.includes(course.prerequisite);
      if (!completed) {
        reject(new Error(`${student.name} has not completed prerequisite: ${course.prerequisite}.`));
      } else {
        resolve({ student, course });
      }
    }, 200);
  });
}

function checkSeats(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const alreadyIn = course.enrolledStudents.includes(student.id);
      if (alreadyIn) {
        reject(new Error(`${student.name} is already registered in ${course.code}.`));
        return;
      }
      const hasSeats = course.enrolledStudents.length < course.totalSeats;
      if (!hasSeats) {
        reject(new Error(`Course ${course.code} is full.`));
      } else {
        resolve({ student, course });
      }
    }, 200);
  });
}

function registerStudent(student, course) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      course.enrolledStudents.push(student.id);
      resolve({
        studentId: student.id,
        name:      student.name,
        course:    course.code,
        status:    'REGISTERED'
      });
    }, 200);
  });
}


function runRegistration(studentId, courseCode) {
  console.log(`\n Registering Student ${studentId} for ${courseCode}...`);

  let studentRef = null;

  getStudent(studentId)
    .then(student => {
      studentRef = student;
      return getCourse(courseCode);
    })
    .then(course => {
      return checkPrerequisites(studentRef, course);
    })
    .then(({ student, course }) => {
      return checkSeats(student, course);
    })
    .then(({ student, course }) => {
      return registerStudent(student, course);
    })
    .then(confirmation => {
      console.log(' SUCCESS — Confirmation:');
      console.log(confirmation);
    })
    .catch(err => {
      console.log(` FAILED  — ${err.message}`);
    })
    .finally(() => {
      console.log(' [ Registration attempt complete ]');
    });
}


function sendEmail(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!student.email) {
        reject(new Error('No email address on file.'));
      } else {
        resolve(`Email sent to ${student.email}`);
      }
    }, 300);
  });
}

function sendSMS(student) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const fail = Math.random() < 0.5;
      if (fail) {
        reject(new Error('SMS gateway timeout.'));
      } else {
        resolve(`SMS sent to ${student.phone}`);
      }
    }, 300);
  });
}

function writeAuditLog(confirmation) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Audit logged: Student ${confirmation.studentId} registered for ${confirmation.course}`);
    }, 300);
  });
}

function runPostRegistrationServices(student, confirmation) {
  console.log('\n Running post-registration services (allSettled)...');

  const servicePromises = [
    sendEmail(student).then(msg  => ({ service: 'Email', status: 'fulfilled', detail: msg }))
                      .catch(err => ({ service: 'Email', status: 'rejected',  detail: err.message })),

    sendSMS(student).then(msg    => ({ service: 'SMS',   status: 'fulfilled', detail: msg }))
                    .catch(err   => ({ service: 'SMS',   status: 'rejected',  detail: err.message })),

    writeAuditLog(confirmation).then(msg => ({ service: 'Audit', status: 'fulfilled', detail: msg }))
                               .catch(err => ({ service: 'Audit', status: 'rejected',  detail: err.message }))
  ];

  Promise.allSettled(servicePromises).then(results => {
    const report = results.map(r => r.value);
    console.log(' Post-Registration Report:');
    report.forEach(r => {
      console.log(`  ${r.service.padEnd(6)} → ${r.status.toUpperCase()} | ${r.detail}`);
    });
  });
}


function fetchCourseFromServerA(courseCode) {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 600) + 200;
    setTimeout(() => {
      const fail = Math.random() < 0.3;
      if (fail) {
        reject(new Error(`Server A failed for ${courseCode}.`));
      } else {
        resolve({ source: 'Server A', code: courseCode, seats: 30, delay });
      }
    }, delay);
  });
}

function fetchCourseFromServerB(courseCode) {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 600) + 200;
    setTimeout(() => {
      const fail = Math.random() < 0.3;
      if (fail) {
        reject(new Error(`Server B failed for ${courseCode}.`));
      } else {
        resolve({ source: 'Server B', code: courseCode, seats: 30, delay });
      }
    }, delay);
  });
}

function fetchCourseFromFastestServer(courseCode) {
  console.log('\n Fetching course data using Promise.any (fastest successful server)...');

  Promise.any([
    fetchCourseFromServerA(courseCode),
    fetchCourseFromServerB(courseCode)
  ])
    .then(result => {
      console.log(` Course data received from ${result.source} (delay: ${result.delay}ms)`);
      console.log(` Course: ${result.code} | Seats: ${result.seats}`);
    })
    .catch(() => {
      console.log(' Both servers failed to return course data.');
    });
}


console.log('============================================================');
console.log('    CAMPUSFLOW — PROMISE-BASED REGISTRATION ENGINE          ');
console.log('============================================================');

console.log('\n PART A — Registration Chain Tests');
console.log('============================================================');

runRegistration(101, 'CS401');
setTimeout(() => runRegistration(999, 'CS401'), 1500);
setTimeout(() => runRegistration(102, 'CS401'), 3000);
setTimeout(() => runRegistration(101, 'CS402'), 4500);

setTimeout(() => {
  console.log('\n============================================================');
  console.log(' PART B — Post-Registration Services (Promise.allSettled)  ');
  console.log('============================================================');
  const student      = studentsDB[0];
  const confirmation = { studentId: 101, course: 'CS401' };
  runPostRegistrationServices(student, confirmation);
}, 6500);

setTimeout(() => {
  console.log('\n============================================================');
  console.log(' PART C — Fastest Server Selection (Promise.any)           ');
  console.log('============================================================');
  console.log(`
  Why Promise.any and not Promise.race?

  Promise.race → resolves OR rejects with the FIRST settled promise.
                 If the faster server crashes, race() rejects immediately,
                 even if the other server would have succeeded.

  Promise.any  → resolves with the FIRST successfully resolved promise.
                 It ignores failures and only rejects when ALL promises fail.
                 This is exactly what we want: get the first working server.
  `);
  fetchCourseFromFastestServer('CS401');
}, 7500);

console.log('\n============================================================');