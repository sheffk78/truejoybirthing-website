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

// Build a slug -> lastmod date map for static .astro pages from file mtime
const pagesDir = path.resolve('./src/pages');
const pageDates = {};
function scanPages(dir, basePath = '') {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanPages(fullPath, basePath + entry.name + '/');
    } else if (entry.name.endsWith('.astro') || entry.name.endsWith('.md')) {
      const slug = entry.name.replace(/\.(astro|md)$/, '');
      const urlPath = basePath + (slug === 'index' ? '' : slug);
      const stat = fs.statSync(fullPath);
      pageDates[urlPath] = stat.mtime.toISOString();
    }
  }
}
scanPages(pagesDir);

// Fallback lastmod: build date (so every sitemap entry has a lastmod)
const buildDate = new Date().toISOString();

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  trailingSlash: 'always',
  site: 'https://truejoybirthing.com',
  integrations: [
    sitemap({
      // No global lastmod — each URL gets its own from serialize()
      filter: (page) => !page.includes('/404') && !page.includes('/admin/') && !page.includes('/dashboard'),
      serialize(item) {
        const parsed = new URL(item.url);
        const pathname = parsed.pathname;
        const stripSlash = (s) => s.replace(/^\/|\/$/g, '');

        // Homepage: priority 1.0, changefreq daily
        if (item.url === 'https://truejoybirthing.com/' || item.url === 'https://truejoybirthing.com') {
          return { ...item, priority: 1.0, changefreq: 'daily', lastmod: pageDates[''] || buildDate };
        }

        // Core landing pages: priority 0.9, changefreq monthly
        const coreLandingPages = [
          '/birth-plan-template/',
          '/joyful-birth-plan/',
          '/guided-birth-plan-walkthrough/',
          '/birth-plan-confidence-session/',
        ];
        if (coreLandingPages.includes(pathname)) {
          const key = stripSlash(pathname);
          return { ...item, priority: 0.9, changefreq: 'monthly', lastmod: pageDates[key] || buildDate };
        }

        // Blog index: priority 0.8
        if (pathname === '/blog/') {
          return { ...item, priority: 0.8, changefreq: 'weekly', lastmod: buildDate };
        }

        // Blog posts: priority 0.8, lastmod from frontmatter date
        if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
          const slug = pathname.replace('/blog/', '').replace(/\/$/, '');
          const blogDate = blogDates[slug];
          return { ...item, priority: 0.8, changefreq: 'weekly', lastmod: blogDate || buildDate };
        }

        // City pages: priority 0.6, lastmod from publishedDate in cities.ts
        if (pathname.startsWith('/birth-support/') && pathname !== '/birth-support/') {
          const slug = pathname.replace('/birth-support/', '').replace(/\/$/, '');
          // State hub pages (2-letter codes like /tx/, /ca/): use build date
          if (/^[a-z]{2}$/.test(slug)) {
            return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: buildDate };
          }
          const cityDate = cityDates[slug];
          return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: cityDate || buildDate };
        }

        // Birth-support index: priority 0.6
        if (pathname === '/birth-support/') {
          return { ...item, priority: 0.6, changefreq: 'monthly', lastmod: pageDates['birth-support'] || buildDate };
        }

        // Utility pages: priority 0.3, changefreq yearly
        const utilityPages = ['/terms/', '/privacy/', '/faq/', '/contact/'];
        if (utilityPages.includes(pathname)) {
          const key = stripSlash(pathname);
          return { ...item, priority: 0.3, changefreq: 'yearly', lastmod: pageDates[key] || buildDate };
        }

        // Everything else: priority 0.7, changefreq weekly
        const key = stripSlash(pathname);
        return { ...item, priority: 0.7, changefreq: 'weekly', lastmod: pageDates[key] || buildDate };
      },
    })
  ]
});