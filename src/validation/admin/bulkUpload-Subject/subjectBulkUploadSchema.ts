import { z } from "zod";

export const subjectUploadSchema = z.object({
  subjectCode: z.string({ message: "Subject code is required" }).trim().min(2),
  subjectName: z.string({ message: "Subject name is required" }).trim().min(2),
  credits: z.coerce.number({ message: "Credits is required" }).min(1).max(10),
  semester: z.coerce.number({ message: "Semester is required" }).min(1).max(8),
  department: z.string({ message: "Department is required" }).trim().min(1),
  totalClasses: z.coerce.number().min(0).optional().default(0),
});
