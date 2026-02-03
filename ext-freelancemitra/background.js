'use strict';

const CONFIG = globalThis.EXT_CONFIG || {
  BASE_URL: 'http://localhost:3000',
  API_PREFIX: '/api/backend/v1',
};

// Open side panel when extension icon is clicked
chrome.action?.onClicked?.addListener(async () => {
  try {
    const win = await chrome.windows.getCurrent();
    await chrome.sidePanel.open({ windowId: win.id });
  } catch (_) {}
});

// Show side panel when user clicks the extension icon
chrome.sidePanel?.setPanelBehavior?.({ openPanelOnActionClick: true }).catch(() => {});
