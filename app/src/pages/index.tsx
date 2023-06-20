import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import { ItemSummaries, ResultItemSummaries } from "@/components/summaries/ItemSummaries";
import { Course, Student } from "@/shared/types";
import { CourseItemRenderer, StudentItemRenderer } from "@/components/summaries/ItemSummary";

const HomePage: NextPage = () => {
  return (
    <Container>
      <p className="pt-5">STUDENTS</p>
      <ItemSummaries<Student>
        tableName="students"
        itemRenderer={(props) => (
          <StudentItemRenderer {...props} />
        )}
      />

      <p className="pt-5">COURSES</p>
      <ItemSummaries<Course>
        tableName="courses"
        itemRenderer={(props) => (
          <CourseItemRenderer {...props} />
        )}
      />

      <p className="pt-5">RESULTS</p>
      <ResultItemSummaries />
    </Container>
  );
};

export default HomePage;
