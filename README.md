# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
### Manual JSON archive for News (optional)

You can add News articles via flat JSON files (useful when CMS is offline or for quick imports). Place files under `app/archive/news/*.json` with this shape:

```
{
	"news": [
		{
			"id": "string-or-number",
			"title": "...",
			"date": "YYYY-MM-DD",
			"displayDate": "Readable date (optional)",
			"summary": "...",
			"category": "Technology | Policy | Business | Global Economy | ...",
			"tags": ["Technology", "AI & ML"],
			"image": "https://..." ,
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
- The app automatically loads these files on first visit to the News page.
- CMS changes continue to work; JSON is simply merged in and de-duplicated by `id`.
- You can use `contentHtml` or `content`.
- Keep filenames descriptive, e.g. `2025-09-25.json`.

docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
