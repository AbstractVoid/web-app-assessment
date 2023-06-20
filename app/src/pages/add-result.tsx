import type { NextPage } from "next";
import React from "react";

import PageLayout from "@/components/shared/PageLayout";
import AddItem from "@/components/add-item/AddItem";
import { Course, Result } from "@/shared/types";
import ResultFormInputs from "@/components/add-item/form-inputs/ResultFormInputs";

const AddStudentPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Add Result</p>
      <AddItem<Result>
        tableName="results"
        FormInputs={props => <ResultFormInputs {...props} />}
      />
    </PageLayout>
  );
};

export default AddStudentPage;
