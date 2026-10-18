
const fakeDatabase = {
  '/users': JSON.stringify([
    { id: 1, name: 'Ali',   department: 'CS', email: 'ali@uni.edu'   },
    { id: 2, name: 'Sara',  department: 'CS', email: 'sara@uni.edu'  },
    { id: 3, name: 'Usman', department: 'SE', email: 'usman@uni.edu' },
    { id: 4, name: 'Hina',  department: 'AI', email: 'hina@uni.edu'  },
    { id: 5, name: 'Ahmed', department: 'SE', email: 'ahmed@uni.edu' },
    { id: 6, name: 'Zoya',  department: 'AI', email: 'zoya@uni.edu'  }
  ]),
  '/courses': JSON.stringify([
    { code: 'CS401', title: 'FSWD',                  department: 'CS', seats: 30 },
    { code: 'CS402', title: 'AI Fundamentals',        department: 'AI', seats: 25 },
    { code: 'CS403', title: 'Software Engineering',   department: 'SE', seats: 20 }
  ]),
  '/results': JSON.stringify([
    { studentId: 1, course: 'CS401', marks: 82 },
    { studentId: 2, course: 'CS401', marks: 91 },
    { studentId: 3, course: 'CS401', marks: 47 },
    { studentId: 4, course: 'CS402', marks: 73 },
    { studentId: 5, course: 'CS401', marks: 64 },
    { studentId: 6, course: 'CS402', marks: 91 }
  ])
};

async function fakeFetch(url, options = {}) {
  const SCENARIOS = {
    '/users':         { type: 'success',      delay: 300  },
    '/courses':       { type: 'success',      delay: 200  },
    '/results':       { type: 'success',      delay: 400  },
    '/404-endpoint':  { type: '404',          delay: 100  },
    '/500-endpoint':  { type: '500',          delay: 100  },
    '/network-fail':  { type: 'network',      delay: 100  },
    '/bad-json':      { type: 'invalid-json', delay: 100  },
    '/slow-endpoint': { type: 'slow',         delay: 5000 }
  };

  const scenario = SCENARIOS[url] || { type: '404', delay: 100 };

  await new Promise(resolve => setTimeout(resolve, scenario.delay));

  if (options.signal && options.signal.aborted) {
    const err = new Error('The operation was aborted.');
    err.name = 'AbortError';
    throw err;
  }

  if (scenario.type === 'network') {
    throw new TypeError('Network request failed: connection refused.');
  }

  if (scenario.type === 'slow') {
    const err = new Error('The operation was aborted.');
    err.name = 'AbortError';
    throw err;
  }

  if (scenario.type === '404') {
    return {
      ok: false, status: 404, statusText: 'Not Found',
      json: async () => ({ error: 'Resource not found' })
    };
  }

  if (scenario.type === '500') {
    return {
      ok: false, status: 500, statusText: 'Internal Server Error',
      json: async () => ({ error: 'Server error' })
    };
  }

  if (scenario.type === 'invalid-json') {
    return {
      ok: true, status: 200, statusText: 'OK',
      json: async () => { throw new SyntaxError('Unexpected token in JSON.'); }
    };
  }

  return {
    ok: true, status: 200, statusText: 'OK',
    json: async () => JSON.parse(fakeDatabase[url])
  };
}

async function getJSON(url, fetchImplementation) {
  let response;

  try {
    response = await fetchImplementation(url);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error(`TIMEOUT/ABORT: Request to ${url} was aborted.`);
    }
    throw new Error(`NETWORK ERROR: Could not reach ${url}. ${err.message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ERROR ${response.status}: ${response.statusText} — ${url}`);
  }

  try {
    const data = await response.json();
    return data;
  } catch (err) {
    throw new SyntaxError(`INVALID JSON: Response from ${url} could not be parsed.`);
  }
}

async function fetchWithTimeout(url, milliseconds, fetchImplementation = fakeFetch) {
  const controller = new AbortController();
  const signal     = controller.signal;
  let   timerId    = null;

  try {
    const timeoutPromise = new Promise((_, reject) => {
      timerId = setTimeout(() => {
        controller.abort();
        reject(new Error(`TIMEOUT: Request to ${url} exceeded ${milliseconds}ms.`));
      }, milliseconds);
    });

    const fetchPromise = getJSON(url, (u) => fetchImplementation(u, { signal }));
    const result = await Promise.race([fetchPromise, timeoutPromise]);
    return result;

  } finally {
    clearTimeout(timerId);
  }
}

function generateDashboard(users, courses, results) {
  const totalStudents = users.length;
  const totalCourses  = courses.length;

  const totalMarks = results.reduce((sum, r) => sum + r.marks, 0);
  const overallAvg = parseFloat((totalMarks / results.length).toFixed(2));

  const topResult  = results.reduce((best, r) => r.marks > best.marks ? r : best, results[0]);
  const topStudent = users.find(u => u.id === topResult.studentId);

  const failedCount = results.filter(r => r.marks < 50).length;

  const deptStats = {};
  for (const user of users) {
    const dept = user.department;
    if (!deptStats[dept]) {
      deptStats[dept] = { students: 0, totalMarks: 0, count: 0, passed: 0 };
    }
    deptStats[dept].students += 1;

    const studentResults = results.filter(r => r.studentId === user.id);
    for (const r of studentResults) {
      deptStats[dept].totalMarks += r.marks;
      deptStats[dept].count      += 1;
      if (r.marks >= 50) deptStats[dept].passed += 1;
    }
  }

  const departmentSummary = {};
  for (const dept in deptStats) {
    const d = deptStats[dept];
    departmentSummary[dept] = {
      students:       d.students,
      averageMarks:   d.count > 0 ? parseFloat((d.totalMarks / d.count).toFixed(2)) : 0,
      passedStudents: d.passed
    };
  }

  return {
    totalStudents,
    totalCourses,
    overallAverageMarks:      overallAvg,
    highestPerformingStudent: topStudent ? topStudent.name : 'Unknown',
    highestMarks:             topResult.marks,
    failedStudents:           failedCount,
    departmentStats:          departmentSummary
  };
}

async function loadDashboard() {
  console.log('\n Loading dashboard data concurrently...');

  const [users, courses, results] = await Promise.all([
    getJSON('/users',   fakeFetch),
    getJSON('/courses', fakeFetch),
    getJSON('/results', fakeFetch)
  ]);

  return generateDashboard(users, courses, results);
}


function printDashboard(dashboard) {
  console.log('\n CAMPUSFLOW DASHBOARD');
  console.log('------------------------------------------------------------');
  console.log(`Total Students        : ${dashboard.totalStudents}`);
  console.log(`Total Courses         : ${dashboard.totalCourses}`);
  console.log(`Overall Average Marks : ${dashboard.overallAverageMarks}`);
  console.log(`Top Performer         : ${dashboard.highestPerformingStudent} (${dashboard.highestMarks})`);
  console.log(`Failed Students       : ${dashboard.failedStudents}`);
  console.log('\n Department Stats:');
  for (const dept in dashboard.departmentStats) {
    const d = dashboard.departmentStats[dept];
    console.log(`  ${dept} → Students: ${d.students} | Avg: ${d.averageMarks} | Passed: ${d.passedStudents}`);
  }
}

async function runErrorScenario(label, url, timeoutMs = null) {
  console.log(`\n TEST: ${label}`);
  console.log('------------------------------------------------------------');
  try {
    const result = timeoutMs !== null
      ? await fetchWithTimeout(url, timeoutMs)
      : await getJSON(url, fakeFetch);
    console.log(' SUCCESS:', result);
  } catch (err) {
    console.log(` CAUGHT [${err.constructor.name}]: ${err.message}`);
  }
}

async function main() {
  console.log('============================================================');
  console.log('     CAMPUSFLOW — CONCURRENT ACADEMIC API AGGREGATOR        ');
  console.log('============================================================');

  console.log('\n SECTION 1 — Concurrent Dashboard Load');
  console.log('============================================================');
  try {
    const dashboard = await loadDashboard();
    printDashboard(dashboard);
  } catch (err) {
    console.log(` Dashboard failed: ${err.message}`);
  }

  console.log('\n============================================================');
  console.log(' SECTION 2 — Error Scenario Tests');
  console.log('============================================================');

  await runErrorScenario('404 Not Found',                    '/404-endpoint');
  await runErrorScenario('500 Server Error',                 '/500-endpoint');
  await runErrorScenario('Network Failure',                  '/network-fail');
  await runErrorScenario('Invalid JSON',                     '/bad-json');
  await runErrorScenario('Timeout (500ms limit)',            '/slow-endpoint', 500);
  await runErrorScenario('Success with Timeout (2000ms)',    '/users',         2000);

  console.log('\n============================================================');
}

main();