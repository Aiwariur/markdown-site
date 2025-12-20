---
title: "v1.7 to v1.10 - Mobile menu, scroll-to-top, and fork configuration"
description: "New features for mobile navigation, scroll-to-top button, fork configuration documentation, sharing content with AI tools, and improved table styling."
date: "2025-12-20"
slug: "raw-markdown-and-copy-improvements"
published: true
tags: ["features", "markdown", "updates", "mobile", "configuration"]
readTime: "5 min read"
featured: true
featuredOrder: 1
image: "/images/v17.png"
excerpt: "Mobile menu, scroll-to-top button, fork configuration, raw markdown files, and Generate Skill for AI agents."
---

## Fork configuration (v1.10.0)

When you fork this project, update these files with your site information:

| File                                | What to update                                              |
| ----------------------------------- | ----------------------------------------------------------- |
| `src/pages/Home.tsx`                | Site name, title, intro, bio, featured config, logo gallery |
| `convex/http.ts`                    | `SITE_URL`, `SITE_NAME` (API responses, sitemap)            |
| `convex/rss.ts`                     | `SITE_URL`, `SITE_TITLE`, `SITE_DESCRIPTION` (RSS feeds)    |
| `src/pages/Post.tsx`                | `SITE_URL`, `SITE_NAME`, `DEFAULT_OG_IMAGE` (OG tags)       |
| `index.html`                        | Title, meta description, OG tags, JSON-LD                   |
| `public/llms.txt`                   | Site name, URL, description                                 |
| `public/robots.txt`                 | Sitemap URL                                                 |
| `public/openapi.yaml`               | Server URL, site name in examples                           |
| `public/.well-known/ai-plugin.json` | Site name, descriptions                                     |

These constants affect RSS feeds, API responses, sitemaps, and social sharing metadata.

## Scroll-to-top button (v1.9.0)

A scroll-to-top button now appears after scrolling 300px. Configure it in `src/components/Layout.tsx`:

```typescript
const scrollToTopConfig: Partial<ScrollToTopConfig> = {
  enabled: true, // Set to false to disable
  threshold: 300, // Show after scrolling 300px
  smooth: true, // Smooth scroll animation
};
```

The button uses the Phosphor ArrowUp icon and works with all four themes. It uses a passive scroll listener for performance and includes a fade-in animation.

## Mobile menu (v1.8.0)

The site now includes a mobile menu with hamburger navigation for smaller screens. On mobile and tablet views, a hamburger icon appears in the top navigation. Tap it to open a slide-out drawer with all page navigation links.

**Features:**

- Smooth CSS transform animations
- Keyboard accessible (press Escape to close)
- Focus trap for screen reader support
- Home link at the bottom of the drawer
- Auto-closes when navigating to a new page

The desktop navigation remains unchanged. The mobile menu only appears on screens below 1024px.

## Static raw markdown files

Every published post and page now gets a static `.md` file at `/raw/{slug}.md`. These files are generated automatically when you run `npm run sync`.

**Example URLs:**

- `/raw/setup-guide.md`
- `/raw/about.md`
- `/raw/how-to-publish.md`

Each file includes a metadata header with type, date, reading time, and tags. The content matches exactly what you see on the page.

**Use cases:**

- Share raw markdown with AI agents
- Link directly to source content for LLM ingestion
- View the markdown source of any post

## View as Markdown in CopyPageDropdown

The Copy Page dropdown now includes a "View as Markdown" option. Click it to open the raw `.md` file in a new tab.

This joins the existing options:

- Copy page (copies formatted markdown to clipboard)
- Open in ChatGPT
- Open in Claude
- Open in Perplexity (new)

## Perplexity integration

Perplexity is now available as an AI service option. Click "Open in Perplexity" to send the full article content directly to Perplexity for research and analysis.

Like the other AI options, if the URL gets too long, the content is copied to your clipboard and Perplexity opens in a new tab. Paste to continue.

## Featured images

Posts and pages can now include a featured image that displays in the card view on the homepage.

Add to your frontmatter:

```yaml
image: "/images/my-thumbnail.png"
featured: true
featuredOrder: 1
```

The image displays as a square thumbnail above the title in card view. Non-square images are automatically cropped to center. Recommended size: 400x400px minimum (800x800px for retina).

## Improved markdown table styling

Tables now render with GitHub-style formatting across all four themes:

| Feature | Status                  |
| ------- | ----------------------- |
| Borders | Clean lines             |
| Mobile  | Horizontal scroll       |
| Hover   | Row highlighting        |
| Themes  | Dark, light, tan, cloud |

Tables adapt to each theme with proper alternating row colors and hover states.

## Generate Skill

The CopyPageDropdown now includes a Generate Skill option. Click it to download the current post or page as an AI agent skill file.

The skill file includes:

- Metadata section with title, description, and tags
- When to use section describing scenarios for the skill
- Instructions section with the full content

The file downloads as `{slug}-skill.md`. Use these skill files to train AI agents or add context to your workflows.

## Summary

These updates improve navigation, configuration, and sharing with AI tools:

1. **Fork configuration** documentation for all 9 site files
2. **Scroll-to-top button** with configurable threshold
3. **Mobile menu** with slide-out drawer for smaller screens
4. **Raw markdown files** at `/raw/{slug}.md` for direct access
5. **View as Markdown** option in CopyPageDropdown
6. **Perplexity** added alongside ChatGPT and Claude
7. **Generate Skill** for AI agent training
8. **Featured images** for visual card layouts
9. **Better tables** with responsive styling

All features work across all four themes and are mobile responsive. Run `npm run sync` for development and `npm run sync:prod` for production to update your site with these changes.
