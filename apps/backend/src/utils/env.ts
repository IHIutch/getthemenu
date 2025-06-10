import { createEnv } from '@t3-oss/env-core'
import { vercel } from '@t3-oss/env-core/presets-zod'
import { isServer } from '@tanstack/react-query'
import { z } from 'zod'

export const env = createEnv({
  isServer,
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',
  server: {
    // # Prisma
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_SIGNING_SECRET: z.string().min(1),
    // # Vercel
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_SDK_TOKEN: z.string().min(1),

    // # Test
    TEST_HOST: z.string().optional(),

    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_URL: z.string().min(1).url(),
  },

  client: {
    // # Misc
    VITE_ROOT_DOMAIN: z.string().min(1),
    // # Sentry
    VITE_SENTRY_DSN: z.string().min(1),
    // # Stripe
    VITE_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },

  extends: [vercel()],

  /**
   * What object holds the environment variables at runtime. This is usually
   * `process.env` or `import.meta.env`.
   */
  runtimeEnv: process.env,

  /**
   * By default, this library will feed the environment variables directly to
   * the Zod validator.
   *
   * This means that if you have an empty string for a value that is supposed
   * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
   * it as a type mismatch violation. Additionally, if you have an empty string
   * for a value that is supposed to be a string with a default value (e.g.
   * `DOMAIN=` in an ".env" file), the default value will never be applied.
   *
   * In order to solve these issues, we recommend that all new projects
   * explicitly specify this option as true.
   */
  emptyStringAsUndefined: true,
})
