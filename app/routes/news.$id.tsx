import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ArrowLeft, Calendar, Tag, Share2, Clock, ExternalLink, BookmarkPlus, Eye, PlayCircle, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getCMSData, type Article, type AvailableTag } from "../utils/cms";

export const meta = ({ params }: any) => [
  { title: `News ${params.id} | Western Star` },
];

export default function NewsDetailPage() {
  const { id } = useParams();
  const articleId = id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [news, tags] = await Promise.all([
          getCMSData("news"),
          getCMSData("availableTags"),
        ]);
        if (cancelled) return;

        const newsData = (news as { items: Article[] }) || { items: [] };
        setAvailableTags(Array.isArray(tags) ? (tags as AvailableTag[]) : []);

        const found = newsData.items.find(
          (item) => item.id.toString() === articleId
        );
        if (found) {
          if (!cancelled) setArticle(found);
          const relatedArticles = newsData.items
            .filter(
              (a) =>
                a.id.toString() !== found.id.toString() &&
                (a.tags || []).some((t) => (found.tags || []).includes(t))
            )
            .slice(0, 4);
          if (!cancelled) setRelated(relatedArticles);
        } else if (!cancelled) {
          setArticle(null);
          setRelated([]);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to load news detail", e);
          setArticle(null);
          setRelated([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const onCMSUpdate = () => load();
    window.addEventListener("cmsDataUpdated", onCMSUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("cmsDataUpdated", onCMSUpdate);
    };
  }, [articleId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );

  if (!article)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => (window.location.href = "/news")}
              className="inline-flex items-center px-6 py-3 bg-brand-teal text-white rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to News
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

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
  } as const;

  const estimateReadingTime = (content?: string) => {
    const wordsPerMinute = 200;
    const source = content || "";
    const wordCount = source.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: article.title,
          text: article.summary,
          url: window.location.href,
        });
      } catch {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Reading Progress Bar */}
      <div className="fixed top-[72px] left-0 right-0 h-1 bg-gray-100 z-40">
        <div
          className="h-full bg-gradient-to-r from-brand-teal to-brand-coral transition-all duration-300"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="border-b border-gray-200/80 bg-white/90 backdrop-blur-md sticky top-16 z-40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => (window.location.href = "/news")}
            className="inline-flex items-center text-sm text-gray-600 hover:text-brand-teal transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to News
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center text-sm text-gray-600 hover:text-brand-teal transition-colors duration-200 group"
            >
              <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Share
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? "bg-brand-teal text-white"
                  : "text-gray-600 hover:text-brand-teal hover:bg-gray-50"
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
        <header className="mb-14">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-8">
              {/* Category & Title */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {article.category && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-slate-900 text-white shadow-sm">
                    {article.category}
                  </span>
                )}
                <div className="flex items-center text-gray-500 text-xs font-medium gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {article.displayDate || formatDate(article.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {estimateReadingTime(article.content)} min read
                  </span>
                  {article.views && (
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {article.views.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                {article.title}
              </h1>
              {article.summary && (
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  {article.summary}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8" data-section="tags">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    (tagColorClasses as any)[getTagColor(tag)]
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(article.image as any)?.url || typeof article.image === "string" ? (
            <div className="mb-10">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={
                    typeof article.image === "string"
                      ? article.image
                      : (article.image as any)?.url
                  }
                  alt={article.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          ) : null}
        </header>

        {/* Key Discussion Points */}
        {article.keyDiscussion && (
          <div className="bg-gradient-to-r from-brand-teal/5 via-brand-navy/5 to-brand-coral/5 rounded-3xl p-8 mb-10 border border-gray-100">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0 w-14 h-14 bg-brand-teal rounded-2xl flex items-center justify-center shadow-lg">
                <Tag className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight">
                  Key Discussion Points
                </h2>
                {Array.isArray(article.keyDiscussion) ? (
                  <ul className="space-y-3">
                    {article.keyDiscussion.map((point, i) => (
                      <li
                        key={i}
                        className="group flex items-start gap-3 bg-white/40 hover:bg-white/70 transition-colors rounded-xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md"
                      >
                        <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-xs font-semibold group-hover:bg-brand-teal group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-gray-800 leading-relaxed">{point}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {article.keyDiscussion}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div data-section="content">
          {article.content ? (
            <div className="relative">
              <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-b from-transparent via-brand-teal/5 to-brand-coral/5 rounded-3xl pointer-events-none" />
              <div className="relative newsletter-rich-html max-w-none">
                <div
                  className="newsletter-html-body"
                  dangerouslySetInnerHTML={{ __html: article.content! }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-yellow-800">
                Full article content will be available soon.
              </p>
            </div>
          )}
        </div>

        {/* Resources */}
        {article.resources && (
          <div className="mt-12" data-section="resources">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Additional Resources
            </h3>
            <div className="grid gap-4">
              {article.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                      {resource.type === "video" ? (
                        <PlayCircle className="w-5 h-5 text-brand-teal" />
                      ) : (
                        <Download className="w-5 h-5 text-brand-teal" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {resource.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {resource.description}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-brand-teal transition-colors" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Article Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Last updated: {formatDate(article.lastUpdated || article.date)}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-teal hover:bg-brand-teal hover:text-white rounded-xl border border-brand-teal transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </button>
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                  isBookmarked
                    ? "bg-brand-teal text-white border-brand-teal"
                    : "text-brand-teal hover:bg-brand-teal hover:text-white border-brand-teal"
                }`}
              >
                <BookmarkPlus className="w-4 h-4" />
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-20 mt-8 border-t border-gray-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2 text-sm font-medium text-gray-600 shadow-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                Curated for You
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 tracking-tight">
                Related Articles
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed text-lg">
                Explore more insights on similar topics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((r, i) => (
                <RelatedArticleCard
                  key={r.id}
                  article={r}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses as any}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

interface RelatedArticleCardProps {
  article: Article;
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  index: number;
}

function RelatedArticleCard({
  article,
  formatDate,
  getTagColor,
  tagColorClasses,
  index,
}: RelatedArticleCardProps) {
  const handleClick = () => {
    window.location.href = `/news/${article.id}`;
  };

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 animate-fadeInUp"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={handleClick}
    >
      {article.image && (
        <div className="relative overflow-hidden h-48">
          <img
            src={
              typeof article.image === "string"
                ? article.image
                : (article.image as any).url
            }
            alt={
              typeof article.image === "string"
                ? article.title
                : (article.image as any).alt || article.title
            }
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          {article.category && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                (tagColorClasses as any)[getTagColor(article.category)]
              }`}
            >
              {article.category}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {(article.displayDate || formatDate(article.date)).replace(
              /,.*/,
              ""
            )}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
          {article.title}
        </h3>

        {article.summary && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {article.summary}
          </p>
        )}

        <div className="flex items-center text-sm font-medium text-brand-teal group-hover:text-brand-navy transition-colors">
          Read Article
          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </article>
  );
}
