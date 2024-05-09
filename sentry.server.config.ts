// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { env } from "./utils/env";

Sentry.init({
  enabled: env.NODE_ENV === 'production',
  dsn: "https://16e4440b490540c0b042d885569e6356@o285360.ingest.sentry.io/6056256",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
