import React, { useState, useEffect } from "react";
import { Mail, Search, Menu, X, Tag } from "lucide-react";

// Western Star logo
const logo = "/western-star-logo.png";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setShowSearch(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const navItems = [
    { id: 1, label: "Research", href: "/research", isVisible: true },
    { id: 2, label: "News", href: "/news", isVisible: true },
    { id: 3, label: "Newsletter", href: "/newsroom", isVisible: true },
  ].filter((i: any) => i.isVisible !== false);

  const activeTopics = [
    {
      id: 1,
      title: "Technology",
      description: "Latest tech trends",
      isActive: true,
    },
    {
      id: 2,
      title: "AI & ML",
      description: "Artificial intelligence updates",
      isActive: true,
    },
    {
      id: 3,
      title: "Policy",
      description: "Government and policy news",
      isActive: true,
    },
  ].filter((t: any) => t.isActive);

  const navigateTo = (href: string) => {
    window.location.href = href;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-brand-gray/30 bg-white/95 backdrop-blur-lg shadow-lg"
          : "border-b border-brand-gray/20 bg-white/90 backdrop-blur-sm shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          className={`flex items-center justify-between gap-4 transition-all duration-300 ${
            scrolled ? "h-14" : "h-16"
          }`}
        >
          {/* Left: Brand */}
          <button
            onClick={() => navigateTo("/")}
            className="flex items-center gap-3 shrink-0 group"
          >
            <div className="relative">
              <img
                src={logo}
                alt="Western Star logo"
                className={`rounded-lg object-cover ring-2 ring-brand-gray/30 group-hover:ring-brand-teal/50 transition-all duration-300 transform group-hover:scale-110 ${
                  scrolled ? "w-7 h-7" : "w-8 h-8"
                }`}
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-teal/20 to-brand-coral/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span
              className={`font-bold tracking-tight text-brand-navy group-hover:text-brand-teal transition-all duration-300 ${
                scrolled ? "text-lg" : "text-lg sm:text-xl"
              }`}
            >
              Western Star
            </span>
          </button>

          {/* Center: Nav (desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-brand-navy/70">
            {navItems.map((it: any, index: number) => (
              <button
                key={it.id ?? it.label}
                onClick={() => navigateTo(it.href)}
                className="relative py-2 hover:text-brand-teal transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {it.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-brand-teal to-brand-coral scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <div className="absolute inset-0 rounded-lg bg-brand-teal/5 scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></div>
              </button>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Search trigger (desktop) */}
            <button
              aria-label="Search"
              className={`hidden md:inline-flex items-center justify-center rounded-full border transition-all duration-300 transform hover:scale-110 group ${
                showSearch
                  ? "w-10 h-10 border-brand-teal bg-brand-teal text-white shadow-lg"
                  : "w-10 h-10 border-brand-gray/30 bg-brand-gray/50 text-brand-navy/70 hover:text-brand-teal hover:bg-white hover:border-brand-teal/30 hover:shadow-md"
              }`}
              onClick={() => setShowSearch((v) => !v)}
            >
              <Search
                className={`transition-all duration-300 ${showSearch ? "w-4 h-4 rotate-90" : "w-4 h-4"}`}
              />
            </button>

            {/* Newsroom Button */}
            <button
              onClick={() => navigateTo("/newsroom")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white border-2 border-brand-navy/20 px-5 py-2.5 text-sm font-semibold text-brand-navy hover:border-brand-teal hover:text-brand-teal hover:shadow-md transform hover:scale-105 transition-all duration-300 group"
            >
              <svg
                className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              Newsroom
            </button>

            {/* Subscribe */}
            <a
              href="https://westernstar.beehiiv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-coral px-6 py-2.5 text-sm font-semibold text-white hover:from-brand-teal hover:to-brand-orange hover:shadow-lg transform hover:scale-105 transition-all duration-300 group"
            >
              <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              Subscribe
            </a>

            {/* Mobile controls */}
            <button
              className={`md:hidden inline-flex items-center justify-center rounded-lg p-2.5 transition-all duration-300 transform hover:scale-110 ${
                mobileOpen
                  ? "text-brand-coral bg-brand-coral/10 border border-brand-coral/20"
                  : "text-brand-navy/70 hover:text-brand-teal hover:bg-brand-teal/10"
              }`}
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${mobileOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
                />
                <X
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary sections row (desktop) */}
      {activeTopics.length > 0 && (
        <div
          className={`hidden lg:block border-t transition-all duration-300 ${
            scrolled
              ? "border-brand-gray/20 bg-gradient-to-r from-brand-gray/30 to-white/50"
              : "border-brand-gray/10 bg-gradient-to-r from-brand-gray/20 to-white/30"
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div
              className={`flex items-center gap-4 overflow-x-auto transition-all duration-300 ${
                scrolled ? "py-2" : "py-3"
              }`}
            >
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-navy/60 shrink-0">
                <Tag className="w-4 h-4 text-brand-teal" /> Topics
              </span>
              <div className="flex items-center gap-2">
                {activeTopics.map((t: any, index: number) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      document
                        .getElementById("topics")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-4 py-2 rounded-full border border-brand-gray/30 bg-white/80 backdrop-blur-sm text-xs font-semibold text-brand-navy/70 hover:bg-brand-teal hover:border-brand-teal hover:text-white hover:shadow-lg transition-all duration-300 whitespace-nowrap transform hover:scale-105 group"
                    title={t.description}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="group-hover:animate-pulse">{t.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search dropdown (desktop) */}
      <div
        className={`absolute inset-x-0 top-full border-b border-white/20 bg-gradient-to-br from-white/95 via-white/90 to-brand-gray/5 backdrop-blur-2xl shadow-2xl transition-all duration-700 ease-out ${
          showSearch
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-8 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20 pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="relative group">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-teal/20 to-brand-orange/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>

            <div className="relative flex items-center gap-4 rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl px-8 py-6 shadow-2xl transition-all duration-300 group-focus-within:border-brand-teal/50 group-focus-within:shadow-3xl group-focus-within:bg-white/80">
              <Search className="w-7 h-7 text-brand-teal transition-all duration-300 group-focus-within:scale-110 group-focus-within:rotate-12" />
              <input
                autoFocus
                type="text"
                placeholder="Search newsletters, insights, companies, and trends..."
                className="bg-transparent text-xl outline-none placeholder:text-brand-navy/40 text-brand-navy flex-1 font-medium"
              />
              <div className="flex items-center gap-3">
                <kbd className="px-3 py-1.5 text-xs font-semibold text-brand-navy/50 bg-white/60 border border-white/40 backdrop-blur-sm rounded-lg shadow-sm">
                  ⌘K
                </kbd>
                <button
                  className="text-sm font-semibold text-brand-navy/60 hover:text-brand-teal px-6 py-2.5 rounded-full hover:bg-white/80 transition-all duration-300 transform hover:scale-105 border border-white/40 hover:border-brand-teal/40 backdrop-blur-sm"
                  onClick={() => setShowSearch(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-navy/60 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-brand-teal"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Popular Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Technology",
                  "Policy & Gov",
                  "Business",
                  "Global Markets",
                  "Innovation",
                  "AI & ML",
                ].map((topic) => (
                  <button
                    key={topic}
                    className="px-4 py-2 text-sm font-medium bg-white/60 backdrop-blur-sm text-brand-navy border border-white/40 rounded-full hover:bg-gradient-to-r hover:from-brand-teal hover:to-brand-orange hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-navy/60 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-brand-orange"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() => navigateTo("/newsroom")}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 group border border-white/30 hover:border-white/50 w-full text-left shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-teal to-brand-orange flex items-center justify-center shadow-md">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                      View Newsroom
                    </div>
                    <div className="text-xs text-brand-navy/50">
                      Browse all newsletters
                    </div>
                  </div>
                </button>
                <a
                  href="https://westernstar.beehiiv.com/"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/60 backdrop-blur-sm transition-all duration-300 group border border-white/30 hover:border-white/50 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-orange to-brand-coral flex items-center justify-center shadow-md">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-brand-navy group-hover:text-brand-teal transition-colors">
                      Subscribe
                    </div>
                    <div className="text-xs text-brand-navy/50">
                      Get weekly insights
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-brand-navy/60 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-brand-coral"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recent Searches
              </h4>
              <div className="space-y-1">
                {[
                  "Western Star Newsletter",
                  "Tech Policy Updates",
                  "Market Analysis",
                  "Global Trends",
                ].map((search) => (
                  <button
                    key={search}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-all duration-200 text-brand-navy/70 hover:text-brand-teal text-sm border border-transparent hover:border-white/40 shadow-sm hover:shadow-md"
                  >
                    <svg
                      className="w-3 h-3 opacity-60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        className={`lg:hidden border-t border-brand-gray/20 bg-white/95 backdrop-blur-lg shadow-xl transition-all duration-500 ${
          mobileOpen
            ? "opacity-100 max-h-screen pointer-events-auto"
            : "opacity-0 max-h-0 pointer-events-none overflow-hidden"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-teal/10 to-brand-orange/10 blur-lg opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>

            <div className="relative flex items-center gap-4 rounded-2xl border border-white/50 bg-white/80 backdrop-blur-xl px-5 py-4 shadow-xl transition-all duration-300 group-focus-within:border-brand-teal/50 group-focus-within:shadow-2xl group-focus-within:bg-white/90">
              <Search className="w-6 h-6 text-brand-teal transition-all duration-300 group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="Search newsletters and insights..."
                className="bg-transparent text-lg outline-none placeholder:text-brand-navy/40 text-brand-navy flex-1 font-medium"
              />
              <div className="flex items-center">
                <kbd className="px-2 py-1 text-xs font-semibold text-brand-navy/50 bg-white/70 border border-white/50 backdrop-blur-sm rounded shadow-sm">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {navItems.map((it: any, index: number) => (
              <button
                key={it.id ?? it.label}
                onClick={() => {
                  navigateTo(it.href);
                  setMobileOpen(false);
                }}
                className="flex items-center w-full px-4 py-4 rounded-xl text-base font-semibold text-brand-navy hover:text-brand-teal hover:bg-brand-teal/5 transition-all duration-300 transform hover:scale-105 group text-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="group-hover:translate-x-2 transition-transform duration-300">
                  {it.label}
                </span>
              </button>
            ))}

            <button
              onClick={() => {
                navigateTo("/newsroom");
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-semibold text-brand-navy border-2 border-brand-navy/20 hover:border-brand-teal hover:text-brand-teal hover:bg-brand-teal/5 transition-all duration-300 transform hover:scale-105 group text-left"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Newsroom
              </span>
            </button>

            <a
              href="https://westernstar.beehiiv.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-brand-orange to-brand-coral hover:from-brand-teal hover:to-brand-orange transition-all duration-300 transform hover:scale-105 group"
              onClick={() => setMobileOpen(false)}
            >
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span className="group-hover:translate-x-1 transition-transform duration-300">
                Subscribe
              </span>
            </a>
          </div>

          {activeTopics.length > 0 && (
            <div className="pt-4 border-t border-brand-gray/20">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-navy/60 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-teal" />
                Topics
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTopics.map((t: any, index: number) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      document
                        .getElementById("topics")
                        ?.scrollIntoView({ behavior: "smooth" });
                      setMobileOpen(false);
                    }}
                    className="px-4 py-2 rounded-full border border-brand-gray/30 bg-white/80 backdrop-blur-sm text-sm font-semibold text-brand-navy hover:bg-brand-teal hover:border-brand-teal hover:text-white transition-all duration-300 transform hover:scale-105"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
