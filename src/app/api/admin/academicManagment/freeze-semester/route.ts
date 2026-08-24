import Connect from "@/dbConnect/connect";
import { Student } from "@/models/student.model";
import {NextResponse, NextRequest} from "next/server";
import { createRequestLogger } from "@/lib/requestLogger";
import {
    DEPARTMENT,
    SEMESTER,
    type DepartmentType,
    type SemesterType,
} from "@/constant/Constant";
import { AUDIT_ACTION, AUDIT_ENTITY_TYPE } from "@/constant/audit";
import { writeAuditFromRequest } from "@/lib/systemUses/audit/writeAuditFromRequest";

export async function POST(request:NextRequest){
    const requestLogger = createRequestLogger();
    try {
        await Connect();
         const body = await request.json();
         const {semester, batch, department, section} = body;
         const semesterTyped = SEMESTER.find((s) => s === Number(semester));
         const departmentTyped = DEPARTMENT.find(
             (d) => d === String(department || "").toUpperCase(),
         ) as DepartmentType | undefined;

         if(!semesterTyped || !section || !departmentTyped || !batch){
            requestLogger.warn({ semester, section, department, batch }, "Invalid payload");
            console.error("All fields are Required");
            return NextResponse.json(
                {
                    success: false,
                    message: "All field are Required"
                },
                {
                    status: 401
                }
            )
        }

        const sectionKey = String(section).toUpperCase();
        const filter: Record<string, unknown> = {
            semester: semesterTyped as SemesterType,
            department: departmentTyped,
            batch,
            status: "active",
        };
        if (sectionKey !== "ALL") {
            filter.section = section;
        }

        const result = await Student.updateMany(filter, {
            $set: {
                status: "inactive",
            },
        });

        if(!result){
            requestLogger.warn({ semester, section, department, batch }, "Semester freeze update failed");
            console.log("Error in getting User detail")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }

        console.log(result.modifiedCount);

        requestLogger.info(
            { semester, section, department, batch, modifiedCount: result.modifiedCount },
            "Semester frozen successfully",
        );
        await writeAuditFromRequest(request, {
            action: AUDIT_ACTION.STUDENT_FREEZE_SEMESTER,
            entityType: AUDIT_ENTITY_TYPE.STUDENT,
            description: `Froze students in ${departmentTyped} semester ${semesterTyped} batch ${batch}`,
            metadata: { semester: semesterTyped, section, department: departmentTyped, batch, modifiedCount: result.modifiedCount },
            severity: "high",
        });
        return NextResponse.json(
            {
                success: true,
                message: "Frooze the Semester's Student",
                result
            }, {status: 200}
        )
        

        
    } catch (error:any) {
        requestLogger.error({ err: error }, "Failed to freeze semester");
        return NextResponse.json(
            {
                success: false,
                message: "Error in Freezing Semester of the Students",
            },
            { status: 500 },
        );
    }
}
