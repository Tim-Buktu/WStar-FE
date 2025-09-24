import React, { useState, useEffect, useRef } from "react";
import {
  Scale,
  Globe,
  TrendingUp,
  Lightbulb,
  Briefcase,
  Users,
  DollarSign,
  Heart,
  Palette,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { getCMSData, type AvailableTag } from "../utils/cms";

const categoryIconMap = {
  "POLICY & REGULATIONS": Scale,
  "INTERNATIONAL RELATIONS": Globe,
  "GLOBAL ECONOMY": TrendingUp,
  TECHNOLOGY: Lightbulb,
  CORPORATE: Briefcase,
  CAREER: Users,
  FINANCIAL: DollarSign,
  LIFESTYLE: Heart,
  INNOVATION: Lightbulb,
  CULTURAL: Palette,
};

const categoryDescriptions = {
  "POLICY & REGULATIONS":
    "Navigate regulatory changes and policy shifts that shape business landscapes.",
  "INTERNATIONAL RELATIONS":
    "Global diplomatic insights affecting trade and regional partnerships.",
  "GLOBAL ECONOMY":
    "Economic trends, market movements, and financial indicators worldwide.",
  TECHNOLOGY:
    "Innovation breakthroughs, digital transformation, and emerging tech trends.",
  CORPORATE:
    "Business strategy, leadership insights, and corporate governance developments.",
  CAREER:
    "Professional growth, workplace evolution, and career advancement strategies.",
  FINANCIAL:
    "Investment analysis, market intelligence, and financial sector updates.",
  LIFESTYLE: "Work-life balance trends and consumer behavior insights.",
  INNOVATION:
    "Breakthrough research, disruptive technologies, and future-forward thinking.",
  CULTURAL: "Social trends, cultural shifts, and their business implications.",
};

export function Topics() {
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // HOOK 1: Fetch tags on component mount with enhanced CMS connectivity
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await getCMSData("availableTags");
        if (
          Array.isArray(tagsData) &&
          tagsData.length > 0 &&
          "name" in tagsData[0]
        ) {
          setAvailableTags(tagsData as AvailableTag[]);
        } else {
          setAvailableTags([]);
        }
      } catch (error) {
        console.error("Error loading tags:", error);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadTags();

    // Enhanced CMS update listeners
    const handleCMSUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Topics received CMS update:", customEvent.detail);
      if (customEvent.detail.section === "availableTags") {
        setTimeout(loadTags, 50);
      }
    };

    const handleTagsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Tags-specific update:", customEvent.detail);
      setTimeout(loadTags, 25);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "cmsDataUpdated",
        handleCMSUpdate as EventListener
      );
      window.addEventListener(
        "cmsavailableTagsUpdated",
        handleTagsUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "cmsDataUpdated",
          handleCMSUpdate as EventListener
        );
        window.removeEventListener(
          "cmsavailableTagsUpdated",
          handleTagsUpdate as EventListener
        );
      };
    }
  }, []);

  // HOOK 2: Handle scrolling when currentIndex changes
  useEffect(() => {
    if (scrollRef.current && availableTags.length > 0) {
      const cardWidth = 320;
      const scrollLeft = currentIndex * cardWidth;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [currentIndex, availableTags.length]);

  // Conditional rendering AFTER all hooks have been called
  if (loading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Topics We Cover
            </h2>
            <p className="text-gray-600">Loading topics...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!availableTags || availableTags.length === 0) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Topics We Cover
            </h2>
            <p className="text-gray-600">No topics available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  const cardWidth = 320; // Approximate width of each card including gap
  const visibleCards = Math.min(3, availableTags.length);
  const maxIndex = Math.max(0, availableTags.length - visibleCards);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = 320;
      const scrollLeft = index * cardWidth;
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  // Map tag names to categories for icons and descriptions
  const getTopicInfo = (tagName: string) => {
    const upperName = tagName.toUpperCase();
    // Try to match with category keys or use default
    const categoryKey =
      Object.keys(categoryDescriptions).find(
        (key) =>
          key.includes(upperName) || upperName.includes(key.split(" ")[0])
      ) || "TECHNOLOGY";

    return {
      icon:
        categoryIconMap[categoryKey as keyof typeof categoryIconMap] ||
        Lightbulb,
      description:
        categoryDescriptions[
          categoryKey as keyof typeof categoryDescriptions
        ] || "Explore insights and analysis in this topic area.",
    };
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-blue-100 border border-indigo-200/50 text-indigo-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <Globe className="w-4 h-4" />
            <span>Comprehensive Coverage</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Topics We Cover
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stay informed across the most critical areas shaping business and
            society today
          </p>
        </div>

        {/* Topics Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-6">
            <button
              onClick={() => scroll("left")}
              disabled={currentIndex === 0}
              className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-6">
            <button
              onClick={() => scroll("right")}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
              }}
            >
              {availableTags.map((tag, index) => {
                const topicInfo = getTopicInfo(tag.name);
                const IconComponent = topicInfo.icon;

                return (
                  <div key={tag.name} className="flex-none w-80 snap-start">
                    <div className="bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-full">
                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-slate-900 mb-4">
                        {tag.name}
                      </h3>
                      <p className="text-slate-600 mb-6 leading-relaxed">
                        {topicInfo.description}
                      </p>

                      {/* CTA */}
                      <button className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200">
                        <span>Explore Articles</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {availableTags.length > visibleCards &&
              Array.from({
                length: Math.max(1, availableTags.length - visibleCards + 1),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-indigo-600 w-8"
                      : "bg-slate-300 w-2 hover:bg-slate-400"
                  }`}
                />
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Topics;
