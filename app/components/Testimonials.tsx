import React, { useState, useEffect, useRef } from "react";
import { Heart, Users, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { getCMSData, type TestimonialData } from "../utils/cms";

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    card: 384, // fallback card width
    gap: 32, // fallback gap (Tailwind gap-8)
    container: 0,
    visible: 1,
    max: 0,
  });

  useEffect(() => {
    // Load testimonials data async
    const loadTestimonials = async () => {
      try {
        const data = await getCMSData("testimonials");
        const testimonialsArray = Array.isArray(data)
          ? (data as TestimonialData[])
          : [];
        setTestimonials(testimonialsArray);
      } catch (error) {
        console.error("Error loading testimonials:", error);
        setTestimonials([]);
      }
    };

    loadTestimonials();

    // Enhanced CMS update listeners
    const handleCMSUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Testimonials received CMS update:", customEvent.detail);
      if (customEvent.detail.section === "testimonials") {
        setTimeout(loadTestimonials, 50);
      }
    };

    const handleTestimonialUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Testimonial-specific update:", customEvent.detail);
      setTimeout(loadTestimonials, 25);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "cmsDataUpdated",
        handleCMSUpdate as EventListener
      );
      window.addEventListener(
        "cmstestimonialsUpdated",
        handleTestimonialUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "cmsDataUpdated",
          handleCMSUpdate as EventListener
        );
        window.removeEventListener(
          "cmstestimonialsUpdated",
          handleTestimonialUpdate as EventListener
        );
      };
    }
  }, []);

  // Calculate derived values
  const quotes = testimonials.filter((item) => item.isActive);
  const visibleCards = metrics.visible;
  const maxIndex = Math.max(0, quotes.length - visibleCards);

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const scrollLeft = index * (metrics.card + metrics.gap);
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    if (quotes.length > 0) {
      scrollToIndex(currentIndex);
    }
  }, [currentIndex, quotes.length]);

  // Measure card width, gap and container to avoid cropping and compute visible cards
  useEffect(() => {
    const measure = () => {
      if (!scrollRef.current) return;
      const el = scrollRef.current;
      const style = getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap) || 0;
      // Find first card element
      const cardEl = el.querySelector('[data-t-card="true"]') as HTMLElement | null;
      const card = cardEl?.offsetWidth ?? 384;
      const container = el.offsetWidth;
      const visible = Math.max(1, Math.floor((container + gap) / (card + gap)));
      const max = Math.max(0, quotes.length - visible);
      setMetrics({ card, gap, container, visible, max });
      // Clamp current index if overflow
      if (currentIndex > max) {
        setCurrentIndex(max);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [quotes.length]);

  // Early returns AFTER all hooks
  if (testimonials.length === 0) {
    return (
      <section
        id="testimonials"
        className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-cyan-50/30"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Testimonials
            </h2>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (quotes.length === 0) {
    return (
      <section
        id="testimonials"
        className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50/50"
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Testimonials
            </h2>
            <p className="text-gray-600">
              No testimonials available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50/50"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-full blur-3xl"></div>

        {/* Decorative lines */}
        <div className="absolute top-48 left-1/4 w-1 h-16 bg-gradient-to-b from-indigo-200/40 to-transparent"></div>
        <div className="absolute bottom-48 right-1/3 w-1 h-12 bg-gradient-to-b from-violet-200/40 to-transparent"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-32">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-slate-100 to-indigo-50 border border-slate-200/50 text-slate-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <Heart className="w-4 h-4 text-indigo-600" />
            <span>Client Success Stories</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Trusted by Industry Leaders
          </h2>
          <p className="mx-auto max-w-3xl text-base text-slate-600 leading-relaxed">
            Join thousands of professionals who rely on our insights for
            strategic decision-making and competitive advantage
          </p>
        </div>

  {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scroll("left")}
              disabled={currentIndex === 0}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          <div className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => scroll("right")}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur border border-slate-200 rounded-xl flex items-center justify-center hover:border-slate-300 hover:shadow-md transform hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Testimonials Container */}
          <div className="overflow-visible">
            <div
              ref={scrollRef}
              className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6 px-6 md:px-8"
              style={{
                scrollSnapType: "x mandatory",
                scrollBehavior: "smooth",
                scrollPaddingLeft: "2rem",
                scrollPaddingRight: "2rem",
              }}
            >
              {quotes.map((testimonial) => (
                <div
                  key={testimonial.id}
                  data-t-card="true"
                  className="flex-none w-[88%] sm:w-80 md:w-96 snap-start"
                >
                  <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500 h-full relative flex flex-col min-h-[22rem]">
                    {/* Quote Icon */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                      <Quote className="w-4 h-4 text-white" />
                    </div>

                    {/* Quote Text */}
                    <blockquote className="text-[15px] md:text-base text-slate-700 mb-6 leading-relaxed flex-1 pt-6 pl-12 md:pl-14">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center overflow-hidden">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Users className="w-6 h-6 text-slate-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">
                          {testimonial.author}
                        </div>
                        <div className="text-slate-500 text-xs">
                          {testimonial.role}
                          {testimonial.company && (
                            <span className="text-slate-500">
                              {" "}
                              at {testimonial.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-10 md:mt-12">
            {quotes.length > visibleCards &&
              Array.from({
                length: Math.max(1, quotes.length - visibleCards + 1),
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

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200/50 rounded-3xl p-12 max-w-3xl mx-auto shadow-xl flex flex-col items-center">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-md">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div className="text-left">
                <div className="text-4xl font-bold text-gray-900 leading-none mb-1">
                  10,000+
                </div>
                <div className="text-gray-600 font-medium text-sm tracking-wide uppercase">
                  Trusted Professionals
                </div>
              </div>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 tracking-tight max-w-xl">
              Join Our Community of Decision Makers
            </h3>
            <p className="text-gray-600 mb-10 leading-relaxed max-w-xl">
              Connect with industry leaders who rely on our insights for
              strategic advantage.
            </p>
            <a
              href="https://westernstar.beehiiv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-700 text-white px-10 py-4 rounded-2xl font-semibold hover:from-indigo-700 hover:to-cyan-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Join the Community
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
