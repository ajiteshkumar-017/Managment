import bcrypt from "bcryptjs";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { Subject } from "@/models/subject.model";
import { Class } from "@/models/class.model";
import { Enrollment } from "@/models/enrollement.model";
import { Faculty } from "@/models/faculty.model";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Student } from "@/models/student.model";
import { ExamResult } from "@/models/exam.model";

export async function seedDatabase() {
  await Connect();

  await ExamResult.deleteMany({});
  await Enrollment.deleteMany({});
  await Class.deleteMany({});
  await SubjectFacultyAssignment.deleteMany({});
  await Faculty.deleteMany({});
  await Student.deleteMany({});
  await Subject.deleteMany({});
  await User.deleteMany({});

  const passwordStudent = await bcrypt.hash("Ajitesh@123", 10);
  const passwordFaculty = await bcrypt.hash("Faculty@123", 10);
  const passwordAdmin = await bcrypt.hash("Admin@123", 10);

  const users = await User.insertMany([
    {
      username: "Ajitesh Kumar",
      email: "ajiteshk007@gmail.com",
      password: await bcrypt.hash("Ajitesh@123", 10),
      role: "student",
    },
    {
      username: "Admin User",
      email: "ajiteshk017@gmail.com",
      password: passwordAdmin,
      role: "admin",
    },
    {
      username: "Dr. Maya Patel",
      email: "maya.patel@test.edu",
      password: passwordFaculty,
      role: "faculty",
    },
    {
      username: "Prof. Arjun Singh",
      email: "arjun.singh@test.edu",
      password: await bcrypt.hash("Faculty@321", 10),
      role: "faculty",
    },
    {
      username: "Riya Sharma",
      email: "riya.sharma@test.edu",
      password: passwordStudent,
      role: "student",
    },
    {
      username: "Vikram Rao",
      email: "vikram.rao@test.edu",
      password: passwordStudent,
      role: "student",
    },
    {
      username: "Neha Gupta",
      email: "neha.gupta@test.edu",
      password: passwordStudent,
      role: "student",
    },
  ]);

  const studentUser1 = users[0];
  const adminUser = users[1];
  const facultyUser1 = users[2];
  const facultyUser2 = users[3];
  const studentUser2 = users[4];
  const studentUser3 = users[5];
  const studentUser4 = users[6];

  // Student profiles (needed for ExamResult.studentId + department stats)
  // Use insertMany — Student.create([...]) fails Mongoose TS overloads
  const students = await Student.insertMany([
    {
      userId: studentUser1._id,
      rollNumber: "CSE21001",
      department: "CSE",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-25",
      admissionYear: "2021",
      examStatus: "passed",
    },
    // Linked to ajiteshk017@gmail.com (admin) — used for seeded exam results
    {
      userId: adminUser._id,
      rollNumber: "CSE21017",
      department: "CSE",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-25",
      admissionYear: "2021",
      examStatus: "passed",
    },
    {
      userId: studentUser2._id,
      rollNumber: "CSE21044",
      department: "CSE",
      semester: 7,
      section: "B",
      status: "active",
      batch: "2020-24",
      admissionYear: "2020",
      examStatus: "passed",
    },
    {
      userId: studentUser3._id,
      rollNumber: "ME21012",
      department: "ME",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-25",
      admissionYear: "2021",
      examStatus: "failed",
    },
    {
      userId: studentUser4._id,
      rollNumber: "CE21008",
      department: "CE",
      semester: 6,
      section: "C",
      status: "active",
      batch: "2021-25",
      admissionYear: "2021",
      examStatus: "passed",
    },
  ]);

  const studentAjitesh = students[0];
  const studentAdminLinked = students[1]; // ajiteshk017@gmail.com
  const studentRiya = students[2];
  const studentVikram = students[3];
  const studentNeha = students[4];

  const faculties = await Faculty.create([
    {
      userId: facultyUser1._id,
      department: "CSE",
      designation: "Assistant Professor",
      salary: 54000,
      status: "active",
      joinedAt: new Date("2022-08-01"),
      lastPromoted: "2024-08-01",
    },
    {
      userId: facultyUser2._id,
      department: "CSE",
      designation: "Associate Professor",
      salary: 62000,
      status: "active",
      joinedAt: new Date("2021-07-01"),
      lastPromoted: "2023-07-01",
    },
  ]);

  const subjects = await Subject.create([
    {
      subjectCode: "CSE301",
      subjectName: "Operating Systems",
      credits: 4,
      semester: "5",
      department: "CSE",
      totalClasses: 40,
      status: "active",
    },
    {
      subjectCode: "CSE302",
      subjectName: "Database Management Systems",
      credits: 4,
      semester: "5",
      department: "CSE",
      totalClasses: 42,
      status: "active",
    },
    {
      subjectCode: "CSE401",
      subjectName: "Computer Networks",
      credits: 3,
      semester: "7",
      department: "CSE",
      totalClasses: 36,
      status: "active",
    },
    {
      subjectCode: "CSE402",
      subjectName: "Software Engineering",
      credits: 3,
      semester: "7",
      department: "CSE",
      totalClasses: 38,
      status: "active",
    },
    {
      subjectCode: "ME201",
      subjectName: "Thermodynamics",
      credits: 4,
      semester: "5",
      department: "ME",
      totalClasses: 40,
      status: "active",
    },
    {
      subjectCode: "CE301",
      subjectName: "Structural Analysis",
      credits: 4,
      semester: "6",
      department: "CE",
      totalClasses: 40,
      status: "active",
    },
  ]);

  const assignments = await SubjectFacultyAssignment.create([
    {
      facultyId: faculties[0]._id,
      subjectId: subjects[0]._id,
      semester: "5",
      section: "A",
      department: "CSE",
      academicYear: "2025-26",
    },
    {
      facultyId: faculties[0]._id,
      subjectId: subjects[1]._id,
      semester: "5",
      section: "ALL",
      department: "CSE",
      academicYear: "2025-26",
    },
    {
      facultyId: faculties[1]._id,
      subjectId: subjects[2]._id,
      semester: "7",
      section: "B",
      department: "CSE",
      academicYear: "2025-26",
    },
  ]);

  const classes = await Class.create([
    {
      subjectId: subjects[0]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE301-A",
      room: "A101",
    },
    {
      subjectId: subjects[1]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE302-A",
      room: "A102",
    },
    {
      subjectId: subjects[2]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE401-B",
      room: "B201",
    },
    {
      subjectId: subjects[3]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE402-B",
      room: "B202",
    },
  ]);

  // Enrollment.studentId refs User (not Student)
  const enrollments = await Enrollment.insertMany([
    {
      studentId: studentUser1._id,
      classId: classes[0]._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    },
    {
      studentId: studentUser1._id,
      classId: classes[1]._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    },
    {
      studentId: studentUser2._id,
      classId: classes[2]._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    },
    {
      studentId: studentUser2._id,
      classId: classes[3]._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    },
  ]);

  // Dummy published exam results — primary set linked to ajiteshk017@gmail.com (adminUser)
  const examResults = await ExamResult.insertMany([
    // --- Linked to ajiteshk017@gmail.com ---
    {
      userId: adminUser._id,
      studentId: studentAdminLinked._id,
      subjectId: subjects[0]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-15"),
    },
    {
      userId: adminUser._id,
      studentId: studentAdminLinked._id,
      subjectId: subjects[1]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-15"),
    },
    {
      userId: adminUser._id,
      studentId: studentAdminLinked._id,
      subjectId: subjects[2]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-16"),
    },
    {
      userId: adminUser._id,
      studentId: studentAdminLinked._id,
      subjectId: subjects[3]._id,
      examType: "Mid Sem",
      examPublishedStatus: "published",
      examResult: "failed",
      examResultDate: new Date("2026-06-16"),
    },
    {
      userId: adminUser._id,
      studentId: studentAdminLinked._id,
      subjectId: subjects[1]._id,
      examType: "End Sem",
      examPublishedStatus: "pending",
      examResult: "not_attended",
      examResultDate: new Date("2026-07-01"),
    },

    // --- Other students (for department pass-rate stats) ---
    {
      userId: studentUser1._id,
      studentId: studentAjitesh._id,
      subjectId: subjects[0]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-15"),
    },
    {
      userId: studentUser1._id,
      studentId: studentAjitesh._id,
      subjectId: subjects[1]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-15"),
    },
    {
      userId: studentUser2._id,
      studentId: studentRiya._id,
      subjectId: subjects[2]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-16"),
    },
    {
      userId: studentUser2._id,
      studentId: studentRiya._id,
      subjectId: subjects[3]._id,
      examType: "Mid Sem",
      examPublishedStatus: "published",
      examResult: "failed",
      examResultDate: new Date("2026-06-16"),
    },
    {
      userId: studentUser3._id,
      studentId: studentVikram._id,
      subjectId: subjects[4]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "failed",
      examResultDate: new Date("2026-06-18"),
    },
    {
      userId: studentUser3._id,
      studentId: studentVikram._id,
      subjectId: subjects[4]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "failed",
      examResultDate: new Date("2026-06-19"),
    },
    {
      userId: studentUser4._id,
      studentId: studentNeha._id,
      subjectId: subjects[5]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-20"),
    },
    {
      userId: studentUser4._id,
      studentId: studentNeha._id,
      subjectId: subjects[5]._id,
      examType: "End Sem",
      examPublishedStatus: "published",
      examResult: "passed",
      examResultDate: new Date("2026-06-21"),
    },
  ]);

  return {
    users,
    students,
    faculties,
    subjects,
    assignments,
    classes,
    enrollments,
    examResults,
    linkedEmail: "ajiteshk017@gmail.com",
    linkedExamResultCount: examResults.filter(
      (r) => String(r.userId) === String(adminUser._id),
    ).length,
  };
}
