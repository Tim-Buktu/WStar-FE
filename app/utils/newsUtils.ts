// News Content Management Utilities
// TypeScript version adapted for React Router + Vite stack

import type { Article, Newsletter } from "./cms";

/**
 * Generate a new article ID
 */
export function generateArticleId(
  existingArticles: (Article | Newsletter)[]
): number {
  const existingIds = existingArticles.map((article) => Number(article.id));
  return Math.max(...existingIds, 0) + 1;
}

/**
 * Estimate reading time for article content
 */
export function estimateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  // Strip HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, "");
  const wordCount = textContent.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

/**
 * Validate article structure
 */
export function validateArticle(article: Partial<Article>): ValidationResult {
  const errors: string[] = [];

  // Required fields
  if (!article.id) errors.push("Article ID is required");
  if (!article.title || article.title.length === 0)
    errors.push("Title is required");
  if (!article.summary || article.summary.length === 0)
    errors.push("Summary is required");
  if (!article.content || article.content.length === 0)
    errors.push("Content is required");
  if (!article.category) errors.push("Category is required");
  if (!article.date) errors.push("Date is required");

  // Length validations
  if (article.title && article.title.length > 120)
    errors.push("Title should be under 120 characters");
  if (article.summary && article.summary.length > 300)
    errors.push("Summary should be under 300 characters");

  // Array validations
  if (!Array.isArray(article.tags)) errors.push("Tags should be an array");

  // Image validation
  if (article.image) {
    if (typeof article.image === "string") {
      if (!article.image.startsWith("http"))
        errors.push("Image URL should start with http/https");
    } else if (typeof article.image === "object") {
      if (!article.image.url)
        errors.push("Image object should have url property");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format date for display
 */
export function formatDisplayDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Generate article URL slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple consecutive hyphens
    .trim();
}

/**
 * Extract text content from HTML
 */
export function extractTextContent(htmlContent: string): string {
  return htmlContent.replace(/<[^>]*>/g, "").trim();
}

/**
 * Create article template
 */
export function createArticleTemplate(
  overrides: Partial<Article> = {}
): Article {
  const template: Article = {
    id: 0,
    title: "",
    summary: "",
    content: "",
    author: {
      name: "",
      role: "",
      avatar: "",
    },
    date: new Date().toISOString().split("T")[0],
    lastUpdated: new Date().toISOString().split("T")[0],
    tags: [],
    image: {
      url: "",
      alt: "",
    },
    views: 0,
    category: "TECHNOLOGY",
  };

  return { ...template, ...overrides };
}

/**
 * Filter criteria type
 */
export type FilterOptions = {
  query?: string;
  categories?: string[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: "date-desc" | "date-asc" | "title-asc" | "title-desc" | "views-desc";
};

/**
 * Filter articles by criteria
 */
export function filterArticles(
  articles: Article[],
  filters: FilterOptions = {}
): Article[] {
  let filtered = [...articles];

  // Search query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        (article.summary && article.summary.toLowerCase().includes(query)) ||
        (article.category && article.category.toLowerCase().includes(query)) ||
        (article.tags &&
          article.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(
      (article) =>
        article.category && filters.categories!.includes(article.category)
    );
  }

  // Tag filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(
      (article) =>
        article.tags && filters.tags!.some((tag) => article.tags.includes(tag))
    );
  }

  // Date range filter
  if (filters.startDate || filters.endDate) {
    filtered = filtered.filter((article) => {
      const articleDate = new Date(article.date);
      const start = filters.startDate
        ? new Date(filters.startDate)
        : new Date("1900-01-01");
      const end = filters.endDate
        ? new Date(filters.endDate)
        : new Date("2100-12-31");
      return articleDate >= start && articleDate <= end;
    });
  }

  // Sort articles
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "date-desc":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date-asc":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "title-asc":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "views-desc":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        // Default to date descending
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }
  }

  return filtered;
}

/**
 * Article statistics type
 */
export type ArticleStats = {
  total: number;
  categories: Record<string, number>;
  tags: Record<string, number>;
  totalViews: number;
  averageViews: number;
  mostViewed: Article | null;
  mostRecent: Article | null;
};

/**
 * Get article statistics
 */
export function getArticleStats(articles: Article[]): ArticleStats {
  const stats: ArticleStats = {
    total: articles.length,
    categories: {},
    tags: {},
    totalViews: 0,
    averageViews: 0,
    mostViewed: null,
    mostRecent: null,
  };

  articles.forEach((article) => {
    // Category stats
    if (article.category) {
      stats.categories[article.category] =
        (stats.categories[article.category] || 0) + 1;
    }

    // Tag stats
    if (article.tags) {
      article.tags.forEach((tag) => {
        stats.tags[tag] = (stats.tags[tag] || 0) + 1;
      });
    }

    // View stats
    const views = article.views || 0;
    stats.totalViews += views;

    if (!stats.mostViewed || views > (stats.mostViewed.views || 0)) {
      stats.mostViewed = article;
    }

    // Recency stats
    if (
      !stats.mostRecent ||
      new Date(article.date) > new Date(stats.mostRecent.date)
    ) {
      stats.mostRecent = article;
    }
  });

  stats.averageViews =
    articles.length > 0 ? Math.round(stats.totalViews / articles.length) : 0;

  return stats;
}

// Export all utilities as default
export default {
  generateArticleId,
  estimateReadingTime,
  validateArticle,
  formatDisplayDate,
  generateSlug,
  extractTextContent,
  createArticleTemplate,
  filterArticles,
  getArticleStats,
};
