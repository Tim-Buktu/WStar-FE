import React, { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, Clock, Eye, Tag } from "lucide-react";
import { Link } from "react-router";
import { getCMSData, type Article, type AvailableTag } from "../utils/cms";

export function ContentPreview() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [headlineList, setHeadlineList] = useState<Article[]>([]);
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const [newsData, tags] = await Promise.all([
          getCMSData("news"),
          getCMSData("availableTags"),
        ]);

        if (newsData && typeof newsData === "object" && "items" in newsData) {
          // Filter for visible articles and sort by position or date
          const articles = (newsData as { items: Article[] }).items
            .filter((article) => article.isVisible !== false)
            .sort((a, b) => {
              // Sort by position first, then by date (newest first)
              if (a.position !== undefined && b.position !== undefined) {
                return a.position - b.position;
              }
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
          setHeadlineList(articles);
        } else {
          setHeadlineList([]);
        }

        if (Array.isArray(tags)) {
          setAvailableTags(tags as AvailableTag[]);
        } else {
          setAvailableTags([]);
        }
      } catch (error) {
        console.error("Error loading content:", error);
        setHeadlineList([]);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    // Enhanced event listeners for better connectivity
    const handleCMSUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("CMS Update detected in ContentPreview:", customEvent.detail);
      if (
        customEvent.detail.section === "news" ||
        customEvent.detail.section === "availableTags"
      ) {
        // Add a small delay to ensure cache is updated
        setTimeout(loadContent, 100);
      }
    };

    const handleNewsUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("News-specific update detected:", customEvent.detail);
      setTimeout(loadContent, 50);
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "cmsDataUpdated",
        handleCMSUpdate as EventListener
      );
      window.addEventListener(
        "cmsnewsUpdated",
        handleNewsUpdate as EventListener
      );
      window.addEventListener(
        "cmsavailableTagsUpdated",
        handleCMSUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "cmsDataUpdated",
          handleCMSUpdate as EventListener
        );
        window.removeEventListener(
          "cmsnewsUpdated",
          handleNewsUpdate as EventListener
        );
        window.removeEventListener(
          "cmsavailableTagsUpdated",
          handleCMSUpdate as EventListener
        );
      };
    }
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Content
            </h2>
            <p className="text-gray-600">Loading content...</p>
          </div>
        </div>
      </section>
    );
  }

  if (headlineList.length === 0) {
    return (
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Content
            </h2>
            <p className="text-gray-600">No content available at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Get categories from available tags only
  const getCategories = (): string[] => {
    const uniqueCategories = Array.from(
      new Set(
        headlineList
          .map((item) => item.category)
          .filter((cat): cat is string => Boolean(cat))
      )
    );
    return ["ALL", ...uniqueCategories];
  };

  const categories = getCategories();

  // Enhanced filtering to work with tags field and sorting by date
  const filteredItems =
    selectedCategory === "ALL"
      ? headlineList
      : headlineList.filter((item) => {
          if (item.category === selectedCategory) return true;
          if (
            item.tags?.some(
              (tag) =>
                tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                selectedCategory.toLowerCase().includes(tag.toLowerCase())
            )
          )
            return true;
          return false;
        });

  // Sort by date (most recent first)
  const sortedItems = [...filteredItems].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const [lead, second, ...rest] = sortedItems;
  const sideArticles = rest.slice(0, 3);
  const trendingHeadlines = rest.slice(3, 8);

  // Safety check for lead article
  if (!lead) {
    return (
      <section className="relative overflow-hidden bg-white py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Content
            </h2>
            <p className="text-gray-600">
              No content matches the selected category.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get display info for category buttons
  const getCategoryDisplayInfo = (category: string) => {
    if (category === "ALL") return { name: "All", color: "slate" };
    return {
      name: category,
      color:
        availableTags.find(
          (tag) => tag.name.toLowerCase() === category.toLowerCase()
        )?.color || "blue",
    };
  };

  // Helper function to get primary tag for display
  const getPrimaryTag = (article: Article) => {
    if (article.category) return article.category;
    if (article.tags && article.tags.length > 0) return article.tags[0];
    return "Article";
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-indigo-50 border border-slate-200/50 text-slate-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 shadow-sm">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <span>Latest Insights</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-slate-900 tracking-tight">
            Featured Content
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our latest analysis, insights, and strategic intelligence
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const categoryInfo = getCategoryDisplayInfo(category);
            const isActive = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-md"
                }`}
              >
                {categoryInfo.name}
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 lg:h-[28rem]">
          {/* Lead Article (Left 1 - Full Height) */}
          <div className="lg:col-span-8 lg:h-[28rem]">
            <Link
              to={`/news/${lead.id}`}
              className="group block bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
            >
              {/* Image area: full height on large screens */}
              <div className="relative bg-slate-200 h-64 md:h-80 lg:h-full">
                {lead.image ? (
                  <img
                    src={
                      typeof lead.image === "string"
                        ? lead.image
                        : lead.image.url
                    }
                    alt={lead.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="bg-white/10 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-white/30">
                    {getPrimaryTag(lead)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight drop-shadow-md">
                    {lead.title}
                  </h3>
                  <p className="hidden md:block text-white/85 max-w-2xl line-clamp-3 text-sm md:text-base leading-relaxed">
                    {lead.summary ||
                      "Explore the latest insights and analysis..."}
                  </p>
                </div>
              </div>
              <div className="p-6 md:p-8 flex items-center justify-between bg-white border-t border-slate-100">
                <div className="flex items-center gap-4 text-xs md:text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(lead.date)}
                  </span>
                  {lead.views && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {lead.views.toLocaleString()}
                    </span>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-indigo-600 font-medium text-sm group-hover:underline">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Right Column (Two stacked cards) */}
          <div className="lg:col-span-4 lg:h-[28rem] hidden lg:flex flex-col gap-6 min-h-0">
            {/* Determine right column items */}
            {(() => {
              const rightTop = second || rest[0];
              const rightBottom = rest.find((a) => a.id !== rightTop?.id);
              return (
                <>
                  {rightTop && (
                    <Link
                      to={`/news/${rightTop.id}`}
                      className="relative block rounded-2xl overflow-hidden border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300 min-h-0"
                      style={{ flex: 3, minHeight: 0 }}
                    >
                      <div className="absolute inset-0 bg-slate-200">
                        {rightTop.image ? (
                          <img
                            src={
                              typeof rightTop.image === "string"
                                ? rightTop.image
                                : rightTop.image.url
                            }
                            alt={rightTop.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <TrendingUp className="w-12 h-12 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold border border-white/30">
                          {getPrimaryTag(rightTop)}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 drop-shadow">
                          {rightTop.title}
                        </h3>
                      </div>
                    </Link>
                  )}

                  {rightBottom && (
                    <Link
                      to={`/news/${rightBottom.id}`}
                      className="relative block rounded-2xl overflow-hidden border border-slate-200/60 shadow-md hover:shadow-lg transition-all duration-300 min-h-0"
                      style={{ flex: 2, minHeight: 0 }}
                    >
                      <div className="absolute inset-0 bg-slate-200">
                        {rightBottom.image ? (
                          <img
                            src={
                              typeof rightBottom.image === "string"
                                ? rightBottom.image
                                : rightBottom.image.url
                            }
                            alt={rightBottom.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Tag className="w-8 h-8 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h4 className="text-white font-semibold text-base leading-snug line-clamp-2 drop-shadow">
                          {rightBottom.title}
                        </h4>
                      </div>
                    </Link>
                  )}
                </>
              );
            })()}
          </div>

          {/* Mobile/Tablet fallback for right column */}
          <div className="lg:hidden space-y-6">
            {second && (
              <Link
                to={`/news/${second.id}`}
                className="group block bg-white border border-slate-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                  {second.image ? (
                    <img
                      src={
                        typeof second.image === "string"
                          ? second.image
                          : second.image.url
                      }
                      alt={second.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TrendingUp className="w-12 h-12 text-slate-400" />
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {getPrimaryTag(second)}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {second.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                    {second.summary || "Explore the latest insights..."}
                  </p>
                </div>
              </Link>
            )}

            {sideArticles.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="group flex gap-4 p-4 bg-white border border-slate-200/50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg overflow-hidden">
                  {article.image ? (
                    <img
                      src={
                        typeof article.image === "string"
                          ? article.image
                          : article.image.url
                      }
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Tag className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {formatDate(article.date)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending Headlines */}
        {trendingHeadlines.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Trending Headlines
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingHeadlines.map((headline, index) => (
                <Link
                  key={headline.id}
                  to={`/news/${headline.id}`}
                  className="group block p-6 bg-white/80 backdrop-blur-lg border border-slate-200/50 rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
                        {headline.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(headline.date)}</span>
                        {headline.views && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {headline.views.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* View More */}
        <div className="text-center mt-12">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-indigo-700 hover:to-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ContentPreview;
