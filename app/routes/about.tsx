import React from "react";
import { WIPPage } from "../components/WIPPage";

export const meta = () => [
  { title: "About Us | Western Star" },
  {
    name: "description",
    content: "Learn more about Western Star - our mission, vision, and team.",
  },
];

export default function About() {
  return (
    <WIPPage
      title="About Us"
      description="Learn more about our mission, vision, and the team behind Western Star."
      progress={25}
    />
  );
}
