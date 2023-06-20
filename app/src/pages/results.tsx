import type { NextPage } from "next";
import React from "react";

import Container from "@/components/shared/Container";
import { ResultItemSummaries } from "@/components/summaries/ItemSummaries";

const HomePage: NextPage = () => {
  return (
    <Container>
      <p className="pt-5 text-center font-bold text-4xl pb-5">RESULTS</p>
      <ResultItemSummaries />
    </Container>
  );
};

export default HomePage;
