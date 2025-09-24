import React from "react";
import { WIPPage } from "../components/WIPPage";

export const meta = () => [
  { title: "Research | Western Star" },
  {
    name: "description",
    content:
      "In-depth research and analysis on key market trends and policy developments.",
  },
];

export default function Research() {
  return (
    <WIPPage
      title="Research & Analysis"
      description="Our comprehensive research hub featuring in-depth analysis, market insights, and strategic assessments."
      progress={40}
    />
  );
}
