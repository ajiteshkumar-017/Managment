import {z} from "zod";


export const studentUploadSchema = z.object({
    name: z.string({ message: "Name is required" }).trim().min(3, "Name is required"),

    email: z.string({ message: "Email is required" }).email("Invalid email"),

    rollNo: z.string({ message: "Roll number is required" }).trim().min(6, "Roll number is required"),

    semester: z.coerce.number({ message: "Semester is required" }).min(1).max(8),

    section: z.string({ message: "Section is required" }).trim().min(1),

    department: z.string({ message: "Department is required" }).trim().min(1),

    batch: z.string({message: "Batch is Required"}).trim().min(1),

})