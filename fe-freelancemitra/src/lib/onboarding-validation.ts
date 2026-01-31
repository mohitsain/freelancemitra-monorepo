import type { OnboardingData } from '@/components/onboarding/onboarding-flow';

/** Step indices matching STEPS in onboarding-flow (0–7). */
const STEP_BASIC_CONTACT = 0;
const STEP_PROFESSIONAL_OVERVIEW = 1;
const STEP_PORTFOLIO = 2;
const STEP_EXPERIENCE = 3;
const STEP_AVAILABILITY = 4;
const STEP_SOCIAL = 5;
const STEP_TESTIMONIALS = 6;
const STEP_REVIEW = 7;

function isValidUrl(s: string): boolean {
  if (!s?.trim()) return false;
  try {
    new URL(s.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns validation error messages for the given step. Empty array means the step is valid.
 */
export function getStepValidationErrors(data: OnboardingData, stepIndex: number): string[] {
  const errors: string[] = [];

  switch (stepIndex) {
    case STEP_BASIC_CONTACT: {
      if (!data.firstName?.trim()) errors.push('First name is required');
      if (!data.lastName?.trim()) errors.push('Last name is required');
      if (!data.professionalTitle?.trim()) errors.push('Professional title is required');
      if (!data.countryPhoneCode?.trim()) errors.push('Country phone code is required');
      if (!data.phoneNumber?.trim()) errors.push('Phone number is required');
      if (!data.city?.trim()) errors.push('City is required');
      if (!data.country?.trim()) errors.push('Country is required');
      if (!data.addressLine1?.trim()) errors.push('Address line 1 is required');
      break;
    }
    case STEP_PROFESSIONAL_OVERVIEW: {
      if (!data.headline?.trim()) errors.push('Professional headline is required');
      if (!data.shortSummary?.trim()) errors.push('Short summary / bio is required');
      if (!data.keySkills?.length) errors.push('Add at least one key skill');
      if (!data.areasOfSpecialization?.length) errors.push('Add at least one area of specialization');
      const languages = (data.languagesSpoken ?? '').split(',').map((s) => s.trim()).filter(Boolean);
      if (!languages.length) errors.push('Select at least one language spoken');
      break;
    }
    case STEP_PORTFOLIO: {
      const hasLink = !!data.portfolioLink?.trim();
      const hasValidSample = data.portfolioSamples?.some(
        (s) => !!s.projectTitle?.trim() && !!s.description?.trim()
      );
      if (!hasLink && !hasValidSample) {
        errors.push('Add a portfolio link or at least one work sample with title and description');
      }
      break;
    }
    case STEP_EXPERIENCE: {
      const hasValidEndDate = (w: { endDate?: string }) =>
        !!w.endDate?.trim() || w.endDate === 'Present';
      const validWork = data.workHistory?.some(
        (w) =>
          !!w.company?.trim() &&
          !!w.jobTitle?.trim() &&
          !!w.startDate?.trim() &&
          hasValidEndDate(w) &&
          !!w.responsibilities?.trim()
      );
      if (!validWork) {
        errors.push('Add at least one work history with company, job title, start date, end date (or Till date), and key responsibilities');
      }
      break;
    }
    case STEP_AVAILABILITY: {
      if (!data.startDate?.trim()) errors.push('Start date availability is required');
      if (!data.currency?.trim()) errors.push('Currency is required');
      if (data.availability === 'full-time' || data.availability === 'part-time') {
        if (data.hourlyRate == null || data.hourlyRate <= 0) {
          errors.push('Hourly rate is required for full-time or part-time');
        }
      } else {
        const hasRate =
          !!data.projectBasedRate?.trim() || !!data.retainerRate?.trim();
        if (!hasRate) {
          errors.push('Enter a project-based or retainer rate');
        }
      }
      break;
    }
    case STEP_SOCIAL: {
      if (data.linkedinUrl?.trim() && !isValidUrl(data.linkedinUrl)) errors.push('LinkedIn URL must be a valid URL');
      break;
    }
    case STEP_TESTIMONIALS:
      // No mandatory fields
      break;
    case STEP_REVIEW:
      // Review step validity = all previous steps valid
      break;
    default:
      break;
  }

  return errors;
}

/** True if the given step has all mandatory fields filled. */
export function isStepValid(data: OnboardingData, stepIndex: number): boolean {
  return getStepValidationErrors(data, stepIndex).length === 0;
}

/** True if every step (0 through review) passes validation. Used to allow completing onboarding. */
export function areAllStepsValid(data: OnboardingData): boolean {
  const stepCount = 8; // STEPS.length
  for (let i = 0; i < stepCount; i++) {
    if (!isStepValid(data, i)) return false;
  }
  return true;
}

/**
 * Returns field keys that are invalid (missing or empty required). Used to highlight inputs with red border.
 */
export function getInvalidFieldKeys(data: OnboardingData): string[] {
  const keys: string[] = [];

  // Step 0: Basic Contact
  if (!data.firstName?.trim()) keys.push('firstName');
  if (!data.lastName?.trim()) keys.push('lastName');
  if (!data.professionalTitle?.trim()) keys.push('professionalTitle');
  if (!data.countryPhoneCode?.trim()) keys.push('countryPhoneCode');
  if (!data.phoneNumber?.trim()) keys.push('phoneNumber');
  if (!data.city?.trim()) keys.push('city');
  if (!data.country?.trim()) keys.push('country');
  if (!data.addressLine1?.trim()) keys.push('addressLine1');

  // Step 1: Professional Overview
  if (!data.headline?.trim()) keys.push('headline');
  if (!data.shortSummary?.trim()) keys.push('shortSummary');
  if (!data.keySkills?.length) keys.push('keySkills');
  if (!data.areasOfSpecialization?.length) keys.push('areasOfSpecialization');
  const languages = (data.languagesSpoken ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!languages.length) keys.push('languagesSpoken');

  // Step 2: Portfolio
  const hasLink = !!data.portfolioLink?.trim();
  const hasValidSample = data.portfolioSamples?.some(
    (s) => !!s.projectTitle?.trim() && !!s.description?.trim()
  );
  if (!hasLink && !hasValidSample) {
    keys.push('portfolioLink');
    keys.push('portfolioSamples');
  }

  // Step 3: Experience
  const hasValidEndDate = (w: { endDate?: string }) =>
    !!w.endDate?.trim() || w.endDate === 'Present';
  const validWork = data.workHistory?.some(
    (w) =>
      !!w.company?.trim() &&
      !!w.jobTitle?.trim() &&
      !!w.startDate?.trim() &&
      hasValidEndDate(w) &&
      !!w.responsibilities?.trim()
  );
  if (!validWork) keys.push('workHistory');

  // Step 4: Availability
  if (!data.startDate?.trim()) keys.push('startDate');
  if (!data.currency?.trim()) keys.push('currency');
  if (data.availability === 'full-time' || data.availability === 'part-time') {
    if (data.hourlyRate == null || data.hourlyRate <= 0) keys.push('hourlyRate');
  } else {
    const hasRate = !!data.projectBasedRate?.trim() || !!data.retainerRate?.trim();
    if (!hasRate) {
      keys.push('projectBasedRate');
      keys.push('retainerRate');
    }
  }

  // Step 5: Social (only invalid if URL is malformed)
  if (data.linkedinUrl?.trim() && !isValidUrl(data.linkedinUrl)) keys.push('linkedinUrl');

  return keys;
}
