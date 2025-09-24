import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  TrendingUp,
  Zap,
  Globe,
  BookOpen,
  Users,
  Briefcase,
  Lightbulb,
  Heart,
  Tag,
  Eye,
  ExternalLink,
  Mail,
} from "lucide-react";
import { getCMSData, type Newsletter, type AvailableTag } from "../utils/cms";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const meta = () => [
  { title: "Newsletter | Western Star" },
  {
    name: "description",
    content:
      "Stay informed with our comprehensive newsletter covering market insights, policy updates, and strategic analysis.",
  },
];

export default function NewsroomPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"mosaic" | "grid" | "list">(
    "mosaic"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [newsletterData, setNewsletterData] = useState<{ items: Newsletter[] }>(
    { items: [] }
  );
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);

  // Refresh data from CMS - focusing on newsletter content
  const refreshData = async () => {
    try {
      const [newsletters, tags] = await Promise.all([
        getCMSData("newsletters"), // Different endpoint for newsletters
        getCMSData("availableTags"),
      ]);
      setNewsletterData(
        (newsletters as { items: Newsletter[] }) || { items: [] }
      );
      setAvailableTags(Array.isArray(tags) ? (tags as AvailableTag[]) : []);
    } catch (error) {
      console.error("Failed to load newsletter data:", error);
      setNewsletterData({ items: [] });
      setAvailableTags([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Category icons mapping for newsletters
  const categoryIcons = {
    "MARKET INSIGHTS": TrendingUp,
    "POLICY UPDATES": BookOpen,
    "STRATEGIC ANALYSIS": Briefcase,
    "INDUSTRY TRENDS": Zap,
    "GLOBAL OUTLOOK": Globe,
    "REGULATORY CHANGES": Users,
    "INVESTMENT FOCUS": Lightbulb,
    "ECONOMIC INDICATORS": TrendingUp,
    "CORPORATE DEVELOPMENTS": Briefcase,
    TECHNOLOGY: Zap,
  };

  // Filter newsletters
  const filteredNewsletters = useMemo(() => {
    let filtered = newsletterData.items || [];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary?.toLowerCase().includes(query) ||
          item.category?.toLowerCase().includes(query) ||
          (item.tags || []).some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category || "")
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((item) =>
        (item.tags || []).some((tag) => selectedTags.includes(tag))
      );
    }

    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [newsletterData.items, searchQuery, selectedCategories, selectedTags]);

  // Get unique categories
  const availableCategories = [
    ...new Set(
      (newsletterData.items || []).map((item) => item.category).filter(Boolean)
    ),
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTagColor = (tagName: string) => {
    const tag = availableTags.find((t) => t.name === tagName);
    return tag?.color || "gray";
  };

  const tagColorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
    teal: "bg-teal-50 text-teal-700 border-teal-200",
    red: "bg-red-50 text-red-700 border-red-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedTags([]);
  };

  const hasActiveFilters =
    searchQuery || selectedCategories.length > 0 || selectedTags.length > 0;

  // Get newsletters from CMS showcase sections
  const featuredNewsletter = useMemo(() => {
    return (newsletterData.items || [])[0] || null;
  }, [newsletterData.items]);

  const mosaicNewsletters = useMemo(() => {
    return (newsletterData.items || []).slice(1, 7);
  }, [newsletterData.items]);

  const recentNewsletters = useMemo(() => {
    return (newsletterData.items || []).slice(7);
  }, [newsletterData.items]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-gray-800 to-black">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-brand-teal rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-brand-coral rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-orange rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 lg:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-brand-teal font-medium text-sm mb-6">
              <Mail className="w-4 h-4" />
              {(newsletterData.items || []).length} newsletters published
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Newsletter &
              <span className="block text-3xl sm:text-5xl bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-transparent">
                Insights
              </span>
            </h1>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
              Stay informed with our comprehensive newsletter covering market
              insights, policy updates, and strategic analysis. Get the
              intelligence that drives decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-[72px] z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search newsletters by title, content, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent bg-white/90 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
                showFilters || hasActiveFilters
                  ? "bg-brand-teal text-white border-brand-teal"
                  : "bg-white text-gray-700 border-gray-300 hover:border-brand-teal hover:text-brand-teal"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {[
                    searchQuery && 1,
                    selectedCategories.length,
                    selectedTags.length,
                  ]
                    .filter(Boolean)
                    .reduce((a, b) => (a as number) + (b as number), 0)}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("mosaic")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  viewMode === "mosaic"
                    ? "bg-brand-teal text-white shadow-sm"
                    : "text-gray-500 hover:text-brand-teal"
                }`}
              >
                Mosaic
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-brand-teal text-white shadow-sm"
                    : "text-gray-500 hover:text-brand-teal"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  viewMode === "list"
                    ? "bg-brand-teal text-white shadow-sm"
                    : "text-gray-500 hover:text-brand-teal"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}

            <div className="text-sm text-gray-500 ml-auto">
              {filteredNewsletters.length} newsletter
              {filteredNewsletters.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Categories */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => {
                      if (!category) return null;
                      const Icon =
                        categoryIcons[category as keyof typeof categoryIcons] ||
                        Tag;
                      return (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            selectedCategories.includes(category)
                              ? "bg-brand-teal text-white border-brand-teal"
                              : "bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-teal hover:text-brand-teal"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    Filter by Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.slice(0, 10).map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => toggleTag(tag.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                          selectedTags.includes(tag.name)
                            ? `${tagColorClasses[tag.color as keyof typeof tagColorClasses]} ring-2 ring-offset-1`
                            : `bg-gray-50 text-gray-600 border-gray-200 hover:${tagColorClasses[tag.color as keyof typeof tagColorClasses]}`
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50">
        {hasActiveFilters ? (
          // Search/Filter Results
          filteredNewsletters.length === 0 ? (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
              <div className="text-center">
                <Search className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  No newsletters found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search query or filters to find what you're
                  looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-xl hover:bg-brand-teal/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          ) : (
            // Display filtered results
            <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
              {viewMode === "grid" && (
                <NewsletterGridLayout
                  newsletters={filteredNewsletters}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}

              {viewMode === "list" && (
                <NewsletterListLayout
                  newsletters={filteredNewsletters}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}

              {viewMode === "mosaic" && (
                <NewsletterGridLayout
                  newsletters={filteredNewsletters}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}
            </section>
          )
        ) : // Default showcase layout
        !featuredNewsletter &&
          mosaicNewsletters.length === 0 &&
          recentNewsletters.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
            <div className="text-center">
              <Mail className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                No newsletters found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                No newsletters have been published yet. Check back soon for the
                latest insights!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Showcase Layout */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
              {viewMode === "mosaic" && (
                <NewsletterMosaicLayout
                  featuredNewsletter={featuredNewsletter}
                  newsletters={mosaicNewsletters}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}

              {viewMode === "grid" && (
                <NewsletterGridLayout
                  newsletters={[
                    ...(featuredNewsletter ? [featuredNewsletter] : []),
                    ...mosaicNewsletters,
                    ...recentNewsletters,
                  ]}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}

              {viewMode === "list" && (
                <NewsletterListLayout
                  newsletters={[
                    ...(featuredNewsletter ? [featuredNewsletter] : []),
                    ...mosaicNewsletters,
                    ...recentNewsletters,
                  ]}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
                  categoryIcons={categoryIcons}
                />
              )}
            </section>

            {/* Recent Newsletters Section */}
            {recentNewsletters.length > 0 && (
              <RecentNewslettersSection
                newsletters={recentNewsletters}
                formatDate={formatDate}
                getTagColor={getTagColor}
                tagColorClasses={tagColorClasses}
                categoryIcons={categoryIcons}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Layout Components for Newsletters
interface NewsletterLayoutProps {
  newsletters: Newsletter[];
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  categoryIcons: Record<string, React.ComponentType<any>>;
}

interface NewsletterMosaicLayoutProps extends NewsletterLayoutProps {
  featuredNewsletter: Newsletter | null;
}

// Newsletter Mosaic Layout
function NewsletterMosaicLayout({
  featuredNewsletter,
  newsletters,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterMosaicLayoutProps) {
  const handleClick = (newsletter: Newsletter) => {
    window.location.href = `/newsletter/${newsletter.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Featured Newsletter */}
      {featuredNewsletter && (
        <div className="mb-8">
          <FeaturedNewsletterCard
            newsletter={featuredNewsletter}
            onClick={() => handleClick(featuredNewsletter)}
            formatDate={formatDate}
            getTagColor={getTagColor}
            tagColorClasses={tagColorClasses}
            categoryIcons={categoryIcons}
          />
        </div>
      )}

      {/* Newsletter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map((newsletter, index) => (
          <NewsletterMosaicCard
            key={newsletter.id}
            newsletter={newsletter}
            formatDate={formatDate}
            getTagColor={getTagColor}
            tagColorClasses={tagColorClasses}
            categoryIcons={categoryIcons}
            onClick={() => handleClick(newsletter)}
          />
        ))}
      </div>
    </div>
  );
}

// Featured Newsletter Card
interface NewsletterCardProps {
  newsletter: Newsletter;
  onClick: () => void;
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  categoryIcons: Record<string, React.ComponentType<any>>;
}

function FeaturedNewsletterCard({
  newsletter,
  onClick,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterCardProps) {
  const Icon = categoryIcons[newsletter.category || ""] || Mail;

  return (
    <article
      className="group relative overflow-hidden rounded-3xl cursor-pointer h-[500px] lg:h-[600px] bg-gradient-to-br from-brand-navy to-gray-800"
      onClick={onClick}
    >
      {/* Background Image */}
      {newsletter.image && (
        <>
          <img
            src={
              typeof newsletter.image === "string"
                ? newsletter.image
                : newsletter.image.url
            }
            alt={
              typeof newsletter.image === "string"
                ? newsletter.title
                : newsletter.image.alt || newsletter.title
            }
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="p-8 lg:p-12 max-w-4xl">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-6">
            <Icon className="w-5 h-5 text-white" />
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/20">
              {newsletter.category}
            </span>
            <span className="text-white/80 text-sm">
              {newsletter.displayDate
                ? newsletter.displayDate
                : formatDate(newsletter.date)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight group-hover:text-brand-teal transition-colors duration-300">
            {newsletter.title}
          </h1>

          {/* Key Discussion or Summary */}
          <p className="text-xl lg:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl">
            {newsletter.keyDiscussion || newsletter.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center gap-6">
            <div className="flex items-center text-brand-teal font-semibold">
              <span>Read Newsletter</span>
              <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// Newsletter Mosaic Card
function NewsletterMosaicCard({
  newsletter,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
  onClick,
}: NewsletterCardProps) {
  const Icon = categoryIcons[newsletter.category || ""] || Mail;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl cursor-pointer h-[320px] bg-gradient-to-br from-brand-navy to-gray-800 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
      onClick={onClick}
    >
      {/* Background Image */}
      {newsletter.image && (
        <>
          <img
            src={
              typeof newsletter.image === "string"
                ? newsletter.image
                : newsletter.image.url
            }
            alt={
              typeof newsletter.image === "string"
                ? newsletter.title
                : newsletter.image.alt || newsletter.title
            }
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className="w-4 h-4 text-white" />
          <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
            {newsletter.category}
          </span>
          <span className="text-white/70 text-xs">
            {formatDate(newsletter.date).replace(/,.*/, "")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mb-2 leading-tight group-hover:text-brand-teal transition-colors line-clamp-2">
          {newsletter.title}
        </h3>

        {/* Key Discussion */}
        {newsletter.keyDiscussion && (
          <p className="text-white/80 text-sm line-clamp-2 mb-3">
            {newsletter.keyDiscussion}
          </p>
        )}
      </div>
    </article>
  );
}

// Newsletter Grid Layout
function NewsletterGridLayout({
  newsletters,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {newsletters.map((newsletter, index) => (
        <NewsletterGridCard
          key={newsletter.id}
          newsletter={newsletter}
          index={index}
          formatDate={formatDate}
          getTagColor={getTagColor}
          tagColorClasses={tagColorClasses}
          categoryIcons={categoryIcons}
        />
      ))}
    </div>
  );
}

interface NewsletterGridCardProps {
  newsletter: Newsletter;
  index: number;
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  categoryIcons: Record<string, React.ComponentType<any>>;
}

function NewsletterGridCard({
  newsletter,
  index,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterGridCardProps) {
  const Icon = categoryIcons[newsletter.category || ""] || Mail;

  const handleClick = () => {
    window.location.href = `/newsletter/${newsletter.id}`;
  };

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      {/* Image */}
      {newsletter.image && (
        <div className="relative overflow-hidden h-48">
          <img
            src={
              typeof newsletter.image === "string"
                ? newsletter.image
                : newsletter.image.url
            }
            alt={
              typeof newsletter.image === "string"
                ? newsletter.title
                : newsletter.image.alt || newsletter.title
            }
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-4 h-4 text-gray-500" />
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              tagColorClasses[getTagColor(newsletter.category || "")]
            }`}
          >
            {newsletter.category}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {formatDate(newsletter.date).replace(/,.*/, "")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
          {newsletter.title}
        </h3>

        {/* Key Discussion */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {newsletter.keyDiscussion || newsletter.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center text-sm font-medium text-brand-teal">
          Read Newsletter
          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </article>
  );
}

// Newsletter List Layout
function NewsletterListLayout({
  newsletters,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterLayoutProps) {
  return (
    <div className="space-y-6">
      {newsletters.map((newsletter, index) => (
        <NewsletterListCard
          key={newsletter.id}
          newsletter={newsletter}
          index={index}
          formatDate={formatDate}
          getTagColor={getTagColor}
          tagColorClasses={tagColorClasses}
          categoryIcons={categoryIcons}
        />
      ))}
    </div>
  );
}

function NewsletterListCard({
  newsletter,
  index,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterGridCardProps) {
  const Icon = categoryIcons[newsletter.category || ""] || Mail;

  const handleClick = () => {
    window.location.href = `/newsletter/${newsletter.id}`;
  };

  return (
    <article
      className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Image */}
        {newsletter.image && (
          <div className="lg:col-span-1">
            <div className="relative overflow-hidden rounded-xl h-32 lg:h-24">
              <img
                src={
                  typeof newsletter.image === "string"
                    ? newsletter.image
                    : newsletter.image.url
                }
                alt={
                  typeof newsletter.image === "string"
                    ? newsletter.title
                    : newsletter.image.alt || newsletter.title
                }
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className={`${newsletter.image ? "lg:col-span-3" : "lg:col-span-4"}`}
        >
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-3">
            <Icon className="w-4 h-4 text-gray-500" />
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                tagColorClasses[getTagColor(newsletter.category || "")]
              }`}
            >
              {newsletter.category}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(newsletter.date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-brand-teal transition-colors">
            {newsletter.title}
          </h3>

          {/* Key Discussion */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
            {newsletter.keyDiscussion || newsletter.summary}
          </p>

          {/* Tags */}
          {newsletter.tags && newsletter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newsletter.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    tagColorClasses[getTagColor(tag)]
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Recent Newsletters Section
function RecentNewslettersSection({
  newsletters,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
}: NewsletterLayoutProps) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Recent Newsletters
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay up to date with our latest market insights and strategic
            analysis
          </p>
        </div>

        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6" style={{ width: "max-content" }}>
            {newsletters.map((newsletter, index) => (
              <RecentNewsletterCard
                key={newsletter.id}
                newsletter={newsletter}
                onClick={() =>
                  (window.location.href = `/newsletter/${newsletter.id}`)
                }
                formatDate={formatDate}
                getTagColor={getTagColor}
                tagColorClasses={tagColorClasses}
                categoryIcons={categoryIcons}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface RecentNewsletterCardProps {
  newsletter: Newsletter;
  onClick: () => void;
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  categoryIcons: Record<string, React.ComponentType<any>>;
  index: number;
}

function RecentNewsletterCard({
  newsletter,
  onClick,
  formatDate,
  getTagColor,
  tagColorClasses,
  categoryIcons,
  index,
}: RecentNewsletterCardProps) {
  const Icon = categoryIcons[newsletter.category || ""] || Mail;

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 flex-shrink-0 w-80"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      {/* Image */}
      {newsletter.image && (
        <div className="relative overflow-hidden h-48">
          <img
            src={
              typeof newsletter.image === "string"
                ? newsletter.image
                : newsletter.image.url
            }
            alt={
              typeof newsletter.image === "string"
                ? newsletter.title
                : newsletter.image.alt || newsletter.title
            }
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          <Icon className="w-4 h-4 text-gray-500" />
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${
              tagColorClasses[getTagColor(newsletter.category || "")]
            }`}
          >
            {newsletter.category}
          </span>
          <span className="text-xs text-gray-500 ml-auto">
            {formatDate(newsletter.date).replace(/,.*/, "")}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
          {newsletter.title}
        </h3>

        {/* Key Discussion */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {newsletter.keyDiscussion || newsletter.summary}
        </p>

        {/* Footer */}
        <div className="flex items-center text-sm font-medium text-brand-teal">
          Read Newsletter
          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </article>
  );
}
