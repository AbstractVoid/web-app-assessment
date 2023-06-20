import type { NextPage } from "next";
import React from "react";

import PageLayout from "@/components/shared/PageLayout";
import AddItem from "@/components/add-item/AddItem";
import { Student } from "@/shared/types";
import StudentFormInputs from "@/components/add-item/form-inputs/StudentFormInputs";

const AddStudentPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Add Student</p>
      <AddItem<Student>
        tableName="students"
        FormInputs={props => <StudentFormInputs {...props} />}
      />
    </PageLayout>
  );
};

export default AddStudentPage;
