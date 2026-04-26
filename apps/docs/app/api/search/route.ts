import { source } from '@/app/source';
import { createFromSource } from 'fumadocs-core/search/server';

// Provides the GET handler for fumadocs built-in search.
// Note: API routes are not available in static export mode (GITHUB_PAGES=true).
// For static deployments, search will be unavailable unless switched to
// type: 'static' in the RootProvider search config.
export const { GET } = createFromSource(source);
