import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Share2,
  Clock,
  ExternalLink,
  BookmarkPlus,
  Eye,
  PlayCircle,
  Download,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getCMSData,
  processArticleContent,
  getRelatedArticles,
  type Newsletter,
  type AvailableTag,
} from "../utils/cms";
import api from "../utils/api";

export const meta = ({ params }: any) => [
  { title: `Newsletter ${params.id} | Western Star` },
];

export default function NewsletterDetailPage() {
  const { id } = useParams();
  const newsletterId = id as string;
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [related, setRelated] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<AvailableTag[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [news, tags] = await Promise.all([
          getCMSData("news"),
          getCMSData("availableTags"),
        ]);
        if (cancelled) return;

        const newsData = (news as { items: Newsletter[] }) || { items: [] };
        setAvailableTags(Array.isArray(tags) ? (tags as AvailableTag[]) : []);

        const found = newsData.items.find(
          (item) => item.id.toString() === newsletterId
        );
        if (found) {
          const processedArticle = await processArticleContent(found);
          if (!cancelled) setNewsletter(processedArticle);
          const relatedArticles = await getRelatedArticles(
            found.tags || [],
            found.id
          );
          if (!cancelled) setRelated(relatedArticles);
        } else {
          // Fallback to old newsletters endpoint
          try {
            const nls = await getCMSData("newsletters");
            const list: Newsletter[] = Array.isArray((nls as any)?.items)
              ? (nls as any).items
              : [];
            let current = list.find((n) => n.id.toString() === newsletterId);
            if (!current) {
              const fetched = await api.getNewsletter(newsletterId);
              if (fetched) current = fetched;
            }
            if (current && !cancelled) {
              setNewsletter({
                ...current,
                tags: Array.isArray(current.tags) ? current.tags : [],
              });
              const rel = list
                .filter(
                  (n) =>
                    n.id !== current!.id &&
                    n.tags?.some((t) => current!.tags?.includes(t))
                )
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 3);
              setRelated(rel);
            } else if (!cancelled) {
              setNewsletter(null);
              setRelated([]);
            }
          } catch (fallbackError) {
            if (!cancelled) {
              console.error(
                "Failed to load newsletter from fallback:",
                fallbackError
              );
              setNewsletter(null);
              setRelated([]);
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          console.error("Failed to load newsletter detail", e);
          setNewsletter(null);
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
  }, [newsletterId]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      // Update active section based on scroll position
      const sections = document.querySelectorAll("[data-section]");
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection((section as HTMLElement).dataset.section || "");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mx-auto mb-4" />
          <p className="text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );

  if (!newsletter)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Newsletter Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The newsletter you're looking for doesn't exist or has been
              removed.
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
  };

  const estimateReadingTime = (content?: string, rawHtml?: string) => {
    const wordsPerMinute = 200;
    const source = rawHtml || content || "";
    const wordCount = source.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const handleShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: newsletter.title,
          text: newsletter.keyDiscussion,
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
  <div className="min-h-screen bg-white newsletter-detail-page">
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
                {newsletter.category && (
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-slate-900 text-white shadow-sm"
                  >
                    {newsletter.category}
                  </span>
                )}
                <div className="flex items-center text-gray-500 text-xs font-medium gap-4">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {newsletter.displayDate || formatDate(newsletter.date)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {estimateReadingTime(newsletter.content, (newsletter as any).contentHtml)} min read
                  </span>
                  {newsletter.views && (
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {newsletter.views.toLocaleString()} views
                    </span>
                  )}
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
                {newsletter.title}
              </h1>
              {newsletter.summary && (
                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-2xl">
                  {newsletter.summary}
                </p>
              )}
            </div>
            <aside className="md:col-span-4 space-y-6 md:pl-4">
              {newsletter.author && (
                <div className="flex items-center gap-4 bg-gray-50/70 rounded-2xl p-4 border border-gray-100">
                  {newsletter.author.avatar && (
                    <img
                      src={newsletter.author.avatar}
                      alt={newsletter.author.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {newsletter.author.name}
                    </div>
                    {newsletter.author.role && (
                      <div className="text-xs text-gray-500">
                        {newsletter.author.role}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium tracking-wide rounded-xl border transition-colors ${
                    isBookmarked
                      ? "bg-brand-teal text-white border-brand-teal"
                      : "text-brand-teal border-brand-teal hover:bg-brand-teal hover:text-white"
                  }`}
                >
                  <BookmarkPlus className="w-4 h-4" />
                  {isBookmarked ? "Saved" : "Save"}
                </button>
              </div>
            </aside>
          </div>
          {/* Divider */}
          <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* Tags */}
          {newsletter.tags && newsletter.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8" data-section="tags">
              {newsletter.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                    tagColorClasses[
                      getTagColor(tag) as keyof typeof tagColorClasses
                    ]
                  }`}
                >
                  <Tag className="w-3 h-3 inline mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          {(newsletter.image || (newsletter as any).image?.url) && (
            <div className="mb-10">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <img
                  src={
                    typeof newsletter.image === "string"
                      ? newsletter.image
                      : (newsletter.image as any)?.url
                  }
                  alt={newsletter.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>
          )}
          {/* Key Discussion Points */}
          {newsletter.keyDiscussion && (
            <div className="bg-gradient-to-r from-brand-teal/5 via-brand-navy/5 to-brand-coral/5 rounded-3xl p-8 mb-10 border border-gray-100">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-brand-teal rounded-2xl flex items-center justify-center shadow-lg">
                  <Tag className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-5 tracking-tight">
                    Key Discussion Points
                  </h2>
                  {Array.isArray(newsletter.keyDiscussion) ? (
                    <ul className="space-y-3">
                      {newsletter.keyDiscussion.map((point, i) => (
                        <li
                          key={i}
                          className="group flex items-start gap-3 bg-white/40 hover:bg-white/70 transition-colors rounded-xl p-4 border border-gray-200/60 shadow-sm hover:shadow-md"
                        >
                          <div className="mt-0.5 w-6 h-6 rounded-full bg-brand-teal/10 text-brand-teal flex items-center justify-center text-xs font-semibold group-hover:bg-brand-teal group-hover:text-white transition-colors">
                            {i + 1}
                          </div>
                          <p className="text-gray-800 leading-relaxed">
                            {point}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {newsletter.keyDiscussion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </header>
        {/* Main Content */}
        <div data-section="content">
          {newsletter.contentHtml || newsletter.content ? (
            <div className="relative">
              <div className="absolute -inset-x-6 -inset-y-4 bg-gradient-to-b from-transparent via-brand-teal/5 to-brand-coral/5 rounded-3xl pointer-events-none" />
              <div className="relative newsletter-rich-html max-w-none">
                <div
                  className="newsletter-html-body"
                  // Prefer raw contentHtml for fidelity; fallback to processed content
                  dangerouslySetInnerHTML={{ __html: newsletter.contentHtml || newsletter.content! }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-yellow-800">
                Full newsletter content is being processed and will be available
                soon.
              </p>
            </div>
          )}
        </div>

        {/* Key Insights/Highlights */}
        {newsletter.insights && (
          <div
            className="mt-12 p-8 bg-gradient-to-br from-brand-teal/5 to-brand-coral/5 rounded-3xl border border-brand-teal/10"
            data-section="insights"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">!</span>
              </div>
              Key Insights
            </h3>
            <ul className="space-y-4">
              {newsletter.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Downloads/Resources */}
        {newsletter.resources && (
          <div className="mt-12" data-section="resources">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Additional Resources
            </h3>
            <div className="grid gap-4">
              {newsletter.resources.map((resource, index) => (
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
        {newsletter.newsletterUrl && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Read Full Newsletter
              </h3>
              <p className="text-sm text-gray-600">
                Access the complete newsletter with all formatting and images.
              </p>
            </div>
            <a
              href={newsletter.newsletterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-brand-teal text-white rounded-xl hover:bg-brand-teal/90 transition-colors"
            >
              Open Newsletter
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        )}

        {/* Article Footer Actions */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              Last updated:{" "}
              {formatDate(newsletter.lastUpdated || newsletter.date)}
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
                <RelatedNewsletterCard
                  key={r.id}
                  newsletter={r}
                  formatDate={formatDate}
                  getTagColor={getTagColor}
                  tagColorClasses={tagColorClasses}
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

interface RelatedNewsletterCardProps {
  newsletter: Newsletter;
  formatDate: (dateString: string) => string;
  getTagColor: (tagName: string) => string;
  tagColorClasses: Record<string, string>;
  index: number;
}

function RelatedNewsletterCard({
  newsletter,
  formatDate,
  getTagColor,
  tagColorClasses,
  index,
}: RelatedNewsletterCardProps) {
  const handleClick = () => {
    window.location.href = `/newsletter/${newsletter.id}`;
  };

  return (
    <article
  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 animate-fadeInUp"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-3">
          {newsletter.category && (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border ${
                tagColorClasses[
                  getTagColor(
                    newsletter.category
                  ) as keyof typeof tagColorClasses
                ]
              }`}
            >
              {newsletter.category}
            </span>
          )}
          <span className="text-xs text-gray-500">
            {(newsletter.displayDate || formatDate(newsletter.date)).replace(
              /,.*/,
              ""
            )}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-teal transition-colors">
          {newsletter.title}
        </h3>

        {/* Summary */}
        {newsletter.summary && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
            {newsletter.summary}
          </p>
        )}

        {/* Read More */}
        <div className="flex items-center text-sm font-medium text-brand-teal group-hover:text-brand-navy transition-colors">
          Read Article
          <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </article>
  );
}
