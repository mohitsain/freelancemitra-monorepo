/**
 * API client for FreelanceMitra backend. Uses cookies from the extension's
 * host permission so the user must be logged in on the website first.
 */

const API_CONFIG = window.EXT_CONFIG || {
  BASE_URL: 'http://localhost:3000',
  API_PREFIX: '/api/backend',
};

function getBaseUrl() {
  try {
    const u = new URL(API_CONFIG.BASE_URL);
    return u.origin;
  } catch {
    return 'http://localhost:3000';
  }
}

/** NextAuth session cookie name (HTTPS uses __Secure- prefix). */
function isSessionCookie(c) {
  return (
    c.name === 'next-auth.session-token' ||
    c.name === '__Secure-next-auth.session-token'
  );
}

/** Build list of origins to try (same as getCookieHeader). */
function getOriginsToTry() {
  const base = getBaseUrl();
  const originsToTry = [base];
  try {
    const u = new URL(base);
    if (u.hostname === 'localhost') {
      if (u.port === '3000') {
        originsToTry.push('http://localhost');
        originsToTry.push('http://127.0.0.1:3000');
      } else if (!u.port || u.port === '80') {
        originsToTry.push('http://localhost:3000');
        originsToTry.push('http://127.0.0.1');
      }
    } else if (u.hostname === '127.0.0.1') {
      if (u.port === '3000') {
        originsToTry.push('http://localhost:3000');
        originsToTry.push('http://127.0.0.1');
      } else if (!u.port || u.port === '80') {
        originsToTry.push('http://localhost');
        originsToTry.push('http://localhost:3000');
      }
    }
  } catch (_) {}
  return originsToTry;
}

/**
 * Get cookies for our origin. Tries primary (BASE_URL) then alternate origins
 * (e.g. http://localhost when BASE_URL is http://localhost:3000).
 * Tries each URL with and without trailing slash (Chrome can be strict).
 * Returns { cookieHeader, requestOrigin } so the API is called on the same origin that has the session.
 */
async function getCookieHeader() {
  const base = getBaseUrl();
  const originsToTry = getOriginsToTry();
  const urlSuffixes = ['/', ''];

  for (const origin of originsToTry) {
    for (const suffix of urlSuffixes) {
      const url = origin + suffix;
      const cookies = await chrome.cookies.getAll({ url });
      const hasSession = cookies.some(isSessionCookie);
      if (cookies.length && hasSession) {
        return {
          cookieHeader: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
          requestOrigin: origin,
        };
      }
    }
  }
  for (const origin of originsToTry) {
    const cookies = await chrome.cookies.getAll({ url: origin + '/' });
    if (cookies.length) {
      return {
        cookieHeader: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
        requestOrigin: origin,
      };
    }
  }
  const cookies = await chrome.cookies.getAll({ url: base + '/' });
  return {
    cookieHeader: cookies.map((c) => `${c.name}=${c.value}`).join('; '),
    requestOrigin: base,
  };
}

const FETCH_TIMEOUT_MS = 8000;

/**
 * Find a tab that has FreelanceMitra open (same origin as BASE_URL). Required so we can
 * run fetch from the page context and send cookies (extension cannot set Cookie header).
 */
async function findSiteTab() {
  const origins = getOriginsToTry();
  const urlPatterns = origins.map((o) => o + '/*');
  const tabs = await chrome.tabs.query({ url: urlPatterns });
  return tabs[0]?.id ?? null;
}

/**
 * Inject the content script into the tab so it can run fetch with cookies.
 * Needed when the tab was open before the extension was loaded/reloaded (Chrome doesn't auto-inject into existing tabs).
 */
async function ensureContentScriptInTab(tabId) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content-site.js'],
    });
  } catch (_) {}
}

/**
 * Ask the content script on a FreelanceMitra tab to fetch /api/auth/session (cookies sent by browser).
 */
function getSessionViaTab(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, { type: 'FETCH_SESSION' }, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message || 'Content script not ready'));
        return;
      }
      if (response?.ok && response?.data?.user) resolve(response.data);
      else resolve(null);
    });
  });
}

/**
 * Ask the content script on a FreelanceMitra tab to fetch an API path (cookies sent by browser).
 */
function apiFetchViaTab(tabId, path, options = {}) {
  const fullPath = API_CONFIG.API_PREFIX + path;
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tabId,
      { type: 'FETCH_API', path: fullPath, method: options.method || 'GET', body: options.body },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message || 'Content script not ready'));
          return;
        }
        if (!response?.ok) {
          reject(new Error(response?.error || 'Request failed'));
          return;
        }
        resolve({ status: response.status, data: response.data, text: response.text });
      }
    );
  });
}

/**
 * GET NextAuth session via a FreelanceMitra tab. Returns { session, noTab } so the UI can show "Open site in a tab" when noTab.
 * If the content script isn't in the tab (e.g. tab was open before extension load), we inject it so you don't have to reload the tab.
 */
async function getSession() {
  const tabId = await findSiteTab();
  if (!tabId) return { session: null, noTab: true };
  const tryOnce = async () => {
    const session = await Promise.race([
      getSessionViaTab(tabId),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), FETCH_TIMEOUT_MS)),
    ]);
    return session ?? null;
  };
  try {
    const session = await tryOnce();
    if (session) return { session, noTab: false };
  } catch (e) {
    const notReady = /Receiving end does not exist|Content script not ready/i.test(e?.message || '');
    if (notReady) {
      await ensureContentScriptInTab(tabId);
      await new Promise((r) => setTimeout(r, 300));
      try {
        const session = await tryOnce();
        return { session: session ?? null, noTab: false };
      } catch (_) {}
    }
  }
  return { session: null, noTab: false };
}

/**
 * Fetch API via a FreelanceMitra tab (cookies sent by browser). Fails if no tab open.
 * Injects content script if missing (tab was open before extension load) so you don't have to reload.
 */
async function apiFetch(path, options = {}) {
  const tabId = await findSiteTab();
  if (!tabId) {
    const e = new Error('Open FreelanceMitra in a tab first (e.g. ' + getBaseUrl() + '), then try again.');
    e.code = 'NO_TAB';
    throw e;
  }
  const doFetch = () =>
    Promise.race([
      apiFetchViaTab(tabId, path, options),
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error('Connection timed out')), FETCH_TIMEOUT_MS)
      ),
    ]);
  let res;
  try {
    res = await doFetch();
  } catch (e) {
    const notReady = /Receiving end does not exist|Content script not ready/i.test(e?.message || '');
    if (notReady) {
      await ensureContentScriptInTab(tabId);
      await new Promise((r) => setTimeout(r, 300));
      res = await doFetch();
    } else {
      throw e;
    }
  }
  if (res.status >= 400 && res.status !== 401) {
    const err = new Error(res.data?.error?.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return new Response(JSON.stringify(res.data), { status: res.status, headers: { 'Content-Type': 'application/json' } });
}

/**
 * GET onboarding status. Returns { completed, completed_at } or throws.
 */
async function getOnboardingStatus() {
  const res = await apiFetch('/onboarding/status');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to get onboarding status');
  const json = await res.json();
  if (!json.success || !json.data) throw new Error('Invalid response');
  return json.data;
}

/**
 * POST generate proposal. Body: { job_description, client_name?, platform?, job_budget?, hourly_rate? }.
 * Returns { proposal, id }.
 */
async function generateProposal(body) {
  const res = await apiFetch('/proposals/generate', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (res.status === 401) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to generate proposal');
  }
  const json = await res.json();
  if (!json.success || !json.data) throw new Error('Invalid response');
  return json.data;
}

/**
 * GET onboarding payload (for filling Upwork profile).
 */
async function getOnboarding() {
  const res = await apiFetch('/onboarding');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to get onboarding');
  const json = await res.json();
  if (!json.success) throw new Error('Invalid response');
  return json.data;
}

window.FreelanceMitraAPI = {
  getSession,
  getOnboardingStatus,
  generateProposal,
  getOnboarding,
  getBaseUrl,
};
