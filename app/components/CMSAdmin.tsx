import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import {
  getCMSData,
  addNewsletter,
  updateNewsletter,
  deleteNewsletter,
  addNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  addTag,
  updateTag,
  deleteTag,
  type Newsletter,
  type Article,
  type TestimonialData,
  type AvailableTag,
} from "../utils/cms";

// Authentication credentials
const ADMIN_EMAIL = "timothyhapsim@gmail.com";
const ADMIN_PASSWORD = "admin321";

type LoginForm = {
  email: string;
  password: string;
};

type AdminTab = "newsletters" | "news" | "testimonials" | "tags";

export default function CMSAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("newsletters");
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(
    null
  );
  const [editingNews, setEditingNews] = useState<Article | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialData | null>(null);
  const [editingTag, setEditingTag] = useState<AvailableTag | null>(null);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [tags, setTags] = useState<AvailableTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setStatusMessage("Loading data...");

    try {
      const [newslettersData, newsData, testimonialsData, tagsData] =
        await Promise.all([
          getCMSData("newsletters"),
          getCMSData("news"),
          getCMSData("testimonials"),
          getCMSData("availableTags"),
        ]);

      // Type guard to ensure we get the right data structure
      const newsletterItems =
        newslettersData &&
        typeof newslettersData === "object" &&
        "items" in newslettersData
          ? (newslettersData as { items: Newsletter[] }).items
          : [];
      const newsItems =
        newsData && typeof newsData === "object" && "items" in newsData
          ? (newsData as { items: Article[] }).items
          : [];
      const testimonialItems = Array.isArray(testimonialsData)
        ? (testimonialsData as TestimonialData[])
        : [];
      const tagItems = Array.isArray(tagsData)
        ? (tagsData as AvailableTag[])
        : [];

      setNewsletters(newsletterItems);
      setNews(newsItems);
      setTestimonials(testimonialItems);
      setTags(tagItems);
      setLastUpdate(new Date());
      setStatusMessage("Data loaded successfully");

      // Clear status message after 2 seconds
      setTimeout(() => setStatusMessage(""), 2000);
    } catch (error) {
      console.error("Error refreshing CMS data:", error);
      setStatusMessage("Error loading data");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }

    // Enhanced listening for CMS updates with better specificity
    const handleCMSUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (isAuthenticated) {
        console.log("CMS Admin received update:", customEvent.detail);
        // Add a small delay to ensure all operations complete
        setTimeout(refreshData, 100);
      }
    };

    const handleSpecificUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (isAuthenticated) {
        console.log("Specific CMS section updated:", customEvent.detail);
        setTimeout(refreshData, 50);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "cmsDataUpdated",
        handleCMSUpdate as EventListener
      );
      window.addEventListener(
        "cmsnewslettersUpdated",
        handleSpecificUpdate as EventListener
      );
      window.addEventListener(
        "cmsnewsUpdated",
        handleSpecificUpdate as EventListener
      );
      window.addEventListener(
        "cmstestimonialsUpdated",
        handleSpecificUpdate as EventListener
      );
      window.addEventListener(
        "cmsavailableTagsUpdated",
        handleSpecificUpdate as EventListener
      );

      return () => {
        window.removeEventListener(
          "cmsDataUpdated",
          handleCMSUpdate as EventListener
        );
        window.removeEventListener(
          "cmsnewslettersUpdated",
          handleSpecificUpdate as EventListener
        );
        window.removeEventListener(
          "cmsnewsUpdated",
          handleSpecificUpdate as EventListener
        );
        window.removeEventListener(
          "cmstestimonialsUpdated",
          handleSpecificUpdate as EventListener
        );
        window.removeEventListener(
          "cmsavailableTagsUpdated",
          handleSpecificUpdate as EventListener
        );
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.email === ADMIN_EMAIL &&
      loginForm.password === ADMIN_PASSWORD
    ) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
    setIsOpen(false);
  };

  // Newsletter handlers
  const handleSaveNewsletter = async (newsletterData: Newsletter) => {
    setIsLoading(true);
    setStatusMessage(
      newsletterData.id ? "Updating newsletter..." : "Creating newsletter..."
    );

    try {
      if (newsletterData.id) {
        await updateNewsletter(newsletterData.id, newsletterData);
        setStatusMessage("Newsletter updated successfully");
      } else {
        await addNewsletter(newsletterData);
        setStatusMessage("Newsletter created successfully");
      }
      setEditingNewsletter(null);
      setTimeout(() => setStatusMessage(""), 2000);
    } catch (error) {
      console.error("Error saving newsletter:", error);
      setStatusMessage("Error saving newsletter");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNewsletter = async (id: string | number) => {
    try {
      await deleteNewsletter(id);
      refreshData();
    } catch (error) {
      console.error("Error deleting newsletter:", error);
    }
  };

  // News Article handlers
  const handleSaveNews = async (newsData: Article) => {
    setIsLoading(true);
    setStatusMessage(
      newsData.id ? "Updating article..." : "Creating article..."
    );

    try {
      if (newsData.id) {
        await updateNewsArticle(newsData.id, newsData);
        setStatusMessage("Article updated successfully");
      } else {
        await addNewsArticle(newsData);
        setStatusMessage("Article created successfully");
      }
      setEditingNews(null);
      setTimeout(() => setStatusMessage(""), 2000);
    } catch (error) {
      console.error("Error saving news article:", error);
      setStatusMessage("Error saving article");
      setTimeout(() => setStatusMessage(""), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNews = async (id: string | number) => {
    try {
      await deleteNewsArticle(id);
      refreshData();
    } catch (error) {
      console.error("Error deleting news article:", error);
    }
  };

  const handleToggleNewsVisibility = async (id: string | number) => {
    const article = news.find((a) => a.id === id);
    if (article) {
      await updateNewsArticle(id, { isVisible: !article.isVisible });
      refreshData();
    }
  };

  // Testimonial handlers
  const handleSaveTestimonial = async (testimonialData: TestimonialData) => {
    try {
      if (testimonialData.id) {
        await updateTestimonial(testimonialData.id, testimonialData);
      } else {
        await addTestimonial(testimonialData);
      }
      setEditingTestimonial(null);
      refreshData();
    } catch (error) {
      console.error("Error saving testimonial:", error);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    try {
      await deleteTestimonial(id);
      refreshData();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    }
  };

  const handleToggleTestimonialActive = async (id: number) => {
    const testimonial = testimonials.find((t) => t.id === id);
    if (testimonial) {
      await updateTestimonial(id, { isActive: !testimonial.isActive });
      refreshData();
    }
  };

  // Tag handlers
  const handleSaveTag = async (tagData: AvailableTag) => {
    try {
      const existingTag = tags.find((t) => t.name === tagData.name);
      if (existingTag && editingTag?.name !== tagData.name) {
        alert("Tag with this name already exists");
        return;
      }

      if (editingTag) {
        await updateTag(editingTag.name, tagData);
      } else {
        await addTag(tagData);
      }
      setEditingTag(null);
      refreshData();
    } catch (error) {
      console.error("Error saving tag:", error);
    }
  };

  const handleDeleteTag = async (name: string) => {
    try {
      await deleteTag(name);
      refreshData();
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-800 transition-colors z-50"
      >
        Admin
      </button>
    );
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Admin Login</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {loginError && (
              <div className="text-red-600 text-sm">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">CMS Admin</h1>
            {/* Status Indicators */}
            <div className="flex items-center gap-2">
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Loading...
                </div>
              )}
              {statusMessage && !isLoading && (
                <div
                  className={`text-sm px-2 py-1 rounded-full ${
                    statusMessage.includes("Error") ||
                    statusMessage.includes("error")
                      ? "bg-red-100 text-red-800"
                      : statusMessage.includes("success")
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {statusMessage}
                </div>
              )}
              {lastUpdate && !isLoading && !statusMessage && (
                <div className="text-xs text-gray-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
              disabled={isLoading}
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: "newsletters", label: "Newsletters" },
            { id: "news", label: "Articles" },
            { id: "testimonials", label: "Testimonials" },
            { id: "tags", label: "Tags" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === "newsletters" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Newsletters</h2>
                <button
                  onClick={() => setEditingNewsletter({} as Newsletter)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Newsletter
                </button>
              </div>

              <div className="space-y-2">
                {newsletters.map((newsletter: Newsletter) => (
                  <div
                    key={newsletter.id}
                    className="border border-gray-200 rounded p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{newsletter.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {newsletter.summary}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{newsletter.date}</span>
                          <span>{newsletter.category}</span>
                          <span>{newsletter.views || 0} views</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingNewsletter(newsletter)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNewsletter(newsletter.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "news" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">News Articles</h2>
                <button
                  onClick={() => setEditingNews({} as Article)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Article
                </button>
              </div>

              <div className="space-y-2">
                {news.map((article: Article) => (
                  <div
                    key={article.id}
                    className="border border-gray-200 rounded p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{article.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>{article.date}</span>
                          <span>{article.category}</span>
                          <span>{article.views || 0} views</span>
                          {article.showcaseSection && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {article.showcaseSection}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleNewsVisibility(article.id)}
                          className={
                            article.isVisible
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {article.isVisible ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingNews(article)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(article.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "testimonials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Testimonials</h2>
                <button
                  onClick={() => setEditingTestimonial({} as TestimonialData)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Testimonial
                </button>
              </div>

              <div className="space-y-2">
                {testimonials.map((testimonial: TestimonialData) => (
                  <div
                    key={testimonial.id}
                    className="border border-gray-200 rounded p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{testimonial.author}</h3>
                        <p className="text-sm text-gray-600">
                          {testimonial.role}{" "}
                          {testimonial.company && `at ${testimonial.company}`}
                        </p>
                        <p className="text-sm text-gray-800 mt-2 italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleTestimonialActive(testimonial.id)
                          }
                          className={
                            testimonial.isActive
                              ? "text-green-600"
                              : "text-gray-400"
                          }
                        >
                          {testimonial.isActive ? (
                            <Eye size={16} />
                          ) : (
                            <EyeOff size={16} />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingTestimonial(testimonial)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTestimonial(testimonial.id)
                          }
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "tags" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Available Tags</h2>
                <button
                  onClick={() => setEditingTag({} as AvailableTag)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add Tag
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {tags.map((tag: AvailableTag) => (
                  <div
                    key={tag.name}
                    className="border border-gray-200 rounded p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={16} className="text-gray-500" />
                      <span className="font-medium">{tag.name}</span>
                      {tag.color && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: tag.color }}
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.name)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {editingNewsletter && (
        <NewsletterEditModal
          newsletter={editingNewsletter}
          onSave={handleSaveNewsletter}
          onCancel={() => setEditingNewsletter(null)}
        />
      )}

      {editingNews && (
        <NewsEditModal
          article={editingNews}
          onSave={handleSaveNews}
          onCancel={() => setEditingNews(null)}
        />
      )}

      {editingTestimonial && (
        <TestimonialEditModal
          testimonial={editingTestimonial}
          onSave={handleSaveTestimonial}
          onCancel={() => setEditingTestimonial(null)}
        />
      )}

      {editingTag && (
        <TagEditModal
          tag={editingTag}
          onSave={handleSaveTag}
          onCancel={() => setEditingTag(null)}
        />
      )}
    </div>
  );
}

// Newsletter Edit Modal

function NewsletterEditModal({
  newsletter,
  onSave,
  onCancel,
}: {
  newsletter: Newsletter;
  onSave: (newsletter: Newsletter) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Newsletter>({ ...newsletter });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {newsletter.id ? "Edit Newsletter" : "Add Newsletter"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, summary: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (HTML)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="BUSINESS">Business</option>
                  <option value="POLICY">Policy</option>
                  <option value="FINANCIAL">Financial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function NewsEditModal({
  article,
  onSave,
  onCancel,
}: {
  article: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Article>({ ...article });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {article.id ? "Edit Article" : "Add Article"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, summary: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content (HTML)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-40"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="BUSINESS">Business</option>
                  <option value="POLICY">Policy</option>
                  <option value="FINANCIAL">Financial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Showcase Section
                </label>
                <select
                  value={formData.showcaseSection || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      showcaseSection: e.target.value
                        ? (e.target.value as "featured" | "mosaic" | "loop")
                        : undefined,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="">None</option>
                  <option value="featured">Featured</option>
                  <option value="mosaic">Mosaic</option>
                  <option value="loop">Loop</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter((t) => t),
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVisible"
                checked={formData.isVisible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label
                htmlFor="isVisible"
                className="text-sm font-medium text-gray-700"
              >
                Visible on site
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Testimonial Edit Modal
function TestimonialEditModal({
  testimonial,
  onSave,
  onCancel,
}: {
  testimonial: TestimonialData;
  onSave: (testimonial: TestimonialData) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<TestimonialData>({ ...testimonial });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {testimonial.id ? "Edit Testimonial" : "Add Testimonial"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role/Title
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company (optional)
              </label>
              <input
                type="text"
                value={formData.company || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, company: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote
              </label>
              <textarea
                value={formData.quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quote: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-24"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Avatar URL (optional)
              </label>
              <input
                type="url"
                value={formData.avatar || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="testimonialActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label
                htmlFor="testimonialActive"
                className="text-sm font-medium text-gray-700"
              >
                Active (show on site)
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Tag Edit Modal
function TagEditModal({
  tag,
  onSave,
  onCancel,
}: {
  tag: AvailableTag;
  onSave: (tag: AvailableTag) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<AvailableTag>({ ...tag });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const colorOptions = [
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Red", value: "#EF4444" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Purple", value: "#8B5CF6" },
    { name: "Pink", value: "#EC4899" },
    { name: "Indigo", value: "#6366F1" },
    { name: "Gray", value: "#6B7280" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {tag.name ? "Edit Tag" : "Add Tag"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tag Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color (optional)
              </label>
              <select
                value={formData.color || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, color: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">No color</option>
                {colorOptions.map((color) => (
                  <option key={color.value} value={color.value}>
                    {color.name}
                  </option>
                ))}
              </select>
              {formData.color && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Preview:</span>
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
