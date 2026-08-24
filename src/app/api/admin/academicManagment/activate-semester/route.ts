import {NextRequest, NextResponse} from "next/server"
import { Student } from "@/models/student.model"
import Connect from "@/dbConnect/connect";
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

        const {semester, section, department, batch} = body;
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
            department: departmentTyped,
            semester: semesterTyped as SemesterType,
            batch,
            status: "inactive",
        };
        if (sectionKey !== "ALL") {
            filter.section = section;
        }

        const result = await Student.updateMany(filter, {
            $set: {
                status: "active",
            },
        });

        if(!result){
            requestLogger.warn({ semester, section, department, batch }, "Semester activation update failed");
            console.log("Error in Updating Status of Semester ")

            return NextResponse.json(
                {
                    success: false,
                    message: "Something went Wrong. Please reselect your desired field"
                }, {status: 401}
            )
        }

        console.log("Result:", result);

        requestLogger.info(
            { semester, section, department, batch, modifiedCount: result.modifiedCount },
            "Semester activated successfully",
        );
        await writeAuditFromRequest(request, {
            action: AUDIT_ACTION.STUDENT_ACTIVATE_SEMESTER,
            entityType: AUDIT_ENTITY_TYPE.STUDENT,
            description: `Activated students in ${departmentTyped} semester ${semesterTyped} batch ${batch}`,
            metadata: { semester: semesterTyped, section, department: departmentTyped, batch, modifiedCount: result.modifiedCount },
            severity: "high",
        });
        return NextResponse.json(
            {
                success: true,
                message: "Activated the Semester",
                result
            },{
                status:200
            }
        )
        
        
    } catch (error:any) {
        requestLogger.error({ err: error }, "Failed to activate semester");
        console.log("Error in Activation of Semester", error)
            console.log("Error Message", error?.message);
            console.log("Error Stack", error?.message?.stack);

            return NextResponse.json(
                {
                    success: false,
                    message: "Error in Activation of Semester"
                }, {status: 500}
            )
    }
}
