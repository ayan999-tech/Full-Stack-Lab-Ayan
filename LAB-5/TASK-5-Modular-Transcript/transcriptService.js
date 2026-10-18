import Student from './Student.js';
import { calculateGrade, calculateAverage, calculateGPA } from './gradeUtils.js';

function parseJSON(rawData) {
  try {
    return JSON.parse(rawData);
  } catch (e) {
    throw new SyntaxError('Invalid JSON: data could not be parsed.');
  }
}

function validateStudents(students) {
  if (!Array.isArray(students)) {
    throw new TypeError('Expected an array of students.');
  }

  const seenIds = new Set();

  for (const s of students) {
    if (s.id === undefined || s.id === null) {
      throw new TypeError(`A student record is missing an ID.`);
    }

    if (seenIds.has(s.id)) {
      throw new Error(`Duplicate student ID found: ${s.id}`);
    }

    seenIds.add(s.id);

    if (!Array.isArray(s.courses)) {
      throw new TypeError(`Student ${s.id} has invalid or missing courses list.`);
    }

    for (const course of s.courses) {
      if (!course.code || course.code.trim() === '') {
        throw new TypeError(`Student ${s.id} has a course with a missing code.`);
      }

      if (course.marks < 0 || course.marks > 100) {
        throw new RangeError(`Student ${s.id}, course ${course.code} has invalid marks: ${course.marks}.`);
      }
    }
  }
}

export function processTranscript(rawData) {
  const parsed = parseJSON(rawData);
  validateStudents(parsed);

  const report = parsed.map(data => {
    const student    = new Student(data.id, data.name, data.courses);
    const marksArray = student.courses.map(c => c.marks);
    const average    = calculateAverage(marksArray);
    const gpa        = calculateGPA(average);
    const grade      = calculateGrade(average);

    const courseDetails = student.courses.map(c => ({
      code:  c.code,
      marks: c.marks,
      grade: calculateGrade(c.marks)
    }));

    return {
      id:      student.id,
      name:    student.name,
      courses: courseDetails,
      average,
      gpa,
      grade,
      status:  average >= 50 ? 'Pass' : 'Fail'
    };
  });

  return JSON.stringify(report, null, 2);
}