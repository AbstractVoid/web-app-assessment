import React from "react";

import IFormRenderer from "../formInputs";
import {
  Result,
  Student,
  Course,
  StudentCol,
  CourseCol,
  ResultCol,
} from "@/shared/types";
import { queryItems } from "@/api/helpers";
import Dropdown from "@/components/adopted/Dropdown";
import { getFullName } from "@/shared/helpers";

function CourseFormInputs({
  itemData,
  setItemData,
  setCanSubmit,
}: IFormRenderer<Result>) {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [students, setStudents] = React.useState<Student[]>([]);

  const [courseName, setCourseName] = React.useState<string>();
  const [studentName, setStudentName] = React.useState<string>();

  React.useEffect(() => {
    queryItems<Student>({
      tableName: "students",
      fields: [StudentCol.Id, StudentCol.FirstName, StudentCol.FamilyName],
    }).then((resp) => {
      if (resp.result === "success") {
        setStudents(resp.data);
      }
    });

    queryItems<Course>({
      tableName: "courses",
    }).then((resp) => {
      if (resp.result === "success") {
        setCourses(resp.data);
      }
    });
  }, []);

  React.useEffect(() => {
    setCanSubmit(
      Boolean(itemData?.course_id && itemData?.student_id && itemData.score)
    );
    if (itemData === undefined) {
      setCourseName(undefined);
      setStudentName(undefined);
    }
  }, [itemData]);

  return (
    <>
      <div className="flex space-x-6">
        <Dropdown
          items={courses.map((course) => course.course_name)}
          activeItem={courseName ?? "Course"}
          onChange={(value) => {
            setItemData({
              ...itemData,
              [ResultCol.CourseId]: courses.find((x) => x.course_name === value)
                ?.id,
            });
            setCourseName(value);
          }}
        />

        <Dropdown
          items={students.map((student) => getFullName(student))}
          activeItem={studentName ?? "Student"}
          onChange={(value) => {
            setItemData({
              ...itemData,
              [ResultCol.StudentId]: students.find(
                (x) => getFullName(x) === value
              )?.id,
            });
            setStudentName(value);
          }}
        />
        
        <Dropdown
          items={["A", "B", "C", "D", "E", "F"]}
          activeItem={itemData?.score ?? "Score"}
          onChange={(value) => {
            setItemData({
              ...itemData,
              [ResultCol.Score]: value,
            });
          }}
        />
      </div>
    </>
  );
}

export default CourseFormInputs;
