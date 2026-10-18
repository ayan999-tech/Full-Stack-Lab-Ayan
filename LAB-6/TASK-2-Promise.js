async function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = {
        1: { id: 1, name: 'Ali Khan',   email: 'ali@example.com'  },
        2: { id: 2, name: 'Sara Ahmed', email: 'sara@example.com' }
      };

      const user = users[userId];

      if (user) {
        resolve(user);
      } else {
        reject(new Error(`User with ID ${userId} not found.`));
      }
    }, 300);
  });
}

async function fetchCourse(courseCode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const courses = {
        'CS401': { code: 'CS401', title: 'Full Stack Web Dev',      seats: 30 },
        'CS402': { code: 'CS402', title: 'Artificial Intelligence', seats: 25 }
      };

      const course = courses[courseCode];

      if (course) {
        resolve(course);
      } else {
        reject(new Error(`Course ${courseCode} not found.`));
      }
    }, 400);
  });
}

async function fetchUserAndCourse(userId, courseCode) {
  try {
    const [user, course] = await Promise.all([
      fetchUser(userId),
      fetchCourse(courseCode)
    ]);

    console.log('Both fetched successfully:');
    console.log('User   :', user);
    console.log('Course :', course);

  } catch (error) {
    console.log('Promise.all rejected:', error.message);
  }
}

async function main() {
  console.log('TEST 1 — Both Valid (User 1 + CS401)');
  await fetchUserAndCourse(1, 'CS401');

  console.log('\nTEST 2 — Invalid User (User 999 + CS401)');
  await fetchUserAndCourse(999, 'CS401');

  console.log('\nTEST 3 — Invalid Course (User 2 + CS999)');
  await fetchUserAndCourse(2, 'CS999');

  console.log('\nTEST 4 — Both Invalid (User 999 + CS999)');
  await fetchUserAndCourse(999, 'CS999');
}

main();