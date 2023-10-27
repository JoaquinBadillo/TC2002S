import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import node from "@astrojs/node";

export default defineConfig({
  site: 'https://joaquinbadillo.github.io',
  base: '/TC2002S',
  integrations: [preact()],
  output: "server",
  adapter: node({
	mode: "standalone"
  })
});