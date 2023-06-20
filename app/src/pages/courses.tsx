import type { NextPage } from "next";
import React from "react";

import { ItemSummaries } from "@/components/summaries/ItemSummaries";
import { Course } from "@/shared/types";
import { CourseItemRenderer } from "@/components/summaries/ItemSummary";
import PageLayout from "@/components/shared/PageLayout";

const CoursesPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Courses</p>
      <ItemSummaries<Course>
        tableName="courses"
        columnNames={["Course Name", "Delete"]}
        itemRenderer={(props) => (
          <CourseItemRenderer {...props} />
        )}
      />
    </PageLayout>
  );
};

export default CoursesPage;
