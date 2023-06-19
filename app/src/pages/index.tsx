import type { NextPage } from "next";
import React from "react";

import { Student } from "@/shared/types";
import { useItems } from "@/shared/hooks";

const HomePage: NextPage = () => {
  const students = useItems<Student>({ tableName: 'students' })

  return (
    <div>
      {students.map((student, i) => {
        return (
          <div key={i} className="flex">
            <p>{student.id}</p>
            <p>{student.first_name}</p>
            <p>{student.family_name}</p>
            <p>{student.dob}</p>
            <p>{student.email}</p>
          </div>
        );
      })}
    </div>
  );
};

export default HomePage;
