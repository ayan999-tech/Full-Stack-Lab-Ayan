
async function fakeFetch(url) {
  const validUsers = {
    1: { id: 1, name: 'Ali Khan',   email: 'ali@example.com',   phone: '0300-1234567', city: 'Islamabad' },
    2: { id: 2, name: 'Sara Ahmed', email: 'sara@example.com',  phone: '0311-9876543', city: 'Lahore'    },
    3: { id: 3, name: 'Usman Raza', email: 'usman@example.com', phone: '0321-5556677', city: 'Karachi'   }
  };

  await new Promise(resolve => setTimeout(resolve, 300));

  const parts  = url.split('/');
  const userId = Number(parts[parts.length - 1]);
  const user   = validUsers[userId];

  if (!user) {
    return {
      ok:         false,
      status:     404,
      statusText: 'Not Found',
      json:       async () => ({ error: 'User not found' })
    };
  }

  return {
    ok:         true,
    status:     200,
    statusText: 'OK',
    json:       async () => user
  };
}

async function fetchUser(userId) {
  try {
    const response = await fakeFetch(`https://api.example.com/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: User not found.`);
    }

    const user = await response.json();
    return user;

  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}


async function main() {
  console.log('TEST 1 — Valid User (ID: 1)');
  try {
    const user = await fetchUser(1);
    console.log('SUCCESS:', user);
  } catch (error) {
    console.log('ERROR:', error.message);
  }

  console.log('\nTEST 2 — Valid User (ID: 2)');
  try {
    const user = await fetchUser(2);
    console.log('SUCCESS:', user);
  } catch (error) {
    console.log('ERROR:', error.message);
  }

  console.log('\nTEST 3 — Invalid User (ID: 999)');
  try {
    const user = await fetchUser(999);
    console.log('SUCCESS:', user);
  } catch (error) {
    console.log('ERROR:', error.message);
  }
}

main();

