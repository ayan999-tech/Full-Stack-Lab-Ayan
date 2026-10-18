const student = {
  id: 101,
  name: "Ali",
  marks: 0,
  scholarship: false,
  address: {
    city: "Islamabad",
    sector: "F-10",
  },
  contact: {
    email: "ali@university.edu",
  },
};

const update = {
  name: "Ali Khan",
  address: {
    city: "Rawalpindi",
  },
  contact: {
    phone: "03001234567",
  },
};

function updateStudentProfile(original, incoming) {
  const {
    id,
    name: originalName,
    marks: originalMarks = 0,
    scholarship: originalScholarship = false,
    address: originalAddress,
    contact: originalContact,
    ...originalRest
  } = original;

  const {
    name: updatedName,
    marks: updatedMarks,
    scholarship: updatedScholarship,
    address: incomingAddress,
    contact: incomingContact,
    ...incomingRest
  } = incoming;

  const { city: originalCity, sector: originalSector } = originalAddress;
  const { city: incomingCity } = incomingAddress ?? {};

  const { email: originalEmail, phone: originalPhone } = originalContact;
  const { phone: incomingPhone, email: incomingEmail } = incomingContact ?? {};

  const mergedAddress = {
    city: incomingCity ?? originalCity,
    sector: originalSector,
  };

  const mergedContact = {
    email: incomingEmail ?? originalEmail,
    ...(incomingPhone !== undefined && { phone: incomingPhone }),
    ...(originalPhone !== undefined && { phone: originalPhone }),
  };

  const finalName = updatedName ?? originalName;
  const finalMarks = updatedMarks ?? originalMarks;
  const finalScholarship = updatedScholarship ?? originalScholarship;

  const updatedStudent = {
    id,
    name: finalName,
    marks: finalMarks,
    scholarship: finalScholarship,
    address: mergedAddress,
    contact: mergedContact,
    ...originalRest,
    ...incomingRest,
  };

  return updatedStudent;
}

function demonstrateArrayDestructuringAndRest(...profiles) {
  const [first, second, ...remaining] = profiles;
  return { first, second, remaining };
}

const updated = updateStudentProfile(student, update);

console.log("============================================================");
console.log("        CAMPUSFLOW — SAFE STUDENT PROFILE UPDATE SERVICE    ");
console.log("============================================================");

console.log("\n ORIGINAL STUDENT:");
console.log(JSON.stringify(student, null, 2));

console.log("\n UPDATED STUDENT:");
console.log(JSON.stringify(updated, null, 2));

console.log("\n FIELD-BY-FIELD VERIFICATION:");
console.log(`name changed         : ${student.name} → ${updated.name}`);
console.log(`marks preserved (0)  : ${student.marks} → ${updated.marks}`);
console.log(
  `scholarship (false)  : ${student.scholarship} → ${updated.scholarship}`,
);
console.log(
  `address.city changed : ${student.address.city} → ${updated.address.city}`,
);
console.log(
  `address.sector kept  : ${student.address.sector} → ${updated.address.sector}`,
);
console.log(
  `contact.email kept   : ${student.contact.email} → ${updated.contact.email}`,
);
console.log(
  `contact.phone added  : ${student.contact?.phone ?? "undefined"} → ${updated.contact.phone}`,
);

console.log("\n REFERENCE EQUALITY CHECKS:");

const sameTopLevel = student === updated;
console.log(
  `original === updated         : ${sameTopLevel}  → different objects (spread created new object)`,
);

const sameAddress = student.address === updated.address;
console.log(
  `original.address === updated.address : ${sameAddress}  → different (new address object was constructed)`,
);

const sameContact = student.contact === updated.contact;
console.log(
  `original.contact === updated.contact : ${sameContact}  → different (new contact object was constructed)`,
);

console.log("\n ORIGINAL OBJECT MUTATION CHECK:");
console.log(`original name still 'Ali'         : ${student.name === "Ali"}`);
console.log(
  `original city still 'Islamabad'   : ${student.address.city === "Islamabad"}`,
);
console.log(
  `original has no phone             : ${student.contact.phone === undefined}`,
);

console.log("\n ARRAY DESTRUCTURING & REST DEMO:");
const { first, second, remaining } = demonstrateArrayDestructuringAndRest(
  student,
  updated,
  { id: 999, name: "Extra" },
);
console.log(`first profile id   : ${first.id}`);
console.log(`second profile id  : ${second.id}`);
console.log(`remaining profiles : ${remaining.length}`);

console.log("\n OPTIONAL CHAINING & NULLISH COALESCING DEMO:");
const missingUpdate = null;
const safeCity = missingUpdate?.address?.city ?? "Default City";
const safePhone = missingUpdate?.contact?.phone ?? "No Phone";
console.log(`safe city  (null update) : ${safeCity}`);
console.log(`safe phone (null update) : ${safePhone}`);

console.log("\n============================================================");
