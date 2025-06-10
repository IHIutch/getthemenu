import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [
      tsconfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tanstackStart({
        tsr: {
          srcDirectory: 'src',
        },
      }),
      tailwindcss(),
    ],
  }
})
