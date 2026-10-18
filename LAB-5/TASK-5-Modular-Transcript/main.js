import Student from './Student.js';
import { calculateGrade, calculateAverage, calculateGPA as computeGPA } from './gradeUtils.js';
import { processTranscript } from './transcriptService.js';

const validData = `
[
  {
    "id": 101,
    "name": "Ali",
    "courses": [
      { "code": "CS301", "marks": 81 },
      { "code": "CS302", "marks": 74 }
    ]
  },
  {
    "id": 102,
    "name": "Sara",
    "courses": [
      { "code": "CS301", "marks": 92 },
      { "code": "CS302", "marks": 88 }
    ]
  },
  {
    "id": 103,
    "name": "Usman",
    "courses": [
      { "code": "CS301", "marks": 45 },
      { "code": "CS302", "marks": 52 }
    ]
  }
]
`;

const malformedJSON    = `[ { "id": 101, "name": "Ali" `;

const duplicateIdData  = `
[
  { "id": 101, "name": "Ali",  "courses": [{ "code": "CS301", "marks": 80 }] },
  { "id": 101, "name": "Sara", "courses": [{ "code": "CS301", "marks": 90 }] }
]
`;

const invalidMarksData = `
[
  {
    "id": 201,
    "name": "Hina",
    "courses": [{ "code": "CS301", "marks": 150 }]
  }
]
`;

const missingIdData    = `
[
  { "name": "Ghost", "courses": [{ "code": "CS301", "marks": 70 }] }
]
`;

const missingCodeData  = `
[
  {
    "id": 301,
    "name": "Zaid",
    "courses": [{ "code": "", "marks": 70 }]
  }
]
`;

function runTest(label, rawData) {
  console.log(`\n TEST: ${label}`);
  console.log('------------------------------------------------------------');
  try {
    const result = processTranscript(rawData);
    console.log('SUCCESS — Report Generated:');
    console.log(result);
  } catch (error) {
    console.log(`CAUGHT ${error.constructor.name}: ${error.message}`);
  } finally {
    console.log('[ finally block executed — test case complete ]');
  }
}

console.log('============================================================');
console.log('       CAMPUSFLOW — MODULAR TRANSCRIPT PROCESSING           ');
console.log('============================================================');

runTest('Valid Data (Normal Case)',  validData);
runTest('Malformed JSON',           malformedJSON);
runTest('Duplicate Student IDs',    duplicateIdData);
runTest('Marks Out of Range (150)', invalidMarksData);
runTest('Missing Student ID',       missingIdData);
runTest('Missing Course Code',      missingCodeData);

console.log('\n============================================================');
console.log(' MANUAL USAGE — Student class & gradeUtils directly');
console.log('============================================================');

const s     = new Student(999, 'Demo Student');
s.addCourse('CS401', 88);
s.addCourse('CS402', 73);

const marks = s.courses.map(c => c.marks);
const avg   = calculateAverage(marks);
const grade = calculateGrade(avg);
const gpa   = computeGPA(avg);

console.log(`\nStudent     : ${s.name}`);
console.log(`Courses     : ${s.getCourseCount()}`);
console.log(`Average     : ${avg}`);
console.log(`Grade       : ${grade}`);
console.log(`GPA (alias) : ${gpa}`);
console.log('\n============================================================');