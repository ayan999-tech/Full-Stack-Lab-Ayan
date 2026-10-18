const applicants = [
  {
    id: "A101",
    name: "Sara Khan",
    age: "19",
    matricMarks: "91",
    intermediateMarks: "87",
    entryTest: "78",
    program: "BSCS",
    feePaid: "true",
  },
  {
    id: "A102",
    name: "Ahmed Ali",
    age: "twenty",
    matricMarks: "88",
    intermediateMarks: "",
    entryTest: "72",
    program: "BSSE",
    feePaid: "false",
  },
  {
    id: "A103",
    name: "Hassan",
    age: "18",
    matricMarks: "76",
    intermediateMarks: "83",
    entryTest: "91",
    program: "BSAI",
    feePaid: "true",
  },
];

const Supported_Programs = ["BSCS", "BSSE", "BSAI", "BSEE"];

const Merit_Weights = {
  matric: 0.2,
  intermediate: 0.3,
  entryTest: 0.5,
};

function sanitizeApplicant(applicant) {
  const age = Number(applicant.age);
  const matric = Number(applicant.matricMarks);
  const intermediate = Number(applicant.intermediateMarks);
  const entryTest = Number(applicant.entryTest);
  const feePaid = applicant.feePaid === "true";

  return {
    id: applicant.id,
    name: applicant.name,
    age,
    matric,
    intermediate,
    entryTest,
    program: applicant.program,
    feePaid,
  };
}

function validateApplicant(s) {
  if (
    isNaN(s.age) ||
    isNaN(s.matric) ||
    isNaN(s.intermediate) ||
    isNaN(s.entryTest)
  ) {
    return {
      valid: false,
      reason: "Invalid numeric value (NaN detected)",
    };
  }

  if (s.age < 17 || s.age > 30) {
    return {
      valid: false,
      reason: `Age ${s.age} is out of range (17-30)`,
    };
  }

  const marks = [s.matric, s.intermediate, s.entryTest];
  for (const mark of marks) {
    if (mark < 0 || mark > 100) {
      return {
        valid: false,
        reason: `Mark ${mark} is out of valid range (0–100)`,
      };
    }
  }

  if (!Supported_Programs.includes(s.program)) {
    return {
      valid: false,
      reason: `Program ${s.program} is not supported`,
    };
  }

  return { valid: true, reason: "All checks passed" };
}

function calculateMerit(s) {
  const merit =
    s.matric * Merit_Weights.matric +
    s.intermediate * Merit_Weights.intermediate +
    s.entryTest * Merit_Weights.entryTest;

  return parseFloat(merit.toFixed(2));
}

function determineStatus(s, merit, isValid) {
  if (!isValid) {
    return "INVALID DATA";
  }

  const eligible = merit >= 70 && s.entryTest >= 60 && s.intermediate >= 60;

  if (!eligible) {
    return "REJECTED";
  }

  if (merit >= 80 && s.feePaid) {
    return "SELECTED";
  }
  if (merit >= 70) {
    return "WAITING";
  }

  return "REJECTED";
}

function processApplicant(applicant) {
  const s = sanitizeApplicant(applicant);
  const { valid, reason } = validateApplicant(s);

  if (!valid) {
    return {
      id: s.id,
      name: s.name,
      merit: null,
      status: "INVALID DATA",
      reason,
    };
  }

  const merit = calculateMerit(s);
  const status = determineStatus(s, merit, valid);

  return {
    id: s.id,
    name: s.name,
    merit,
    status,
    program: s.program,
  };
}

function processAllApplicants(applicants) {
  const results = applicants.map((a) => processApplicant(a));
  return results;
}

function generateSummary(results) {
  const valid = results.filter((r) => r.status !== "INVALID DATA");
  const invalid = results.filter((r) => r.status === "INVALID DATA");

  const merits = valid.map((r) => r.merit);

  const highest = valid.reduce(
    (best, r) => (r.merit > best.merit ? r : best),
    valid[0],
  );
  const lowest = valid.reduce(
    (best, r) => (r.merit < best.merit ? r : best),
    valid[0],
  );

  const avgMerit =
    merits.length > 0
      ? parseFloat(
          (merits.reduce((sum, m) => sum + m, 0) / merits.length).toFixed(2),
        )
      : 0;

  const programCount = {};

  for (const r of valid) {
    switch (r.program) {
      case "BSCS":
        programCount.BSCS = (programCount.BSCS || 0) + 1;
        break;
      case "BSSE":
        programCount.BSSE = (programCount.BSSE || 0) + 1;
        break;
      case "BSAI":
        programCount.BSAI = (programCount.BSAI || 0) + 1;
        break;
      case "BSEE":
        programCount.BSEE = (programCount.BSEE || 0) + 1;
        break;
    }
  }
  return {
    totalValid: valid.length,
    totalInvalid: invalid.length,
    highestMerit: highest ? `${highest.name} (${highest.merit})` : "N/A",
    lowestMerit: lowest ? `${lowest.name} (${lowest.merit})` : "N/A",
    averageMerit: avgMerit,
    programBreakdown: programCount,
  };
}

const results = processAllApplicants(applicants);
const summary = generateSummary(results);

console.log('============ CAMPUSFLOW — ADMISSION RESULTS ============');
for (const r of results) {
  const meritStr = r.merit !== null ? `Merit: ${r.merit}` : 'Merit: N/A';
  const line = r.status === 'INVALID DATA'
    ? `[${r.id}] ${r.name} → ${r.status} | Reason: ${r.reason}`
    : `[${r.id}] ${r.name} → ${r.status} | ${meritStr} | Program: ${r.program}`;
  console.log(line);
}

console.log('\n============ SUMMARY ============');
console.log(`Valid Applicants   : ${summary.totalValid}`);
console.log(`Invalid Applicants : ${summary.totalInvalid}`);
console.log(`Highest Merit      : ${summary.highestMerit}`);
console.log(`Lowest Merit       : ${summary.lowestMerit}`);
console.log(`Average Merit      : ${summary.averageMerit}`);
console.log('Program Breakdown  :', summary.programBreakdown);

