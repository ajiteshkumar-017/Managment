import bcrypt from "bcryptjs";
import crypto from "crypto";
import Connect from "@/dbConnect/connect";
import { User } from "@/models/user";
import { Subject } from "@/models/subject.model";
import { Class } from "@/models/class.model";
import { Enrollment } from "@/models/enrollement.model";
import { Faculty } from "@/models/faculty.model";
import { SubjectFacultyAssignment } from "@/models/subjectFacultyAssignment.model";
import { Student } from "@/models/student.model";
// import { ExamResult } from "@/models/exam.model";
import { ResultBatch } from "@/models/resultBatch.model";
import { SemesterResult } from "@/models/semesterResult";
import { SubjectResult } from "@/models/subjectResult";
import { AttendanceSession } from "@/models/attendanceSession";
import { DEPARTMENT, SEMESTER } from "@/constant/Constant";

/** At least 4 subjects for every department × semester. */
const SUBJECT_SLOTS = [
  { suffix: "01", title: "Core Concepts", credits: 4, practical: false },
  { suffix: "02", title: "Advanced Theory", credits: 3, practical: false },
  { suffix: "03", title: "Laboratory Practice", credits: 2, practical: true },
  { suffix: "04", title: "Applied Project", credits: 3, practical: true },
] as const;

function buildAllSubjects() {
  return DEPARTMENT.flatMap((department) =>
    SEMESTER.flatMap((semester) =>
      SUBJECT_SLOTS.map((slot) => ({
        subjectCode: `${department}${semester}${slot.suffix}`,
        subjectName: `${department} Sem ${semester} ${slot.title}`,
        credits: slot.credits,
        semester,
        department,
        totalClasses: slot.practical ? 30 : 40,
        IspracticalSubject: slot.practical,
        status: "active" as const,
      })),
    ),
  );
}

export async function seedDatabase() {
  await Connect();

  await SubjectResult.deleteMany({});
  await SemesterResult.deleteMany({});
  await ResultBatch.deleteMany({});
  await AttendanceSession.deleteMany({});
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
      profileCompleted: true,
    },
    {
      username: "Admin User",
      email: "ajiteshk017@gmail.com",
      password: passwordAdmin,
      role: "admin",
      profileCompleted: true,
    },
    {
      username: "Dr. Maya Patel",
      email: "maya.patel@test.edu",
      password: passwordFaculty,
      role: "faculty",
      profileCompleted: true,
    },
    {
      username: "Prof. Arjun Singh",
      email: "arjun.singh@test.edu",
      password: await bcrypt.hash("Faculty@321", 10),
      role: "faculty",
      profileCompleted: true,
    },
    {
      username: "Riya Sharma",
      email: "riya.sharma@test.edu",
      password: passwordStudent,
      role: "student",
      profileCompleted: true,
    },
    {
      username: "Vikram Rao",
      email: "vikram.rao@test.edu",
      password: passwordStudent,
      role: "student",
      profileCompleted: true,
    },
    {
      username: "Neha Gupta",
      email: "neha.gupta@test.edu",
      password: passwordStudent,
      role: "student",
      profileCompleted: true,
    },
  ]);

  const studentUser1 = users[0];
  const adminUser = users[1];
  const facultyUser1 = users[2];
  const facultyUser2 = users[3];
  const studentUser2 = users[4];
  const studentUser3 = users[5];
  const studentUser4 = users[6];

  // Student: userId, rollNumber, department, semester, section, batch, admissionYear, status, lastPromoted
  const students = await Student.insertMany([
    {
      userId: studentUser1._id,
      rollNumber: "CSE21001",
      department: "CSE",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-2025",
      admissionYear: "2021",
      lastPromoted: new Date("2025-07-01"),
    },
    // Linked to ajiteshk017@gmail.com (admin) — used for seeded exam results
    {
      userId: adminUser._id,
      rollNumber: "CSE21017",
      department: "CSE",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-2025",
      admissionYear: "2021",
      lastPromoted: new Date("2025-07-01"),
    },
    {
      userId: studentUser2._id,
      rollNumber: "CSE21044",
      department: "CSE",
      semester: 7,
      section: "B",
      status: "active",
      batch: "2020-2024",
      admissionYear: "2020",
      lastPromoted: new Date("2025-07-01"),
    },
    {
      userId: studentUser3._id,
      rollNumber: "ME21012",
      department: "ME",
      semester: 5,
      section: "A",
      status: "active",
      batch: "2021-2025",
      admissionYear: "2021",
      lastPromoted: new Date("2025-07-01"),
    },
    {
      userId: studentUser4._id,
      rollNumber: "CE21008",
      department: "CE",
      semester: 6,
      section: "C",
      status: "active",
      batch: "2021-2025",
      admissionYear: "2021",
      lastPromoted: new Date("2025-07-01"),
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
      prominentWork: "Distributed systems research and OS curriculum design",
    },
    {
      userId: facultyUser2._id,
      department: "CSE",
      designation: "Associate Professor",
      salary: 62000,
      status: "active",
      joinedAt: new Date("2021-07-01"),
      lastPromoted: "2023-07-01",
      patents: ["IN-2023-COMP-NET-001"],
      prominentWork: "Computer networks and campus network security",
    },
  ]);

  // 10 departments × 8 semesters × 4 subjects = 320 subjects
  const subjects = await Subject.insertMany(buildAllSubjects());
  const subjectByCode = Object.fromEntries(
    subjects.map((s) => [s.subjectCode, s]),
  );

  const requireSubject = (code: string) => {
    const subject = subjectByCode[code];
    if (!subject) {
      throw new Error(`Seed subject missing: ${code}`);
    }
    return subject;
  };

  const cseSem5 = ["CSE501", "CSE502", "CSE503", "CSE504"].map(requireSubject);
  const cseSem7 = ["CSE701", "CSE702", "CSE703", "CSE704"].map(requireSubject);

  const assignments = await SubjectFacultyAssignment.create([
    {
      facultyId: faculties[0]._id,
      subjectId: cseSem5[0]._id,
      semester: 5,
      section: "A",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[0]._id,
      subjectId: cseSem5[1]._id,
      semester: 5,
      section: "ALL",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[0]._id,
      subjectId: cseSem5[2]._id,
      semester: 5,
      section: "A",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[0]._id,
      subjectId: cseSem5[3]._id,
      semester: 5,
      section: "A",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[1]._id,
      subjectId: cseSem7[0]._id,
      semester: 7,
      section: "B",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[1]._id,
      subjectId: cseSem7[1]._id,
      semester: 7,
      section: "B",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[1]._id,
      subjectId: cseSem7[2]._id,
      semester: 7,
      section: "B",
      department: "CSE",
      academicYear: "2025-2026",
    },
    {
      facultyId: faculties[1]._id,
      subjectId: cseSem7[3]._id,
      semester: 7,
      section: "B",
      department: "CSE",
      academicYear: "2025-2026",
    },
  ]);

  // Class: subjectId, facultyId (User), classCode, department, semester, section, batch, room, day, startTime, endTime
  const classes = await Class.create([
    {
      subjectId: cseSem5[0]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE501-A",
      department: "CSE",
      semester: 5,
      section: "A",
      batch: "2021-2025",
      room: "A101",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      subjectId: cseSem5[1]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE502-A",
      department: "CSE",
      semester: 5,
      section: "A",
      batch: "2021-2025",
      room: "A102",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      subjectId: cseSem5[2]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE503-A",
      department: "CSE",
      semester: 5,
      section: "A",
      batch: "2021-2025",
      room: "A103",
      day: "Wednesday",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      subjectId: cseSem5[3]._id,
      facultyId: facultyUser1._id,
      classCode: "CSE504-A",
      department: "CSE",
      semester: 5,
      section: "A",
      batch: "2021-2025",
      room: "A104",
      day: "Thursday",
      startTime: "14:00",
      endTime: "16:00",
    },
    {
      subjectId: cseSem7[0]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE701-B",
      department: "CSE",
      semester: 7,
      section: "B",
      batch: "2020-2024",
      room: "B201",
      day: "Monday",
      startTime: "09:00",
      endTime: "10:00",
    },
    {
      subjectId: cseSem7[1]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE702-B",
      department: "CSE",
      semester: 7,
      section: "B",
      batch: "2020-2024",
      room: "B202",
      day: "Tuesday",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      subjectId: cseSem7[2]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE703-B",
      department: "CSE",
      semester: 7,
      section: "B",
      batch: "2020-2024",
      room: "B203",
      day: "Wednesday",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      subjectId: cseSem7[3]._id,
      facultyId: facultyUser2._id,
      classCode: "CSE704-B",
      department: "CSE",
      semester: 7,
      section: "B",
      batch: "2020-2024",
      room: "B204",
      day: "Friday",
      startTime: "14:00",
      endTime: "16:00",
    },
  ]);

  // AttendanceSession: classId, facultyId (Faculty), sessionCode, sessionToken, startedAt, expiryTime, isActive, status
  const now = new Date();
  const threeMinutes = 3 * 60 * 1000;
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const attendanceSessions = await AttendanceSession.insertMany([
    {
      classId: classes[0]._id,
      facultyId: faculties[0]._id,
      sessionCode: 482913,
      sessionToken: crypto.randomBytes(32).toString("hex"),
      startedAt: now,
      expiryTime: new Date(now.getTime() + threeMinutes),
      isActive: true,
      status: "active",
    },
    {
      classId: classes[1]._id,
      facultyId: faculties[0]._id,
      sessionCode: 156274,
      sessionToken: crypto.randomBytes(32).toString("hex"),
      startedAt: oneHourAgo,
      expiryTime: new Date(oneHourAgo.getTime() + threeMinutes),
      isActive: false,
      status: "expired",
    },
    {
      classId: classes[4]._id,
      facultyId: faculties[1]._id,
      sessionCode: 739501,
      sessionToken: crypto.randomBytes(32).toString("hex"),
      startedAt: oneHourAgo,
      expiryTime: new Date(oneHourAgo.getTime() + threeMinutes),
      isActive: false,
      status: "closed",
    },
  ]);

  const enrollments = await Enrollment.insertMany([
    // Ajitesh — CSE Sem 5 (all 4 subjects)
    ...classes.slice(0, 4).map((cls) => ({
      studentId: studentUser1._id,
      classId: cls._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    })),
    // Riya — CSE Sem 7 (all 4 subjects)
    ...classes.slice(4, 8).map((cls) => ({
      studentId: studentUser2._id,
      classId: cls._id,
      enrolledAt: new Date("2026-01-10"),
      exitedAt: new Date("2026-06-10"),
    })),
  ]);

  // ExamResult: studentId, subjectId, obtainedMarks?, maximumMarks?, examType, examPublishedStatus, examResult, examResultDate
  // const examResults = await ExamResult.insertMany([
  //   {
  //     studentId: studentAdminLinked._id,
  //     subjectId: subjects[0]._id,
  //     obtainedMarks: 78,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-15"),
  //   },
  //   {
  //     studentId: studentAdminLinked._id,
  //     subjectId: subjects[1]._id,
  //     obtainedMarks: 82,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-15"),
  //   },
  //   {
  //     studentId: studentAdminLinked._id,
  //     subjectId: subjects[2]._id,
  //     obtainedMarks: 71,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-16"),
  //   },
  //   {
  //     studentId: studentAdminLinked._id,
  //     subjectId: subjects[3]._id,
  //     obtainedMarks: 28,
  //     maximumMarks: 50,
  //     examType: "Mid Sem",
  //     examPublishedStatus: "published",
  //     examResult: "failed",
  //     examResultDate: new Date("2026-06-16"),
  //   },
  //   {
  //     studentId: studentAdminLinked._id,
  //     subjectId: subjects[1]._id,
  //     examType: "End Sem",
  //     examPublishedStatus: "pending",
  //     examResult: "not_attended",
  //     examResultDate: new Date("2026-07-01"),
  //   },
  //   {
  //     studentId: studentAjitesh._id,
  //     subjectId: subjects[0]._id,
  //     obtainedMarks: 88,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-15"),
  //   },
  //   {
  //     studentId: studentAjitesh._id,
  //     subjectId: subjects[1]._id,
  //     obtainedMarks: 85,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-15"),
  //   },
  //   {
  //     studentId: studentRiya._id,
  //     subjectId: subjects[2]._id,
  //     obtainedMarks: 74,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-16"),
  //   },
  //   {
  //     studentId: studentRiya._id,
  //     subjectId: subjects[3]._id,
  //     obtainedMarks: 22,
  //     maximumMarks: 50,
  //     examType: "Mid Sem",
  //     examPublishedStatus: "published",
  //     examResult: "failed",
  //     examResultDate: new Date("2026-06-16"),
  //   },
  //   {
  //     studentId: studentVikram._id,
  //     subjectId: subjects[4]._id,
  //     obtainedMarks: 31,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "failed",
  //     examResultDate: new Date("2026-06-18"),
  //   },
  //   {
  //     studentId: studentVikram._id,
  //     subjectId: subjects[4]._id,
  //     obtainedMarks: 35,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "failed",
  //     examResultDate: new Date("2026-06-19"),
  //   },
  //   {
  //     studentId: studentNeha._id,
  //     subjectId: subjects[5]._id,
  //     obtainedMarks: 79,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-20"),
  //   },
  //   {
  //     studentId: studentNeha._id,
  //     subjectId: subjects[5]._id,
  //     obtainedMarks: 81,
  //     maximumMarks: 100,
  //     examType: "End Sem",
  //     examPublishedStatus: "published",
  //     examResult: "passed",
  //     examResultDate: new Date("2026-06-21"),
  //   },
  // ]);

  // ResultBatch: title, department, semester, academicYear, ExamType, batch, subjectId, status
  const resultBatches = await ResultBatch.insertMany([
    {
      title: "CSE Sem 5 End Sem 2025-26",
      department: "CSE",
      semester: 5,
      academicYear: "2025-2026",
      ExamType: "End Sem",
      batch: "2021-25",
      subjectId: cseSem5[0]._id,
      status: "published",
    },
    {
      title: "CSE Sem 7 Mid Sem 2025-26",
      department: "CSE",
      semester: 7,
      academicYear: "2025-2026",
      ExamType: "Mid Sem",
      batch: "2020-24",
      subjectId: cseSem7[0]._id,
      status: "published",
    },
  ]);

  // SemesterResult: studentId, semester, resultBatch, CGPA, SGPA, rank, passStatus, passStatusDate, hadBack
  const semesterResults = await SemesterResult.insertMany([
    {
      studentId: studentAjitesh._id,
      semester: 5,
      resultBatch: resultBatches[0]._id,
      CGPA: 8.4,
      SGPA: 8.6,
      rank: 3,
      passStatus: "Pass",
      passStatusDate: new Date("2026-06-25"),
      hadBack: false,
    },
    {
      studentId: studentAdminLinked._id,
      semester: 5,
      resultBatch: resultBatches[0]._id,
      CGPA: 8.1,
      SGPA: 8.2,
      rank: 5,
      passStatus: "Pass",
      passStatusDate: new Date("2026-06-25"),
      hadBack: false,
    },
    {
      studentId: studentRiya._id,
      semester: 7,
      resultBatch: resultBatches[1]._id,
      CGPA: 7.5,
      SGPA: 7.2,
      rank: 12,
      passStatus: "Pass",
      passStatusDate: new Date("2026-06-26"),
      hadBack: true,
    },
  ]);

  // SubjectResult: semesterResultId, subjectId, grade, maximumMarks, obtainedMarks, creditsEarned, resultStatus
  const subjectResults = await SubjectResult.insertMany([
    {
      semesterResultId: semesterResults[0]._id,
      subjectId: cseSem5[0]._id,
      grade: "A",
      maximumMarks: 100,
      obtainedMarks: 88,
      creditsEarned: 4,
      resultStatus: "passed",
    },
    {
      semesterResultId: semesterResults[0]._id,
      subjectId: cseSem5[1]._id,
      grade: "A-",
      maximumMarks: 100,
      obtainedMarks: 85,
      creditsEarned: 3,
      resultStatus: "passed",
    },
    {
      semesterResultId: semesterResults[1]._id,
      subjectId: cseSem5[0]._id,
      grade: "B+",
      maximumMarks: 100,
      obtainedMarks: 78,
      creditsEarned: 4,
      resultStatus: "passed",
    },
    {
      semesterResultId: semesterResults[1]._id,
      subjectId: cseSem5[1]._id,
      grade: "A",
      maximumMarks: 100,
      obtainedMarks: 82,
      creditsEarned: 3,
      resultStatus: "passed",
    },
    {
      semesterResultId: semesterResults[2]._id,
      subjectId: cseSem7[0]._id,
      grade: "B",
      maximumMarks: 100,
      obtainedMarks: 74,
      creditsEarned: 4,
      resultStatus: "passed",
    },
    {
      semesterResultId: semesterResults[2]._id,
      subjectId: cseSem7[1]._id,
      grade: "C",
      maximumMarks: 50,
      obtainedMarks: 22,
      creditsEarned: 0,
      resultStatus: "failed",
    },
  ]);

  return {
    users,
    students,
    faculties,
    subjects,
    assignments,
    classes,
    attendanceSessions,
    enrollments,
    resultBatches,
    semesterResults,
    subjectResults,
    linkedEmail: "ajiteshk017@gmail.com",
  };
}
