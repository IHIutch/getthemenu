import type { StandardSchemaV1 } from '@t3-oss/env-core'

import { createEnv } from '@t3-oss/env-core'
import { vercel } from '@t3-oss/env-core/presets-zod'
import dotenv from 'dotenv'
import process from 'node:process'
import { z } from 'zod'

if (typeof window === 'undefined') {
  dotenv.config({ override: true })
}

process.env = {
  ...import.meta.env,
  ...process.env,
}

export const env = createEnv({
  isServer: typeof window === 'undefined',
  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',
  server: {
    // # Prisma
    POSTGRES_PRISMA_URL: z.string().url(),
    POSTGRES_URL_NON_POOLING: z.string().url(),
  },

  client: {
    // # Misc
    VITE_ROOT_DOMAIN: z.string().min(1),
    // # Sentry
    VITE_SENTRY_DSN: z.string().min(1),
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
  emptyStringAsUndefined: false,
  onValidationError: (issues: readonly StandardSchemaV1.Issue[]) => {
    console.error(
      '❌ Invalid environment variables:',
      issues,
    )
    throw new Error('Invalid environment variables')
  },
})
