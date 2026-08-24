/** Match assignments for a student. Old rows without section still show. */
export function assignmentFilterForStudent(student: {
  department?: string;
  semester?: number;
  batch?: string;
  section?: string;
}) {
  const filter: Record<string, unknown> = {
    department: student.department,
    semester: student.semester,
    status: "uploaded",
  };
  if (student.batch) filter.batch = student.batch;
  if (student.section) {
    filter.$or = [
      { section: student.section },
      { section: { $exists: false } },
      { section: null },
      { section: "" },
    ];
  }
  return filter;
}
