#!/bin/bash

prettier --write {apps,packages}/*/{src,tests}/**/*.{ts,tsx,js,jsx,svelte} \
  {apps}/*/{next.config.ts,postcss.config.mjs,vite.config.ts,svelte.config.js}
 



#  apps/*/{src,tests}/**/*.{ts,svelte} \
#  packages/*/{tailwind.config.js,postcss.config.cjs,vite.config.ts,svelte.config.js} \
#  apps/*/{tailwind.config.js,postcss.config.cjs,vite.config.ts,svelte.config.js}