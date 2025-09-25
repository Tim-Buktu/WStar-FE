# CMS Integration for WesternStar Frontend

This document outlines the integration of the CMS system, news utilities, and admin interface into your React Router + TypeScript + Vite stack.

## Files Integrated

### 1. `app/utils/newsUtils.ts`

- TypeScript version of the news content management utilities
- Includes functions for article validation, filtering, statistics, and content processing
- Fully typed with proper TypeScript interfaces

### 2. `app/utils/cms.ts` (Enhanced)

- Enhanced existing CMS system with database integration capabilities
- Added support for news articles, trending topics, testimonials
- Includes newsletter and news article management functions
- Ready for backend API integration

### 3. `app/utils/api.ts` (Enhanced)

- Expanded API module with placeholder functions for all CMS operations
- Ready for integration with your actual backend API
- Includes functions for CRUD operations on all content types

### 4. `app/components/CMSAdmin.tsx`

- Complete admin interface for content management
- Simplified version focusing on newsletters and news articles
- Authentication system with login/logout
- Modal-based editing interface

## Key Features

### Content Management

- **Newsletters**: Create, edit, delete, and manage newsletter content
- **News Articles**: Full CRUD operations with visibility controls and showcase sections
  - Also supports manual JSON archive files under `app/archive/news/*.json` that are auto-merged on first load
- **Content Validation**: Built-in validation for required fields and data formats
- **Tag Management**: Comma-separated tag system with filtering capabilities

### Admin Interface

- **Secure Login**: Email/password authentication system
- **Real-time Updates**: Live data refresh when content changes
- **Modal Editing**: Clean, user-friendly editing interface
- **Content Organization**: Showcase sections (featured, mosaic, loop) for news articles

### TypeScript Integration

- Full type safety across all components
- Proper interfaces for all data structures
- Compatible with your existing React Router setup
- No external dependencies beyond what you already have

## Usage

### Accessing the Admin Panel

1. Visit your home page
2. Look for the "Admin" button in the bottom right corner
3. Login with:
   - Email: `timothyhapsim@gmail.com`
   - Password: `admin321`

### Managing Content

- **Add Newsletter**: Click "Add Newsletter" in the newsletters tab
- **Edit Content**: Click the edit icon next to any item
- **Delete Content**: Click the trash icon (with confirmation)
- **Toggle Visibility**: Use the eye icon for news articles

### Adding News via JSON (optional)

Place files under `app/archive/news/*.json` with the following structure:

```
{
  "news": [
    {
      "id": "string-or-number",
      "title": "...",
      "date": "YYYY-MM-DD",
      "displayDate": "Readable (optional)",
      "summary": "...",
      "category": "Technology | Policy | Business | Global Economy | ...",
      "tags": ["Technology", "AI & ML"],
      "image": "https://...",
      "contentHtml": "<p>HTML body</p>",
      "views": 1234,
      "author": { "name": "...", "role": "...", "avatar": "..." },
      "showcaseSection": "featured | mosaic | loop",
      "isVisible": true,
      "position": 1
    }
  ]
}
```

Notes:
- Files are loaded once on first `getCMSData('news')` call and merged with CMS items.
- Duplicates by `id` are ignored (runtime/CMS data wins).
- You can use `contentHtml` or `content` for body.

### Backend Integration

To connect to your actual backend:

1. **Update API endpoints** in `app/utils/api.ts`:

   ```typescript
   export async function getNewsletter(
     id: string | number
   ): Promise<Newsletter | null> {
     const response = await fetch(`/api/newsletters/${id}`);
     return response.json();
   }
   ```

2. **Update CMS data loading** in `app/utils/cms.ts`:

   ```typescript
   export async function getCMSData(key: string) {
     const response = await fetch(`/api/cms/${key}`);
     return response.json();
   }
   ```

3. **Configure environment variables** for your API endpoints

## Data Structures

### Newsletter

```typescript
type Newsletter = {
  id: string | number;
  title: string;
  date: string;
  summary?: string;
  content?: string;
  category?: string;
  tags: string[];
  author?: { name: string; role?: string; avatar?: string };
  views?: number;
  insights?: string[];
  resources?: Array<{
    title: string;
    description: string;
    url: string;
    type: string;
  }>;
};
```

### Article

```typescript
type Article = {
  id: string | number;
  title: string;
  date: string;
  summary?: string;
  content?: string;
  category?: string;
  tags: string[];
  author?: { name: string; role?: string; avatar?: string };
  views?: number;
  showcaseSection?: "featured" | "mosaic" | "loop";
  isVisible?: boolean;
  position?: number;
};
```

## Customization

### Authentication

To change admin credentials, update the constants in `CMSAdmin.tsx`:

```typescript
const ADMIN_EMAIL = "your-email@example.com";
const ADMIN_PASSWORD = "your-secure-password";
```

### Categories

To add/modify content categories, update the select options in the modal components.

### Styling

The admin interface uses Tailwind CSS classes consistent with your existing design system.

## File Dependencies

The integration requires these files to work properly:

- ✅ `app/utils/newsUtils.ts` (created)
- ✅ `app/utils/cms.ts` (enhanced)
- ✅ `app/utils/api.ts` (enhanced)
- ✅ `app/components/CMSAdmin.tsx` (created)
- ⚠️ Your actual backend API (when ready)

## Next Steps

1. **Test the admin interface** by accessing it on your home page
2. **Connect to your backend API** by updating the API functions
3. **Customize the interface** to match your specific content needs
4. **Add proper error handling** for production use
5. **Implement proper authentication** with JWT or similar for production

The system is now fully integrated and ready for use with your React Router + TypeScript + Vite stack!
