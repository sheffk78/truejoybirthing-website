// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { cities } from './src/data/cities';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

// Build a slug -> lastmod date map for blog posts from markdown frontmatter
const blogDir = path.resolve('./src/content/blog');
const blogDates = {};
if (fs.existsSync(blogDir)) {
  for (const file of fs.readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const { data } = matter(raw);
    if (data.date) {
      const d = new Date(data.date);
      if (!isNaN(d.getTime())) {
        blogDates[slug] = d.toISOString();
      }
    }
  }
}

// Build a slug -> lastmod date map for city pages from publishedDate
const cityDates = {};
for (const [slug, city] of Object.entries(cities)) {
  if (city.publishedDate) {
    const d = new Date(city.publishedDate);
    if (!isNaN(d.getTime())) {
      cityDates[slug] = d.toISOString();
    }
  }
}

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'always',
  },
  compressHTML: true,
  trailingSlash: 'always',
  site: 'https://truejoybirthing.com',
  integrations: [
    sitemap({
      // No global lastmod — each URL gets its own from serialize()
      filter: (page) => !page.includes('/404') && !page.includes('/admin/'),
      serialize(item) {
        // Homepage: priority 1.0, changefreq daily, no lastmod (Google crawls frequently)
        if (item.url === 'https://truejoybirthing.com/' || item.url === 'https://truejoybirthing.com') {
          return { ...item, priority: 1.0, changefreq: 'daily', lastmod: undefined };
        }

        const parsed = new URL(item.url);
        const pathname = parsed.pathname;

        // Core landing pages: priority 0.9, changefreq monthly, no lastmod
        const coreLandingPages = [
          '/birth-plan-template/',
          '/joyful-birth-plan/',
          '/guided-birth-plan-walkthrough/',
          '/birth-plan-confidence-session/',
        ];
        if (coreLandingPages.includes(pathname)) {
          return { ...item, priority: 0.9, changefreq: 'monthly', lastmod: undefined };
        }

        // Blog index: priority 0.8, no lastmod
        if (pathname === '/blog/') {
          return { ...item, priority: 0.8, changefreq: 'weekly', lastmod: undefined };
        }

        // Blog posts: priority 0.8, lastmod from frontmatter date
        if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
          const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
          const blogDate = blogDates[slug];
          return { ...item, priority: 0.8, changefreq: 'weekly', lastmod: blogDate || undefined };
        }

        // City pages: priority 0.6, lastmod from publishedDate in cities.ts
        if (pathname.startsWith('/birth-support/') && pathname !== '/birth-support/') {
          const slug = pathname.replace('/birth-support/', '').replace(/\/$/, '');
          // Skip state hub pages (2-letter codes like /tx/, /ca/)
          if (/^[a-z]{2}$/.test(slug)) {
            return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: undefined };
          }
          const cityDate = cityDates[slug];
          return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: cityDate || undefined };
        }

        // Birth-support index: priority 0.6, no lastmod
        if (pathname === '/birth-support/') {
          return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: undefined };
        }

        // Utility pages: priority 0.3, changefreq yearly, no lastmod
        const utilityPages = ['/terms/', '/privacy/', '/faq/', '/contact/'];
        if (utilityPages.includes(pathname)) {
          return { ...item, priority: 0.3, changefreq: 'yearly', lastmod: undefined };
        }

        // Everything else: default priority 0.7, changefreq weekly, no lastmod
        return { ...item, priority: 0.7, changefreq: 'weekly', lastmod: undefined };
      },
    })
  ]
});