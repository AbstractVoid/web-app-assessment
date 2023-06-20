import { Student } from "./types";

export const classNames = (
  ...classes: (false | null | undefined | string)[]
): string => classes.filter(Boolean).join(" ");

const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

export function isValidPastDate(value: string) {
  try {
    if (value.match(dateRegex)) {
      const matches = dateRegex.exec(value)!;
      const month = parseInt(matches[1]);
      const day = parseInt(matches[2]);
      const year = parseInt(matches[3]);

      const date = new Date(year, month, day);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      return (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        date <= currentDate
      );
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export function getFullName(student: Student) {
  return `${student.first_name} ${student.family_name}`;
}
