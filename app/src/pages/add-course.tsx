import type { NextPage } from "next";
import React from "react";

import PageLayout from "@/components/shared/PageLayout";
import AddItem from "@/components/add-item/AddItem";
import { Course } from "@/shared/types";
import CourseFormInputs from "@/components/add-item/form-inputs/CourseFormInputs";

const AddStudentPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Add Course</p>
      <AddItem<Course>
        tableName="courses"
        FormInputs={props => <CourseFormInputs {...props} />}
      />
    </PageLayout>
  );
};

export default AddStudentPage;
