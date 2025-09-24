import React from "react";
import type { Route } from "./+types/home";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import Hero from "../components/Hero";
import Topics from "../components/Topics";
import ContentPreview from "../components/ContentPreview";
import NewsletterArchive from "../components/NewsletterArchive";
import Testimonials from "../components/Testimonials";
import Subscribe from "../components/Subscribe";
import ErrorBoundary from "../components/ErrorBoundary";
import CMSAdmin from "../components/CMSAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Western Star | Strategic Intelligence for Decision Makers" },
    {
      name: "description",
      content:
        "Navigate tomorrow's markets today with our comprehensive analysis, expert insights, and strategic intelligence designed for leaders who shape the future.",
    },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Banner */}
      <div className="w-full bg-red-600 text-xs text-white tracking-wide py-2 text-center">
        Indonesia. Tech. Business. Policy. Investment. Global Signals.
      </div>

      <Navbar />
      <Hero />

      <ErrorBoundary>
        <ContentPreview />
      </ErrorBoundary>

      <NewsletterArchive />
      <Topics />
      <Testimonials />
      <Subscribe />
      <Footer />

      {/* CMS Admin - only shows when accessed */}
      <CMSAdmin />
    </div>
  );
}
