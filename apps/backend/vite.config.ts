import { defineConfig, loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { isServer } from '@tanstack/react-query'
import dotenv from "dotenv"


export default defineConfig(({ mode }) => {
  if (isServer) {
    dotenv.config({ override: true })
  }

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
      })
    ]
  }
})