
const results = [
  { id: 1, name: 'Ali',   department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara',  department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina',  department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya',  department: 'AI', course: 'FSWD', marks: 91 }
];

const GRADE_SCALE = [
  { min: 85, max: 100, grade: 'A',  gradePoints: 4.0, status: 'Pass' },
  { min: 80, max: 84,  grade: 'A-', gradePoints: 3.7, status: 'Pass' },
  { min: 75, max: 79,  grade: 'B+', gradePoints: 3.3, status: 'Pass' },
  { min: 70, max: 74,  grade: 'B',  gradePoints: 3.0, status: 'Pass' },
  { min: 65, max: 69,  grade: 'B-', gradePoints: 2.7, status: 'Pass' },
  { min: 60, max: 64,  grade: 'C+', gradePoints: 2.3, status: 'Pass' },
  { min: 50, max: 59,  grade: 'C',  gradePoints: 2.0, status: 'Pass' },
  { min: 0,  max: 49,  grade: 'F',  gradePoints: 0.0, status: 'Fail' }
];

function getGradeInfo(marks) {
  const entry = GRADE_SCALE.find(g => marks >= g.min && marks <= g.max);
  if (!entry) return { grade: 'Invalid', gradePoints: null, status: 'Invalid' };
  return { grade: entry.grade, gradePoints: entry.gradePoints, status: entry.status };
}

function processResults(data) {
  return data.map(student => {
    const { grade, gradePoints, status } = getGradeInfo(student.marks);
    return { ...student, grade, gradePoints, status };
  });
}

function getRankedMeritList(data) {
  const copy = [...data]; 
  copy.sort((a, b) => {
    if (b.marks !== a.marks) return b.marks - a.marks;     
    return a.name.localeCompare(b.name);                     
  });
  return copy;
}

function getDepartmentStats(data) {
  return data.reduce((stats, student) => {
    const dept = student.department;


    if (!stats[dept]) {
      stats[dept] = { students: 0, totalMarks: 0, highest: 0, passed: 0 };
    }

    stats[dept].students   += 1;
    stats[dept].totalMarks += student.marks;
    stats[dept].passed     += student.marks >= 50 ? 1 : 0;

    if (student.marks > stats[dept].highest) {
      stats[dept].highest = student.marks;
    }

    return stats;
  }, {});
}

function formatDepartmentStats(rawStats) {
  const formatted = {};
  for (const dept in rawStats) {
    const d = rawStats[dept];
    formatted[dept] = {
      students: d.students,
      average:  parseFloat((d.totalMarks / d.students).toFixed(2)),
      highest:  d.highest,
      passed:   d.passed
    };
  }
  return formatted;
}

function runAcademicQueries(processed) {
  const overallAvg = parseFloat(
    (processed.reduce((sum, s) => sum + s.marks, 0) / processed.length).toFixed(2)
  );

  const firstAbove85      = processed.find(s => s.marks > 85);
  const firstFailedIndex  = processed.findIndex(s => s.marks < 50);
  const anyFailed         = processed.some(s => s.marks < 50);
  const allValidRange     = processed.every(s => s.marks >= 0 && s.marks <= 100);
  const aboveAverage      = processed.filter(s => s.marks > overallAvg);

  const topThreeNames     = [...processed]
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 3)
    .map(s => s.name);

  return {
    overallAverage:    overallAvg,
    firstAbove85:      firstAbove85 ? firstAbove85.name : 'None',
    firstFailedIndex,
    anyFailed,
    allValidRange,
    aboveAverage:      aboveAverage.map(s => s.name),
    topThreeNames
  };
}


const processed = processResults(results);

console.log('============================================================');
console.log('           CAMPUSFLOW — ACADEMIC PERFORMANCE REPORT         ');
console.log('============================================================');

console.log('\n📋 SECTION A — Student Results with Grade & Status');
console.log('------------------------------------------------------------');
processed.forEach(s => {
  console.log(
    `[${s.id}] ${s.name.padEnd(6)} | Dept: ${s.department} | Marks: ${s.marks} | Grade: ${s.grade.padEnd(2)} | GPA: ${s.gradePoints} | Status: ${s.status}`
  );
});


const meritList = getRankedMeritList(results);

console.log('\n🏆 SECTION B — Ranked Merit List (Descending)');
console.log('------------------------------------------------------------');
meritList.forEach((s, index) => {
  console.log(`Rank ${index + 1}: ${s.name.padEnd(6)} | Marks: ${s.marks} | Dept: ${s.department}`);
});

console.log('\n🔒 Original results array (must be unchanged):');
results.forEach(s => process.stdout.write(`${s.name}(${s.marks}) `));
console.log('');

// C — Department statistics
const rawStats   = getDepartmentStats(processed);
const deptStats  = formatDepartmentStats(rawStats);

console.log('\n📊 SECTION C — Department Statistics');
console.log('------------------------------------------------------------');
for (const dept in deptStats) {
  const d = deptStats[dept];
  console.log(`${dept} → Students: ${d.students} | Avg: ${d.average} | Highest: ${d.highest} | Passed: ${d.passed}`);
}

const queries = runAcademicQueries(processed);

console.log('\n🔍 SECTION D — Academic Queries');
console.log('------------------------------------------------------------');
console.log(`Overall Average         : ${queries.overallAverage}`);
console.log(`First Student > 85      : ${queries.firstAbove85}`);
console.log(`First Failed Student Idx: ${queries.firstFailedIndex}`);
console.log(`Any Student Failed?     : ${queries.anyFailed}`);
console.log(`All Marks Valid (0-100)?: ${queries.allValidRange}`);
console.log(`Above Average Students  : ${queries.aboveAverage.join(', ')}`);
console.log(`Top 3 Students          : ${queries.topThreeNames.join(', ')}`);
console.log('\n============================================================');


