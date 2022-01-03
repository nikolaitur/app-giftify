// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://9b3d0f4fd43449f08cf3424d548e8f7a@o1104849.ingest.sentry.io/6132233'
});
