import React from "react";
import { WIPPage } from "../components/WIPPage";

export const meta = () => [
  { title: "Contact Us | Western Star" },
  {
    name: "description",
    content: "Get in touch with the Western Star team.",
  },
];

export default function Contact() {
  return (
    <WIPPage
      title="Contact Us"
      description="We'd love to hear from you! Our contact page is being crafted to make it easy to reach our team."
      progress={10}
    />
  );
}
