import type { NextPage } from "next";
import React from "react";

import PageLayout from "@/components/shared/PageLayout";
import AddItem from "@/components/add-item/AddItem";
import { Course } from "@/shared/types";
import CourseForm from "@/components/add-item/forms/CourseForm";

const AddStudentPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">ADD COURSE</p>
      <AddItem<Course>
        tableName="courses"
        FormRenderer={props => <CourseForm {...props} />}
      />
    </PageLayout>
  );
};

export default AddStudentPage;
