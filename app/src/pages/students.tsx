import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import { ItemSummaries } from "@/components/summaries/ItemSummaries";
import { Student } from "@/shared/types";
import { StudentItemRenderer } from "@/components/summaries/ItemSummary";

const HomePage: NextPage = () => {
  return (
    <Container>
      <p className="pt-5 text-center font-bold text-4xl pb-5">STUDENTS</p>
      <ItemSummaries<Student>
        tableName="students"
        columnNames={["Name & Family Name", "DOB", "Email", "Delete"]}
        itemRenderer={(props) => (
          <StudentItemRenderer {...props} />
        )}
      />
    </Container>
  );
};

export default HomePage;
