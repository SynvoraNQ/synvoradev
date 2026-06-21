import { createFileRoute } from "@tanstack/react-router";
import { BioPage } from "@/components/bio/BioPage";
import { siteConfig } from "@/config/site.config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: siteConfig.meta.title },
      { name: "description", content: siteConfig.meta.description },
      { property: "og:title", content: siteConfig.meta.title },
      { property: "og:description", content: siteConfig.meta.description },
      { property: "og:image", content: siteConfig.profile.avatarUrl },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: siteConfig.profile.avatarUrl },
      { name: "theme-color", content: siteConfig.theme.accent },
    ],
  }),
  component: BioPage,
});
