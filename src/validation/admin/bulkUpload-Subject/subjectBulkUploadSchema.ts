import { z } from "zod";

const practicalSubjectSchema = z.preprocess((value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "yes", "y", "1"].includes(normalized)) return true;
    if (["false", "no", "n", "0", ""].includes(normalized)) return false;
  }
  return value;
}, z.boolean().optional().default(false));

export const subjectUploadSchema = z.object({
  subjectCode: z.string({ message: "Subject code is required" }).trim().min(2),
  subjectName: z.string({ message: "Subject name is required" }).trim().min(2),
  credits: z.coerce.number({ message: "Credits is required" }).min(1).max(10),
  semester: z.coerce.number({ message: "Semester is required" }).min(1).max(8),
  department: z.string({ message: "Department is required" }).trim().min(1),
  totalClasses: z.coerce.number().min(0).optional().default(0),
  IspracticalSubject: practicalSubjectSchema,
});
