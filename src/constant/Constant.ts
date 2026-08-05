export const DEPARTMENT = ['CSE', 'ECE', 'EEE', 'ME', 'CE', 'CHE', 'BBA', 'MBA', 'MCA', 'PHD'] as const;

export type DepartmentType = typeof DEPARTMENT[number];

export const SEMESTER = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export type SemesterType = typeof SEMESTER[number];

export const ACADEMIC_YEAR = ['2020-2021', '2021-2022', '2022-2023', '2023-2024', '2024-2025', '2025-2026', '2026-2027', '2027-2028'] as const;

export type AcademicYearType = typeof ACADEMIC_YEAR[number];

export const STATUS = ['active', 'inactive'] as const;

export type StatusType = typeof STATUS[number];

export const EXAM_RESULT_TYPE = ['Mid Sem', 'End Sem'] as const;

export type  ExamResultType = typeof EXAM_RESULT_TYPE[number];

export const RESULT_STATUS = ['published', 'unpublished', 'draft'] as const;

export type ResultStatusType = typeof RESULT_STATUS[number];