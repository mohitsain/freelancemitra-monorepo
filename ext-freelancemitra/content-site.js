'use strict';

/**
 * Runs on FreelanceMitra pages. Fetches /api/auth/session and /api/backend/* from the
 * page context so the browser sends cookies automatically (Cookie header cannot
 * be set by the extension from the side panel).
 */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'FETCH_SESSION') {
    fetch(window.location.origin + '/api/auth/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => sendResponse({ ok: true, data }))
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }
  if (msg.type === 'FETCH_API') {
    const { path, method, body } = msg;
    const url = window.location.origin + (path || '');
    const opts = { method: method || 'GET', credentials: 'include' };
    if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = typeof body === 'string' ? body : JSON.stringify(body);
    }
    fetch(url, opts)
      .then(async (res) => {
        const text = await res.text();
        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = null;
        }
        sendResponse({ ok: true, status: res.status, data, text });
      })
      .catch((err) => sendResponse({ ok: false, error: err.message }));
    return true;
  }
});
