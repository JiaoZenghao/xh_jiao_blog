// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    // Preserve pre-v7 HTML whitespace handling between inline elements.
    compressHTML: true,
    site: 'https://github.com/JiaoZenghao',
    base: '/xh_jiao_blog',
});
