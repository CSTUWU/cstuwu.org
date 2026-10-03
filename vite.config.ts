import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    // Only the pure logic under `src/lib`, `src/content` and `src/data` is
    // unit-tested. Components are verified by rendering the built site, so the
    // suite deliberately has no DOM environment and no component tests: a
    // shallow render would assert against the markup rather than the behaviour.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
