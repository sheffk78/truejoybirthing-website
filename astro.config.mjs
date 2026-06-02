// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { cities } from './src/data/cities';

// Build a lookup: city page URL → publishedDate
const cityLastmod = {};
Object.entries(cities).forEach(([slug, data]) => {
  if (data.publishedDate) {
    cityLastmod[`https://truejoybirthing.com/birth-support/${slug}/`] = data.publishedDate;
  }
});

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: 'https://truejoybirthing.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404') && !page.includes('/admin/'),
      serialize(item) {
        // Per-city lastmod from publishedDate field in cities data
        const cityDate = cityLastmod[item.url];
        if (cityDate) {
          item.lastmod = new Date(cityDate);
        } else if (item.url.includes('/birth-support/')) {
          // City pages without publishedDate: omit lastmod so Google uses its own crawl date
          delete item.lastmod;
        }
        // Hompage: priority 1.0, changefreq daily
        if (item.url === 'https://truejoybirthing.com/' || item.url === 'https://truejoybirthing.com') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }

        const path = new URL(item.url).pathname;

        // Core landing pages: priority 0.9, changefreq monthly
        const coreLandingPages = [
          '/birth-plan-template/',
          '/joyful-birth-plan/',
          '/guided-birth-plan-walkthrough/',
          '/birth-plan-confidence-session/',
        ];
        if (coreLandingPages.includes(path)) {
          return { ...item, priority: 0.9, changefreq: 'monthly' };
        }

        // Blog posts & blog index: priority 0.8, changefreq weekly
        if (path.startsWith('/blog/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }

        // Location/city pages: priority 0.8, changefreq weekly
        if (path.startsWith('/birth-support/')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }

        // Utility pages: priority 0.3, changefreq yearly
        const utilityPages = ['/terms/', '/privacy/', '/faq/', '/contact/'];
        if (utilityPages.includes(path)) {
          return { ...item, priority: 0.3, changefreq: 'yearly' };
        }

        // Everything else: default priority 0.7, changefreq weekly
        return { ...item, priority: 0.7, changefreq: 'weekly' };
      },
    })
  ]
});