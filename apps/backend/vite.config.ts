import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      // tailwindcss(), sentry(), ...
      tanstackStart({
        tsr: {
          srcDirectory: 'src',
        },
      }),
    ],
  }
})
