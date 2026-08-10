import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from './config.js';

// SERVER-ONLY. This client holds a write token and must never be imported into
// browser/frontend code — only serverless functions (e.g. api/*). The read-only
// client for the site lives in ./client.ts. useCdn must be false for mutations.
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
