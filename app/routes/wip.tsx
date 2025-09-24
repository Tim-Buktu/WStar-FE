import React from "react";
import { useSearchParams } from "react-router";
import { WIPPage } from "../components/WIPPage";

export const meta = () => [
  { title: "Coming Soon | Western Star" },
  {
    name: "description",
    content: "This page is currently under development.",
  },
];

export default function WIP() {
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || "Page Under Construction";
  const description =
    searchParams.get("description") ||
    "This section is currently being developed.";
  const progress = parseInt(searchParams.get("progress") || "15", 10);

  return (
    <WIPPage title={title} description={description} progress={progress} />
  );
}
