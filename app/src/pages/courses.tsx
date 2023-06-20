import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import { ItemSummaries } from "@/components/summaries/ItemSummaries";
import { Course } from "@/shared/types";
import { CourseItemRenderer } from "@/components/summaries/ItemSummary";

const HomePage: NextPage = () => {
  return (
    <Container>
      <p className="pt-5 text-center font-bold text-4xl pb-5">COURSES</p>
      <ItemSummaries<Course>
        tableName="courses"
        columnNames={["Course Name", "DOB", "Email", "Delete"]}
        itemRenderer={(props) => (
          <CourseItemRenderer {...props} />
        )}
      />
    </Container>
  );
};

export default HomePage;
