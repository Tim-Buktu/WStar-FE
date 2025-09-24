import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("contact", "routes/contact.tsx"),
  route("services", "routes/services.tsx"),
  route("research", "routes/research.tsx"),
  route("news", "routes/news.tsx"),
  route("newsroom", "routes/newsroom.tsx"),
  route("newsletter/:id", "routes/newsletter.$id.tsx"),
  route("wip", "routes/wip.tsx"),
] satisfies RouteConfig;
