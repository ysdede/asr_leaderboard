import { defineConfig } from '@solidjs/start/config'

export default defineConfig({
  ssr: true,
  server: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },
})
