import { NextRequest, NextResponse } from "next/server";
import Connect from "@/dbConnect/connect";

import { User } from "@/models/user";
import { Subject } from "@/models/subject.model";
import { Class } from "@/models/class.model";
import { Enrollment } from "@/models/enrollement.model";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  try {
    await Connect();

    // Cleanup
    await Enrollment.deleteMany({});
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await User.deleteMany({});

    // ===================================================
    // USERS
    // ===================================================

    const users = await User.create([
      {
        username: "Jacob Kumar",
        email: "jacob@gmail.com",
        password: "12345678",
        role: "student",
      },
      {
        username: "Sarah Jenkins",
        email: "sarah@gmail.com",
        password: "12345678",
        role: "student",
      },
      {
        username: "Dr. Smith",
        email: "drsmith@gmail.com",
        password: "12345678",
        role: "faculty",
      },
      {
        username: "Prof. Davis",
        email: "hdavis@gmail.com",
        password: "12345678",
        role: "faculty",
      },
      {
        username: "Admin User",
        email: "admin@gmail.com",
        password: "12345678",
        role: "admin",
      },
    ]);

    const student1 = users[0];
    const student2 = users[1];

    const faculty1 = users[2];
    const faculty2 = users[3];


const hashedPassword = await bcrypt.hash("Ajitesh@123", 10);

        const ajitesh = await User.create({
        username: "Ajitesh Kumar",
        email: "ajiteshk007@gmail.com",
        password: hashedPassword,
        role: "student",
        });

    // ===================================================
    // SUBJECTS
    // ===================================================

    const subjects = await Subject.create([
      {
        subjectCode: "CS202",
        subjectName: "Database Management Systems",
        credits: 4,
        semester: "3rd Semester",
      },
      {
        subjectCode: "CS204",
        subjectName: "Operating Systems",
        credits: 4,
        semester: "4th Semester",
      },
      {
        subjectCode: "CS301",
        subjectName: "Computer Networks",
        credits: 3,
        semester: "5th Semester",
      },
      {
        subjectCode: "CS401",
        subjectName: "Artificial Intelligence",
        credits: 4,
        semester: "7th Semester",
      },
    ]);

    // ===================================================
    // CLASSES
    // ===================================================

    const classes = await Class.create([
      {
        subjectId: subjects[0]._id,
        facultyId: faculty1._id,
        classCode: "DBMS-A",
        room: "A101",
      },
      {
        subjectId: subjects[1]._id,
        facultyId: faculty1._id,
        classCode: "OS-A",
        room: "A102",
      },
      {
        subjectId: subjects[2]._id,
        facultyId: faculty2._id,
        classCode: "CN-A",
        room: "B201",
      },
      {
        subjectId: subjects[3]._id,
        facultyId: faculty2._id,
        classCode: "AI-A",
        room: "B202",
      },
    ]);

    // ===================================================
    // ENROLLMENTS
    // ===================================================

    const enrollments = await Enrollment.insertMany([
      {
        studentId: student1._id,
        classId: classes[0]._id,
        enrolledAt: new Date("2026-01-10"),
        exitedAt: new Date("2026-06-10"),
      },
      {
        studentId: student1._id,
        classId: classes[1]._id,
        enrolledAt: new Date("2026-01-10"),
        exitedAt: new Date("2026-06-10"),
      },
      {
        studentId: student1._id,
        classId: classes[2]._id,
        enrolledAt: new Date("2026-01-10"),
        exitedAt: new Date("2026-06-10"),
      },
      {
        studentId: student2._id,
        classId: classes[0]._id,
        enrolledAt: new Date("2026-01-10"),
        exitedAt: new Date("2026-06-10"),
      },
      {
        studentId: student2._id,
        classId: classes[3]._id,
        enrolledAt: new Date("2026-01-10"),
        exitedAt: new Date("2026-06-10"),
      },
    ]);
    await Enrollment.create([
  {
    studentId: ajitesh._id,
    classId: classes[0]._id,
    enrolledAt: new Date(),
    exitedAt: new Date("2026-06-10"),
  },
  {
    studentId: ajitesh._id,
    classId: classes[1]._id,
    enrolledAt: new Date(),
    exitedAt: new Date("2026-06-10"),
  },
  {
    studentId: ajitesh._id,
    classId: classes[2]._id,
    enrolledAt: new Date(),
    exitedAt: new Date("2026-06-10"),
  },
  {
    studentId: ajitesh._id,
    classId: classes[3]._id,
    enrolledAt: new Date(),
    exitedAt: new Date("2026-06-10"),
  },
]);

console.log("Database seeded successfully");

    return NextResponse.json(
      {
        success: true,
        message: "Database seeded successfully",
        data: {
          users,
          ajitesh,
          subjects,
          classes,
          enrollments,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}