/**
 * Extension config – base URL of FreelanceMitra website (same origin as where user logs in).
 * Use your production URL, or http://localhost:3000 (dev) or http://localhost (e.g. Docker on port 80).
 * If you use localhost, the extension will try both port 3000 and port 80 for session cookies.
 */
const CONFIG = {
  // Where you open the site; e.g. https://app.freelancemitra.com or http://localhost:3000 or http://localhost
  BASE_URL: 'http://localhost:3000',
  // Frontend proxy: /api/backend/* → backend /api/v1/*
  API_PREFIX: '/api/backend',
};

// For use in service worker / non-module scripts
typeof globalThis !== 'undefined' && (globalThis.EXT_CONFIG = CONFIG);
