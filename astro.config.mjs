// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  site: 'https://truejoybirthing.com',
  integrations: [sitemap()]
});