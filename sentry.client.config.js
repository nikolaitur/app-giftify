// This file configures the intialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://9b3d0f4fd43449f08cf3424d548e8f7a@o1104849.ingest.sentry.io/6132233'
});
