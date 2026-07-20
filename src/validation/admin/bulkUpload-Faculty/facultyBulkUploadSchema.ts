import { z } from "zod";

export const facultyUploadSchema = z.object({
  name: z.string({ message: "Name is required" }).trim().min(2, "Name is required"),
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  designation: z.string({ message: "Designation is required" }).trim().min(2),
  department: z.string({ message: "Department is required" }).trim().min(1),
  salary: z.coerce.number({ message: "Salary is required" }).min(0),
  status: z
    .string({ message: "Status is required" })
    .trim()
    .transform((v) => v.toLowerCase())
    .pipe(z.enum(["active", "inactive", "on leave"])),
});
