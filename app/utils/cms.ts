// Enhanced CMS system with database integration for React Router + TypeScript
// Archive Integration:
//  - Manual newsletter JSON files placed under `app/archive/newsletters/*.json`
//  - Each file exports an object: { "newsletters": [ { ... } ] }
//  - Loaded lazily the first time `getCMSData('newsletters')` is invoked via import.meta.glob
//  - Fields `contentHtml` and `content` are normalized into `content`
//  - Duplicate IDs are ignored (runtime edits via admin take precedence)
//  - Safe: failure to load archive does not break runtime; only logs in dev

export type Newsletter = {
  id: string | number;
  title: string;
  date: string;
  displayDate?: string;
  keyDiscussion?: string | string[]; // allow array for structured points
  content?: string; // processed / markdown converted content
  contentHtml?: string; // raw HTML from archive JSON (unmodified)
  image?: string | { url: string; alt?: string };
  tags: string[];
  newsletterUrl?: string;
  summary?: string;
  category?: string;
  views?: number;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  lastUpdated?: string;
  insights?: string[];
  resources?: Array<{
    title: string;
    description: string;
    url: string;
    type: "video" | "download";
  }>;
};

// Article type for news content (different from newsletter)
export type Article = {
  id: string | number;
  title: string;
  date: string;
  displayDate?: string;
  content?: string;
  keyDiscussion?: string | string[];
  image?: string | { url: string; alt?: string };
  tags: string[];
  summary?: string;
  category?: string;
  views?: number;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
  };
  lastUpdated?: string;
  insights?: string[];
  resources?: Array<{
    title: string;
    description: string;
    url: string;
    type: "video" | "download" | "report" | "guide";
  }>;
  showcaseSection?: "featured" | "mosaic" | "loop";
  isVisible?: boolean;
  position?: number;
};

export type AvailableTag = { name: string; color?: string };

export type TestimonialData = {
  id: number;
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  isActive: boolean;
};

// Cache for CMS data - simplified to only include manageable content
let cache: {
  newsletters: Newsletter[];
  news: Article[];
  availableTags: AvailableTag[];
  testimonials: TestimonialData[];
  _newsletterArchiveLoaded?: boolean; // internal flag
  _newsArchiveLoaded?: boolean; // internal flag
} = {
  newsletters: [],
  news: [],
  availableTags: [],
  testimonials: [],
  _newsletterArchiveLoaded: false,
  _newsArchiveLoaded: false,
};

// Force database mode for production
if (typeof window !== "undefined") {
  localStorage.setItem("westernStarMigrated", "true");
}

// CMS Cache management
export function clearCMSCache(): void {
  cache = {
    newsletters: [],
    news: [],
    availableTags: [],
    testimonials: [],
  };
}

export async function getCMSData(
  key: "newsletters" | "news" | "availableTags" | "testimonials"
) {
  // Lazy load manual Newsletter JSON archive (first time requested)
  if (key === "newsletters" && !cache._newsletterArchiveLoaded) {
    try {
      // Dynamic import all JSON files in archive (Vite supports import.meta.glob)
      // These files are user-maintained manual newsletter JSONs.
      const modules = import.meta.glob("../archive/newsletters/*.json", {
        eager: true,
      }) as Record<string, any>;
      const imported: Newsletter[] = [];
      Object.values(modules).forEach((mod: any) => {
        const payload = mod?.newsletters || mod?.default?.newsletters;
        if (payload && Array.isArray(payload)) {
          payload.forEach((n: any) => {
            // Normalize field names to match Newsletter type
            const normalized: Newsletter = {
              id: n.id || n.slug || Date.now().toString(),
              title: n.title,
              date: n.date,
              displayDate: n.displayDate,
              keyDiscussion: n.keyDiscussion,
              content: n.content || n.contentHtml, // fallback chain
              contentHtml: n.contentHtml, // retain raw html separately for precise rendering
              image: n.image,
              tags: n.tags || [],
              newsletterUrl: n.newsletterUrl,
              summary: n.summary,
              category: n.category,
              views: n.views,
              author: n.author,
              lastUpdated: n.lastUpdated,
              insights: n.insights,
              resources: n.resources,
            };
            // Avoid duplicates (prefer dynamic cache entries that may have edits)
            const exists = cache.newsletters.find(
              (c) => c.id.toString() === normalized.id.toString()
            );
            if (!exists) imported.push(normalized);
          });
        }
      });
      if (imported.length) {
  // Merge & sort by date desc (admin/runtime edits will already be in cache)
        cache.newsletters = [...cache.newsletters, ...imported].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    } catch (err) {
      // Non-fatal: log to console only in dev
      if (import.meta.env?.DEV) {
        console.warn("Archive load failed:", err);
      }
    } finally {
      cache._newsletterArchiveLoaded = true;
    }
  }

  // Lazy load manual News JSON archive (first time requested)
  if (key === "news" && !cache._newsArchiveLoaded) {
    try {
      const modules = import.meta.glob("../archive/news/*.json", {
        eager: true,
      }) as Record<string, any>;
      const imported: Article[] = [];
      Object.values(modules).forEach((mod: any) => {
        const payload = mod?.news || mod?.default?.news;
        if (payload && Array.isArray(payload)) {
          payload.forEach((n: any, idx: number) => {
            const normalized: Article = {
              id: n.id || n.slug || Date.now().toString() + "-" + idx,
              title: n.title,
              date: n.date,
              displayDate: n.displayDate,
              content: n.content || n.contentHtml, // allow same field names as newsletters
              keyDiscussion: n.keyDiscussion,
              image: n.image,
              tags: n.tags || [],
              summary: n.summary,
              category: n.category,
              views: n.views,
              author: n.author,
              lastUpdated: n.lastUpdated,
              insights: n.insights,
              resources: n.resources,
              showcaseSection: n.showcaseSection,
              isVisible: n.isVisible !== undefined ? n.isVisible : true,
              position: n.position,
            };
            // Avoid duplicates (prefer dynamic cache entries that may have edits)
            const exists = cache.news.find(
              (c) => c.id.toString() === normalized.id.toString()
            );
            if (!exists) imported.push(normalized);
          });
        }
      });
      if (imported.length) {
  // Merge & sort by date desc (admin/runtime edits will already be in cache)
        cache.news = [...cache.news, ...imported]
          .filter((a) => a.isVisible !== false)
          .sort(
            (a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime() ||
              (Number(b.position || 0) - Number(a.position || 0))
          );
      }
    } catch (err) {
      if (import.meta.env?.DEV) {
        console.warn("News archive load failed:", err);
      }
    } finally {
      cache._newsArchiveLoaded = true;
    }
  }
  // In production, this would fetch from your database API
  // For now, using cache with placeholder data
  if (key === "newsletters") return { items: cache.newsletters };
  if (key === "news") return { items: cache.news };
  if (key === "availableTags") return cache.availableTags;
  if (key === "testimonials") return cache.testimonials;
  return null;
}

export async function updateCMSData(key: string, data: any): Promise<void> {
  // In production, this would update your database
  // For now, update cache and notify listeners
  if (key in cache) {
    (cache as any)[key] = data;
    if (typeof window !== "undefined") {
      // Dispatch detailed update event
      window.dispatchEvent(
        new CustomEvent("cmsDataUpdated", {
          detail: { section: key, data, timestamp: Date.now() },
        })
      );

      // Also dispatch specific section events for targeted updates
      window.dispatchEvent(
        new CustomEvent(`cms${key}Updated`, {
          detail: { data, timestamp: Date.now() },
        })
      );
    }
  }
}

// Enhanced notification system for better connectivity
export function notifyCMSUpdate(
  section: string,
  operation: "add" | "update" | "delete" = "update",
  id?: string | number
) {
  if (typeof window !== "undefined") {
    const detail = {
      section,
      operation,
      id,
      timestamp: Date.now(),
      cache: { ...cache }, // Send current cache state
    };

    // General update event
    window.dispatchEvent(new CustomEvent("cmsDataUpdated", { detail }));

    // Specific section event
    window.dispatchEvent(new CustomEvent(`cms${section}Updated`, { detail }));

    // Operation-specific event
    window.dispatchEvent(
      new CustomEvent(`cms${section}${operation}`, { detail })
    );
  }
}

// Newsletter management functions
export async function addNewsletter(
  newsletter: Omit<Newsletter, "id">
): Promise<string | number> {
  const id = Math.max(...cache.newsletters.map((n) => Number(n.id)), 0) + 1;
  const newNewsletter = { ...newsletter, id };
  cache.newsletters.push(newNewsletter);

  notifyCMSUpdate("newsletters", "add", id);
  return id;
}

export async function updateNewsletter(
  id: string | number,
  updates: Partial<Newsletter>
): Promise<Newsletter> {
  const index = cache.newsletters.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Newsletter not found");

  cache.newsletters[index] = { ...cache.newsletters[index], ...updates };

  notifyCMSUpdate("newsletters", "update", id);
  return cache.newsletters[index];
}

export async function deleteNewsletter(id: string | number): Promise<void> {
  const index = cache.newsletters.findIndex((n) => n.id === id);
  if (index === -1) throw new Error("Newsletter not found");

  cache.newsletters.splice(index, 1);

  notifyCMSUpdate("newsletters", "delete", id);
}

// News article management functions
export async function addNewsArticle(
  article: Omit<Article, "id">
): Promise<string | number> {
  const id = Math.max(...cache.news.map((a) => Number(a.id)), 0) + 1;
  const newArticle = {
    ...article,
    id,
    isVisible: true,
    position: cache.news.length + 1,
  };
  cache.news.push(newArticle);

  notifyCMSUpdate("news", "add", id);
  return id;
}

export async function updateNewsArticle(
  id: string | number,
  updates: Partial<Article>
): Promise<Article> {
  const index = cache.news.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Article not found");

  cache.news[index] = { ...cache.news[index], ...updates };

  notifyCMSUpdate("news", "update", id);
  return cache.news[index];
}

export async function deleteNewsArticle(id: string | number): Promise<void> {
  const index = cache.news.findIndex((a) => a.id === id);
  if (index === -1) throw new Error("Article not found");

  cache.news.splice(index, 1);

  notifyCMSUpdate("news", "delete", id);
}

// Tags management
export async function getAvailableTags(): Promise<AvailableTag[]> {
  return cache.availableTags;
}

export async function addTag(tag: AvailableTag): Promise<void> {
  const exists = cache.availableTags.find((t) => t.name === tag.name);
  if (!exists) {
    cache.availableTags.push(tag);
    notifyCMSUpdate("availableTags", "add");
  }
}

export async function updateTag(
  oldName: string,
  updates: Partial<AvailableTag>
): Promise<void> {
  const index = cache.availableTags.findIndex((t) => t.name === oldName);
  if (index !== -1) {
    cache.availableTags[index] = { ...cache.availableTags[index], ...updates };
    notifyCMSUpdate("availableTags", "update");
  }
}

export async function deleteTag(name: string): Promise<void> {
  const index = cache.availableTags.findIndex((t) => t.name === name);
  if (index !== -1) {
    cache.availableTags.splice(index, 1);
    notifyCMSUpdate("availableTags", "delete");
  }
}

// Testimonial management functions
export async function addTestimonial(
  testimonial: Omit<TestimonialData, "id">
): Promise<number> {
  const id = Math.max(...cache.testimonials.map((t) => t.id), 0) + 1;
  const newTestimonial = { ...testimonial, id };
  cache.testimonials.push(newTestimonial);

  notifyCMSUpdate("testimonials", "add", id);
  return id;
}

export async function updateTestimonial(
  id: number,
  updates: Partial<TestimonialData>
): Promise<TestimonialData> {
  const index = cache.testimonials.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Testimonial not found");

  cache.testimonials[index] = { ...cache.testimonials[index], ...updates };

  notifyCMSUpdate("testimonials", "update", id);
  return cache.testimonials[index];
}

export async function deleteTestimonial(id: number): Promise<void> {
  const index = cache.testimonials.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Testimonial not found");

  cache.testimonials.splice(index, 1);

  notifyCMSUpdate("testimonials", "delete", id);
}

export async function processArticleContent(
  article: Newsletter
): Promise<Newsletter> {
  // Process article content for display (e.g., markdown to HTML, image optimization)
  return {
    ...article,
    content:
      article.content || "<p>Article content would be processed here.</p>",
  };
}

export async function getRelatedArticles(
  tags: string[],
  currentId: string | number
): Promise<Newsletter[]> {
  // Get articles with similar tags, excluding current article
  const allArticles = cache.newsletters.filter(
    (article) =>
      article.id !== currentId && article.tags.some((tag) => tags.includes(tag))
  );
  return allArticles.slice(0, 4); // Return up to 4 related articles
}

export function __seedCMS(data: Partial<typeof cache>) {
  cache = { ...cache, ...data };
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cmsDataUpdated"));
  }
}

// Initialize with sample data for tags / testimonials only.
// Newsletter and News seeding removed—now sourced exclusively from archive JSON files.
__seedCMS({
  newsletters: [],
  news: [],
  availableTags: [
    { name: "Technology", color: "blue" },
    { name: "AI & ML", color: "purple" },
    { name: "Policy", color: "green" },
    { name: "Business", color: "orange" },
    { name: "Markets", color: "teal" },
    { name: "Innovation", color: "indigo" },
    { name: "Corporate", color: "cyan" },
    { name: "Global Economy", color: "emerald" },
  ],

  testimonials: [
    {
      id: 1,
      quote:
        "Western Star's insights have been instrumental in helping us navigate complex market dynamics. Their analysis is always spot-on.[dummy]",
      author: "Sarah Chen",
      role: "Chief Strategy Officer",
      company: "TechVentures Inc.",
      avatar: "https://plus.unsplash.com/premium_photo-1690086519096-0594592709d3?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZmVtYWxlJTIwYXZhdGFyfGVufDB8fDB8fHww",
      isActive: true,
    },
    {
      id: 2,
      quote:
        "The depth of research and quality of analysis from Western Star is unmatched. It's become essential reading for our executive team.[dummy]",
      author: "Michael Rodriguez",
      role: "Managing Director",
      company: "Global Capital Partners",
      avatar: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww",
      isActive: true,
    },
    {
      id: 3,
      quote:
        "Western Star provides the strategic intelligence we need to stay ahead of market trends. Their insights consistently deliver value.[dummy]",
      author: "Emily Johnson",
      role: "Head of Research",
      company: "Innovation Labs",
      avatar: "https://plus.unsplash.com/premium_photo-1658527049634-15142565537a?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyfGVufDB8fDB8fHww",
      isActive: true,
    },
  ],
});
