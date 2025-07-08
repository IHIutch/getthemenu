import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
// import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(() => {
  return {
    plugins: [
      // tsconfigPaths({
      //   projects: ['./tsconfig.json'],
      // }),
      // tailwindcss(), sentry(), ...
      tanstackStart({
        target: 'vercel',
        tsr: {
          srcDirectory: 'src',
        },
      }),
      Icons({
        compiler: 'jsx',
        jsx: 'react',
      }),
    ],
  }
})
