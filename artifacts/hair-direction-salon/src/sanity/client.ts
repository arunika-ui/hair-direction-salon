import { createClient } from '@sanity/client';
import { projectId, dataset, apiVersion } from './config';

// Read-only, browser-safe client. useCdn serves cached, published content
// (fast, and all we need for a public marketing site).
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
