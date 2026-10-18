export function calculateGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateGPA(marks) {
  if (marks >= 85) return 4.0;
  if (marks >= 80) return 3.7;
  if (marks >= 75) return 3.3;
  if (marks >= 70) return 3.0;
  if (marks >= 65) return 2.7;
  if (marks >= 60) return 2.3;
  if (marks >= 50) return 2.0;
  return 0.0;
}

export function calculateAverage(marksArray) {
  if (!Array.isArray(marksArray) || marksArray.length === 0) {
    return 0;
  }
  const total = marksArray.reduce((sum, m) => sum + m, 0);
  return parseFloat((total / marksArray.length).toFixed(2));
}