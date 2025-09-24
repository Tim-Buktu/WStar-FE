import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
} from "lucide-react";
import { Link } from "react-router";
import { getCMSData, type Newsletter } from "../utils/cms";

export function NewsletterArchive() {
  const [newslettersData, setNewslettersData] = useState<{
    items: Newsletter[];
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNewsletters = async () => {
      try {
        const data = await getCMSData("newsletters");
        if (data && typeof data === "object" && "items" in data) {
          setNewslettersData(data as { items: Newsletter[] });
        } else {
          setNewslettersData({ items: [] });
        }
      } catch (error) {
        console.error("Error loading newsletters:", error);
        setNewslettersData({ items: [] });
      }
    };

    loadNewsletters();

    // Listen for CMS updates
    const handleCMSUpdate = () => {
      loadNewsletters();
    };

    window.addEventListener("cmsDataUpdated", handleCMSUpdate);

    return () => {
      window.removeEventListener("cmsDataUpdated", handleCMSUpdate);
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  // Filter newsletters to show only past 10 days (or all if less than 10)
  const getRecentNewsletters = () => {
    if (!newslettersData?.items) return [];

    const now = new Date();
    const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

    return newslettersData.items
      .filter((newsletter) => new Date(newsletter.date) >= tenDaysAgo)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6); // Show maximum 6 recent newsletters
  };

  const recentNewsletters = getRecentNewsletters();

  // Auto-play functionality
  useEffect(() => {
    if (recentNewsletters.length > 1) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % recentNewsletters.length);
      }, 5000);

      return () => {
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      };
    }
  }, [recentNewsletters.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recentNewsletters.length);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + recentNewsletters.length) % recentNewsletters.length
    );
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatDateShort = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (!recentNewsletters.length) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Newsletters
            </h2>
            <p className="text-gray-600">No recent newsletters available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200/50 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <Calendar className="w-4 h-4" />
            <span>Latest Updates</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Recent Newsletters
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated with our latest insights and analysis
          </p>
        </div>

        {/* Featured Newsletter Carousel */}
        <div className="relative mb-16">
          <div className="relative bg-white/85 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-xl">
            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-slate-200 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 border border-slate-200 rounded-full flex items-center justify-center hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>

            {/* Carousel Content */}
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {recentNewsletters.map((newsletter) => (
                <div key={newsletter.id} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:h-[30rem] group">
                    {/* Image */}
                    <div className="relative h-64 lg:h-full bg-slate-200">
                      {newsletter.image ? (
                        <img
                          src={
                            typeof newsletter.image === "string"
                              ? newsletter.image
                              : newsletter.image.url
                          }
                          alt={newsletter.title}
                          className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-slate-400" />
                        </div>
                      )}
                      {/* Gradient & Category */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
                      {newsletter.category && (
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-black/40 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/20">
                            {newsletter.category}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="relative h-full flex">
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-white/95 to-white/90" />
                      <div className="relative z-10 w-full flex flex-col justify-center px-8 lg:px-12 py-10 lg:py-0">
                        <div className="max-w-xl">
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(newsletter.date)}
                            </span>
                            {newsletter.views && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {newsletter.views.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <h3 className="text-2xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                            {newsletter.title}
                          </h3>

                          <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3 lg:line-clamp-4">
                            {newsletter.summary ||
                              "Explore the latest insights and analysis..."}
                          </p>

                          <Link
                            to={`/newsletter/${newsletter.id}`}
                            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl w-fit"
                          >
                            <span>Read Full Newsletter</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {recentNewsletters.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-indigo-600 w-8"
                    : "bg-slate-300 w-2 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Newsletter Grid */}
        {recentNewsletters.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentNewsletters.slice(1, 4).map((newsletter, index) => (
              <Link
                key={newsletter.id}
                to={`/newsletter/${newsletter.id}`}
                className="group bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                  {newsletter.image ? (
                    <img
                      src={
                        typeof newsletter.image === "string"
                          ? newsletter.image
                          : newsletter.image.url
                      }
                      alt={newsletter.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-slate-400" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {formatDateShort(newsletter.date)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {newsletter.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {newsletter.summary || "Explore the latest insights..."}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View More */}
        <div className="text-center mt-12">
          <Link
            to="/newsroom"
            className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span>View All Newsletters</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NewsletterArchive;
