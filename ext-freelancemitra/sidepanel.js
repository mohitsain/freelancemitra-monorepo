'use strict';

const API = window.FreelanceMitraAPI;

const els = {
  loading: document.getElementById('loading'),
  loadingMessage: document.getElementById('loading-message'),
  gateLogin: document.getElementById('gate-login'),
  gateOnboarding: document.getElementById('gate-onboarding'),
  gateError: document.getElementById('gate-error'),
  errorTitle: document.getElementById('error-title'),
  errorMessage: document.getElementById('error-message'),
  btnRetry: document.getElementById('btn-retry'),
  main: document.getElementById('main'),
  btnOpenSite: document.getElementById('btn-open-site'),
  btnOpenOnboarding: document.getElementById('btn-open-onboarding'),
  optUpworkOnboard: document.getElementById('opt-upwork-onboard'),
  optProposal: document.getElementById('opt-proposal'),
  proposalSection: document.getElementById('proposal-section'),
  jobDescription: document.getElementById('job-description'),
  btnUseCurrentPage: document.getElementById('btn-use-current-page'),
  btnGenerate: document.getElementById('btn-generate'),
  proposalError: document.getElementById('proposal-error'),
  proposalSuccess: document.getElementById('proposal-success'),
  proposalResult: document.getElementById('proposal-result'),
  proposalActions: document.getElementById('proposal-actions'),
  btnFillUpwork: document.getElementById('btn-fill-upwork'),
};

function show(visible, ...rest) {
  [els.loading, els.gateLogin, els.gateOnboarding, els.gateError, els.main, els.proposalSection].forEach((el) => {
    if (!el) return;
    el.classList.toggle('hidden', true);
  });
  visible.forEach((el) => {
    if (el) el.classList.toggle('hidden', false);
  });
  rest.forEach((el) => {
    if (el) el.classList.toggle('hidden', false);
  });
}

function setLoadingMessage(msg) {
  if (els.loadingMessage) els.loadingMessage.textContent = msg;
}

function showError(title, message) {
  if (els.errorTitle) els.errorTitle.textContent = title;
  if (els.errorMessage) els.errorMessage.textContent = message;
  show([els.gateError]);
}

function setLinks() {
  const base = API.getBaseUrl();
  if (els.btnOpenSite) els.btnOpenSite.href = base + '/signin';
  if (els.btnOpenOnboarding) els.btnOpenOnboarding.href = base + '/onboarding';
}

const RETRY_INTERVAL_MS = 2000;
let retryIntervalId = null;

function stopRetryInterval() {
  if (retryIntervalId) {
    clearInterval(retryIntervalId);
    retryIntervalId = null;
  }
}

function startRetryInterval() {
  stopRetryInterval();
  retryIntervalId = setInterval(checkAuth, RETRY_INTERVAL_MS);
}

async function checkAuth() {
  setLinks();
  const baseUrl = API.getBaseUrl();
  setLoadingMessage('Checking login…');
  show([els.loading]);
  stopRetryInterval();
  try {
    const result = await API.getSession();
    const session = result?.session;
    const noTab = result?.noTab === true;
    if (!session?.user) {
      show([els.gateLogin]);
      const hint = document.getElementById('gate-login-hint');
      if (hint) {
        hint.textContent = noTab
          ? 'Open FreelanceMitra in a tab (e.g. ' + baseUrl + '). Status will update automatically.'
          : 'Log in on FreelanceMitra in this browser first. Set BASE_URL in config.js to the exact address you use (e.g. ' + baseUrl + ') and reload the extension.';
      }
      startRetryInterval();
      return;
    }
    const status = await API.getOnboardingStatus();
    if (!status) {
      show([els.gateLogin]);
      startRetryInterval();
      return;
    }
    if (!status.completed) {
      show([els.gateOnboarding]);
      return;
    }
    show([els.main]);
  } catch (err) {
    if (err.code === 'TIMEOUT') {
      showError(
        'Connection timed out',
        'FreelanceMitra did not respond. Make sure the site is open in this browser and BASE_URL in config.js matches exactly (e.g. http://localhost or http://localhost:3000).'
      );
      return;
    }
    if (err.code === 'NETWORK' || err.message?.includes('fetch')) {
      showError(
        'Could not reach FreelanceMitra',
        'Open the site in a tab at ' + (baseUrl || 'your BASE_URL') + ', log in, then click Try again.'
      );
      return;
    }
    showError(
      'Something went wrong',
      err.message || 'Open FreelanceMitra, log in, set BASE_URL in config.js to that URL, reload the extension, then Try again.'
    );
  }
}

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') checkAuth();
});

els.btnRetry?.addEventListener('click', () => checkAuth());

// --- Upwork onboard: fill profile from FreelanceMitra ---
els.optUpworkOnboard?.addEventListener('click', async () => {
  try {
    const data = await API.getOnboarding();
    if (!data) {
      alert('Session expired. Please log in again on FreelanceMitra.');
      return;
    }
    // Send to content script on Upwork to fill profile
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.includes('upwork.com')) {
      alert('Open an Upwork profile or signup page first, then try again.');
      return;
    }
    chrome.tabs.sendMessage(tab.id, {
      type: 'FILL_UPWORK_PROFILE',
      payload: data,
    }).then(() => {
      alert('Filling Upwork profile. Check the Upwork tab.');
    }).catch(() => {
      alert('Could not reach Upwork tab. Reload the Upwork page and try again.');
    });
  } catch (e) {
    alert(e.message || 'Failed to get profile.');
  }
});

// --- Proposal: show section ---
els.optProposal?.addEventListener('click', () => {
  els.proposalSection.classList.remove('hidden');
  els.proposalError.classList.add('hidden');
  els.proposalSuccess.classList.add('hidden');
  els.proposalResult.classList.add('hidden');
  els.btnFillUpwork.classList.add('hidden');
});

// --- Use current Upwork page job description ---
els.btnUseCurrentPage?.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes('upwork.com')) {
    els.proposalError.textContent = 'Open an Upwork job page first.';
    els.proposalError.classList.remove('hidden');
    return;
  }
  try {
    const result = await chrome.tabs.sendMessage(tab.id, { type: 'GET_JOB_DESCRIPTION' });
    if (result?.jobDescription) {
      els.jobDescription.value = result.jobDescription;
      els.proposalError.classList.add('hidden');
    } else {
      els.proposalError.textContent = 'No job description found on this page.';
      els.proposalError.classList.remove('hidden');
    }
  } catch (_) {
    els.proposalError.textContent = 'Reload the Upwork job page and try again.';
    els.proposalError.classList.remove('hidden');
  }
});

let lastGeneratedProposal = null;

els.btnGenerate?.addEventListener('click', async () => {
  const jobDescription = els.jobDescription?.value?.trim();
  if (!jobDescription) {
    els.proposalError.textContent = 'Enter or paste a job description.';
    els.proposalError.classList.remove('hidden');
    return;
  }
  els.proposalError.classList.add('hidden');
  els.proposalSuccess.classList.add('hidden');
  els.proposalResult.classList.add('hidden');
  els.btnFillUpwork.classList.add('hidden');
  els.btnGenerate.disabled = true;
  try {
    const data = await API.generateProposal({
      job_description: jobDescription,
      platform: 'Upwork',
    });
    if (!data) {
      els.proposalError.textContent = 'Session expired. Please log in again on FreelanceMitra.';
      els.proposalError.classList.remove('hidden');
      return;
    }
    lastGeneratedProposal = data.proposal;
    els.proposalResult.textContent = data.proposal;
    els.proposalResult.classList.remove('hidden');
    els.btnFillUpwork.classList.remove('hidden');
    els.proposalSuccess.textContent = 'Proposal generated. You can copy it or fill on Upwork.';
    els.proposalSuccess.classList.remove('hidden');
  } catch (e) {
    els.proposalError.textContent = e.message || 'Failed to generate proposal.';
    els.proposalError.classList.remove('hidden');
  } finally {
    els.btnGenerate.disabled = false;
  }
});

els.btnFillUpwork?.addEventListener('click', async () => {
  if (!lastGeneratedProposal) return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.includes('upwork.com')) {
    alert('Open the Upwork proposal/apply page first.');
    return;
  }
  try {
    await chrome.tabs.sendMessage(tab.id, {
      type: 'FILL_UPWORK_PROPOSAL',
      payload: { proposal: lastGeneratedProposal },
    });
    els.proposalSuccess.textContent = 'Proposal filled on Upwork. Check the tab.';
  } catch (_) {
    alert('Reload the Upwork proposal page and try again.');
  }
});

// Init
checkAuth();
