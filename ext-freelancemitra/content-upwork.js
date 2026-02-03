'use strict';

/**
 * Content script on Upwork: read job description and fill profile/proposal fields.
 * Upwork's DOM may change; these selectors are common patterns. Update if Upwork changes.
 */

// Common selectors for job description (Upwork job posting page)
const JOB_DESCRIPTION_SELECTORS = [
  '[data-test="job-description"]',
  '.job-description',
  '[data-qa="job-description"]',
  '.up-job-description',
  'section[data-cy="job-description"]',
  '.job-details-description',
  '[data-testid="job-description"]',
];

// Common selectors for proposal/cover letter textarea
const PROPOSAL_TEXTAREA_SELECTORS = [
  'textarea[data-test="proposal-cover-letter"]',
  'textarea[name="coverLetter"]',
  'textarea[placeholder*="cover letter" i]',
  'textarea[placeholder*="proposal" i]',
  '[data-qa="cover-letter"] textarea',
  '.proposal-textarea',
  'textarea.up-textarea',
];

// Profile fields mapping: FreelanceMitra onboarding field -> Upwork selector (input/textarea placeholder or label)
const PROFILE_FIELD_SELECTORS = {
  // Title / headline
  professionalTitle: [
    'input[placeholder*="title" i]',
    'input[name*="title" i]',
    '[data-qa="professional-title"]',
  ],
  // Bio / overview
  shortSummary: [
    'textarea[placeholder*="overview" i]',
    'textarea[placeholder*="bio" i]',
    'textarea[name*="overview" i]',
    '[data-qa="overview"] textarea',
  ],
  detailedDescription: [
    'textarea[placeholder*="description" i]',
    'textarea[name*="description" i]',
  ],
  // Skills: often tag inputs
  keySkills: [
    'input[placeholder*="skill" i]',
    '[data-qa="skills"] input',
    '.skills-input input',
  ],
  // Other fields can be added similarly
};

function getTextFromSelector(selectors) {
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const text = (el.value || el.textContent || '').trim();
        if (text) return text;
      }
    } catch (_) {}
  }
  return null;
}

function setValueBySelector(selectors, value) {
  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        return true;
      }
    } catch (_) {}
  }
  return false;
}

function getJobDescription() {
  for (const sel of JOB_DESCRIPTION_SELECTORS) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const text = (el.innerText || el.textContent || '').trim();
        if (text.length > 50) return text;
      }
    } catch (_) {}
  }
  // Fallback: first long paragraph or data-cy section
  const sections = document.querySelectorAll('[data-cy="job-description"], .job-description, section');
  for (const s of sections) {
    const t = (s.innerText || s.textContent || '').trim();
    if (t.length > 100) return t;
  }
  return null;
}

function fillProposalText(proposal) {
  const ok = setValueBySelector(PROPOSAL_TEXTAREA_SELECTORS, proposal);
  if (ok) return true;
  // Last resort: any visible textarea that looks like cover letter
  const textareas = document.querySelectorAll('textarea');
  for (const ta of textareas) {
    const ph = (ta.placeholder || '').toLowerCase();
    const name = (ta.name || '').toLowerCase();
    if (ph.includes('cover') || ph.includes('proposal') || name.includes('cover') || name.includes('letter')) {
      ta.focus();
      ta.value = proposal;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
  }
  return false;
}

function mapOnboardingToUpwork(data) {
  if (!data) return {};
  return {
    professionalTitle: data.professionalTitle || data.professional_title || '',
    headline: data.headline || '',
    shortSummary: data.shortSummary || data.short_summary || '',
    detailedDescription: data.detailedDescription || data.detailed_description || '',
    keySkills: Array.isArray(data.keySkills) ? data.keySkills : (data.key_skills || []),
    yearsOfExperience: data.yearsOfExperience ?? data.years_of_experience ?? 0,
  };
}

function fillUpworkProfile(payload) {
  const data = mapOnboardingToUpwork(payload);
  let filled = 0;
  if (data.professionalTitle && setValueBySelector(PROFILE_FIELD_SELECTORS.professionalTitle, data.professionalTitle)) filled++;
  const overview = [data.shortSummary, data.detailedDescription].filter(Boolean).join('\n\n');
  if (overview && setValueBySelector(PROFILE_FIELD_SELECTORS.shortSummary, overview)) filled++;
  if (Array.isArray(data.keySkills) && data.keySkills.length > 0) {
    const skillInput = document.querySelector(PROFILE_FIELD_SELECTORS.keySkills[0]) ||
      document.querySelector('input[placeholder*="skill" i]');
    if (skillInput) {
      const toAdd = data.keySkills.slice(0, 10).join(', ');
      skillInput.focus();
      skillInput.value = toAdd;
      skillInput.dispatchEvent(new Event('input', { bubbles: true }));
      filled++;
    }
  }
  return filled;
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_JOB_DESCRIPTION') {
    const text = getJobDescription();
    sendResponse({ jobDescription: text || '' });
    return true;
  }
  if (msg.type === 'FILL_UPWORK_PROPOSAL' && msg.payload?.proposal) {
    const ok = fillProposalText(msg.payload.proposal);
    sendResponse({ ok });
    return true;
  }
  if (msg.type === 'FILL_UPWORK_PROFILE' && msg.payload) {
    const filled = fillUpworkProfile(msg.payload);
    sendResponse({ filled });
    return true;
  }
  sendResponse({});
  return true;
});
