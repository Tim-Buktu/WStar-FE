# Newsletter Archive

Place manual newsletter JSON files in `newsletters/` with the following structure:

```
{
  "newsletters": [
    {
      "id": "daily-brief-2025-09-04",
      "slug": "daily-brief",
      "title": "Daily Brief — Thu, 04 Sep 2025 (WIB)",
      "date": "2025-09-04",
      "summary": "Indonesia faces protests...",
      "keyDiscussion": ["Point 1", "Point 2"],
      "tags": ["indonesia", "markets"],
      "image": { "url": "https://...", "alt": "Daily Brief cover" },
      "contentHtml": "<h2>Top Lines</h2>..."
    }
  ]
}
```

Multiple files are merged at runtime. Filenames can be any slug, e.g. `daily-brief-2025-09-04.json`.
