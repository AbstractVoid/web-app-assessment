import type { NextPage } from "next";
import React from "react";

import { ItemSummaries } from "@/components/summaries/ItemSummaries";
import { Student } from "@/shared/types";
import { StudentItemRenderer } from "@/components/summaries/ItemSummary";
import PageLayout from "@/components/shared/PageLayout";

const StudentsPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Students</p>
      <ItemSummaries<Student>
        tableName="students"
        columnNames={["Name & Family Name", "Date of Birth", "Email", "Delete"]}
        itemRenderer={(props) => (
          <StudentItemRenderer {...props} />
        )}
      />
    </PageLayout>
  );
};

export default StudentsPage;
