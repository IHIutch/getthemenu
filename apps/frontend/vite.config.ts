import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import dotenv from "dotenv"
import tailwindcss from '@tailwindcss/vite'


export default defineConfig(({ mode }) => {
  if (typeof document === 'undefined') {
    dotenv.config({ override: true })
  }

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
    ]
  }
})