import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import { ResultItemSummaries } from "@/components/summaries/ItemSummaries";
import PageLayout from "@/components/shared/PageLayout";

const ResultsPage: NextPage = () => {
  return (
    <PageLayout>
      <p className="pt-5 text-center font-bold text-4xl pb-5">Results</p>
      <ResultItemSummaries />
    </PageLayout>
  );
};

export default ResultsPage;
