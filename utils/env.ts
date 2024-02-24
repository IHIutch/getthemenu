/* eslint-disable sort-keys */
import { createEnv } from "@t3-oss/env-nextjs";
import { ZodError, z } from 'zod'

/*eslint sort-keys: "error"*/
export const env = createEnv({
  server: {
    // # Prisma
    POSTGRES_PRISMA_URL: z.string().url(),
    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_SIGNING_SECRET: z.string().min(1),
    // # Vercel
    VERCEL_PROJECT_ID: z.string().min(1),
    VERCEL_BEARER_TOKEN: z.string().min(1),
    VERCEL_PROD_BEARER_TOKEN: z.string().min(1),

    // # Test
    TEST_HOST: z.string().optional()
  },
  client: {
    // # Supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_URL: z.string().min(1).url(),
    // # Misc
    NEXT_PUBLIC_HOSTNAME: z.string().min(1),

    // # Sentry
    NEXT_PUBLIC_SENTRY_DSN: z.string().min(1),
    // # Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  },
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    BASE_URL: z.string().url()
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    BASE_URL: process.env.NODE_ENV === 'production'
      ? `https://${process.env.NEXT_PUBLIC_HOSTNAME}`
      : `http://localhost:3000`,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_HOSTNAME: process.env.NEXT_PUBLIC_HOSTNAME,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
  onValidationError: (error: ZodError) => {
    console.error(
      "❌ Invalid environment variables:",
      error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  },
  // Called when server variables are accessed on the client.
  onInvalidAccess: () => {
    throw new Error(
      "❌ Attempted to access a server-side environment variable on the client"
    );
  }
})
