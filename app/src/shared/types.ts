export enum StudentCol {
  Id = "id",
  FirstName = "first_name",
  FamilyName = "family_name",
  DateOfBirth = "dob",
  Email = "email",
}

export enum CourseCol {
  Id = "id",
  CourseName = "course_name",
}

export enum ResultCol {
  Id = "id",
  StudentId = "student_id",
  CourseId = "course_id",
  Score = "score",
}

export interface ItemBase {
  id: number;
}

export interface Student extends ItemBase {
  [StudentCol.FirstName]: string;
  [StudentCol.FamilyName]: string;
  [StudentCol.DateOfBirth]: string;
  [StudentCol.Email]: string;
}

export interface Course extends ItemBase {
  [CourseCol.CourseName]: string;
}

export type Score = "A" | "B" | "C" | "D" | "E" | "F";

export interface Result extends ItemBase {
  [ResultCol.StudentId]: number;
  student_name?: string;
  [ResultCol.CourseId]: number;
  course_name?: string;
  [ResultCol.Score]: Score;
}
