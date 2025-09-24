import React from "react";
import { WIPPage } from "../components/WIPPage";

export const meta = () => [
  { title: "Services | Western Star" },
  {
    name: "description",
    content: "Explore our comprehensive services and solutions.",
  },
];

export default function Services() {
  return (
    <WIPPage
      title="Our Services"
      description="Discover the comprehensive services and solutions we offer to help you navigate the complex landscape."
      progress={30}
    />
  );
}
