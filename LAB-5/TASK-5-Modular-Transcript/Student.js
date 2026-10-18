class Student {
  constructor(id, name, courses = []) {
    this.id      = id;
    this.name    = name;
    this.courses = courses;
  }

  addCourse(code, marks) {
    this.courses.push({ code, marks });
  }

  getCourseCount() {
    return this.courses.length;
  }
}

export default Student;