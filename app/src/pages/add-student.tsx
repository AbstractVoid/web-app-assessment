import type { NextPage } from "next";
import React from "react";

import PageLayout from "@/components/shared/PageLayout";
import AddItem from "@/components/add-item/AddItem";
import { Student } from "@/shared/types";
import StudentForm from "@/components/add-item/forms/StudentForm";

const AddStudentPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">ADD STUDENT</p>
      <AddItem<Student>
        tableName="students"
        FormRenderer={props => <StudentForm {...props} />}
      />
    </PageLayout>
  );
};

export default AddStudentPage;
