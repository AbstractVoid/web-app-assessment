import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import PageLayout from "@/components/shared/PageLayout";
import { ItemSummaries, ResultItemSummaries } from "@/components/summaries/ItemSummaries";
import { Course, Student } from "@/shared/types";
import { CourseItemRenderer, StudentItemRenderer } from "@/components/summaries/ItemSummary";

const HomePage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Home Page</p>
    </PageLayout>
  );
};

export default HomePage;
