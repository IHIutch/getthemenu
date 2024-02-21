import * as Sentry from "@sentry/nextjs";
import { env } from "./utils/env";

Sentry.init({
  enabled: env.NODE_ENV === 'production',
  dsn: "https://f095985424404c739303ed94e194280f@o285360.ingest.sentry.io/1780563",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.1,

  // ...

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
