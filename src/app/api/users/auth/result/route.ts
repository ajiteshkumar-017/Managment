import { getUser } from "@/lib/getUser";
import { Student } from "@/models";
import { ResultBatch } from "@/models/resultBatch.model";
import { SemesterResult } from "@/models/semesterResult";
import { SubjectResult } from "@/models/subjectResult";
import { Subject } from "@/models/subject.model";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest){
    try {
        const user = await getUser();
        console.log("User",user);

        const studentInfo = await Student.findOne({userId: user._id});
        if(!studentInfo){
            return NextResponse.json({
                success: false,
                message: "Student not found"
            },{status: 404});
        }
        
        const semesterInfo = await SemesterResult.find({ studentId: studentInfo._id }).populate({
            path: "resultBatch",
            model: ResultBatch,
        });
        if (!semesterInfo.length) {
            return NextResponse.json({
                success: false,
                message: "Semester result not found"
            },{status: 404});
        }

        console.log("Semester Info",semesterInfo);

        // SubjectResult links to SemesterResult via semesterResultId (not via ResultBatch.subjectId)
        const subjectInfo = await SubjectResult.find({
            semesterResultId: { $in: semesterInfo.map((semester) => semester._id) },
        }).populate({
            path: "subjectId",
            model: Subject,
        });

        console.log("Subject Info",subjectInfo);
        console.log("Subject Length", subjectInfo.length);

        // const data = {
        //     CGPA : semesterInfo.map((semester) => semester.CGPA),
        //     semester: semesterInfo.map((semester) => semester.semester),
        //     ClassRank: semesterInfo.map((semester) => semester.rank),
        //     status: semesterInfo.map((semester) => semester.passStatus),
        // }

        const semesterData = semesterInfo.map((sem) => ({
            CGPA: sem.CGPA,
            semester: sem.semester,
            ClassRank: sem.rank,
            status: sem.passStatus,
            SGPA: sem.SGPA,
        }));

        const SubjectWiseInfo = subjectInfo.map((subject) => {
            // After .populate(), subjectId is a Subject doc — but TS still types it as ObjectId
            const subjectDoc = subject.subjectId as unknown as {
                subjectName: string;
                subjectCode: string;
                credits: number;
            };

            const marks = subject.obtainedMarks;
            let gradePoint = 0;
            if (marks >= 90) gradePoint = 10;
            else if (marks >= 80) gradePoint = 9;
            else if (marks >= 70) gradePoint = 8;
            else if (marks >= 60) gradePoint = 7;
            else if (marks >= 50) gradePoint = 6;
            else if (marks >= 40) gradePoint = 5;
            else if (marks >= 30) gradePoint = 4;
            else if (marks >= 20) gradePoint = 3;

            return {
                subjectName: subjectDoc.subjectName,
                subjectCode: subjectDoc.subjectCode,
                markObtained: subject.obtainedMarks,
                totalMark: subject.maximumMarks,
                grade: subject.grade,
                credit: subjectDoc.credits,
                cgpa: gradePoint.toFixed(1),
            };
        });

        return NextResponse.json({
            success: true,
            message: "Semester result found",
            data: {
                semesterInfo,
                subjectInfo,
                semesterData,
                SubjectWiseInfo,
            },
        })
    } catch (error) {
        console.log("Error", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error fetching semester result"
            },
            {
                status: 500
            }
        )
    }
}
