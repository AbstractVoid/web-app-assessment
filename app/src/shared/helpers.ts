import { Student } from "./types";

export const classNames = (
  ...classes: (false | null | undefined | string)[]
): string => classes.filter(Boolean).join(" ");

const dateRegex = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;

export function parseDate(value: string): Date | undefined {
  try {
    if (value.match(dateRegex)) {
      const matches = dateRegex.exec(value)!;
      const month = parseInt(matches[1]);
      const day = parseInt(matches[2]);
      const year = parseInt(matches[3]);

      if (month === 0) {
        return undefined;
      }

      const date = new Date(year, month, day);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (
        date.getDate() === day &&
        date.getMonth() === month &&
        date.getFullYear() === year &&
        date <= currentDate
      ) {
        return date;
      }
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }
}

export function getFullName(student: Student) {
  return `${student.first_name} ${student.family_name}`;
}

export function yearsSinceCurrTime(date: Date): number {
  const currTime = new Date();
  const currMonth = currTime.getMonth() + 1;

  let diff = currTime.getFullYear() - date.getFullYear();
  if (currMonth + 1 < date.getMonth() || 
      (currMonth == date.getMonth() && currTime.getDate() < date.getDate())) {
    diff--;
  }
  return diff;
}