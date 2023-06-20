export interface ItemBase {
  id: number;
}

export interface Student extends ItemBase {
  first_name: string;
  family_name: string;
  dob: string;
  email: string;
}

export interface Course extends ItemBase {
  course_name: string;
}

export type Score = "A" | "B" | "C" | "D" | "E" | "F";

export interface Result extends ItemBase {
  student_id: number;
  student_name?: string;
  course_id: number;
  course_name?: string;
  score: Score;
}
