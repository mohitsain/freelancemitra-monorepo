/**
 * Onboarding API client - calls backend via /api/backend proxy (adds NextAuth JWT).
 * Backend returns standard envelope { success, data }; we unwrap and map snake_case to camelCase.
 */
import {
  parseApiResponse,
  parseApiResponseRequired,
} from "@/lib/api-types";

/** Backend onboarding response (snake_case). */
export interface OnboardingResponse {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  professional_title: string;
  email: string;
  country_phone_code: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  address_line_1: string;
  address_line_2: string;
  postal_code: string;
  profile_picture: string;
  headline: string;
  short_summary: string;
  detailed_description: string;
  key_skills: string[];
  areas_of_specialization: string[];
  years_of_experience: number;
  languages_spoken: string;
  portfolio_link: string;
  portfolio_samples: Array<{
    projectTitle: string;
    client: string;
    description: string;
    skillsUsed: string[];
    portfolioLink: string;
    fileKey?: string;
    uploadedFiles?: Array<{ key: string; size: number }>;
  }>;
  uploaded_files?: Array<{ key: string; size: number }>;
  work_history: Array<{
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
  }>;
  certifications: Array<{
    title: string;
    description: string;
    file_key?: string;
  }>;
  availability: string;
  weekly_hours: number;
  start_date: string;
  hourly_rate: number;
  project_based_rate: string;
  retainer_rate: string;
  currency: string;
  min_project_size: string;
  linkedin_url: string;
  other_social_media: string;
  personal_website: string;
  testimonials: Array<{
    clientName: string;
    clientTitle: string;
    testimonial: string;
  }>;
  last_step_index?: number;
  created_at: string;
  updated_at: string;
}

/** Status from GET /onboarding/status */
export interface OnboardingStatusResponse {
  completed: boolean;
  completed_at: string | null;
}

/** Payload for POST/PATCH - same as OnboardingData but portfolioSamples without File (serializable). */
export interface OnboardingPayload {
  firstName: string;
  lastName: string;
  professionalTitle: string;
  countryPhoneCode: string;
  phoneNumber: string;
  city: string;
  state: string;
  country: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  profilePicture: string;
  headline: string;
  shortSummary: string;
  detailedDescription: string;
  keySkills: string[];
  areasOfSpecialization: string[];
  yearsOfExperience: number;
  languagesSpoken: string;
  portfolioLink: string;
  portfolioSamples: Array<{
    projectTitle: string;
    client: string;
    description: string;
    skillsUsed: string[];
    portfolioLink: string;
    fileKey: string;
    uploadedFiles?: Array<{ key: string; size: number }>;
  }>;
  workHistory: Array<{
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    responsibilities: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    graduationYear: string;
  }>;
  certifications: Array<{
    title: string;
    description: string;
    fileKey: string;
  }>;
  availability: string;
  weeklyHours: number;
  startDate: string;
  hourlyRate: number;
  projectBasedRate: string;
  retainerRate: string;
  currency: string;
  minProjectSize: string;
  linkedinUrl: string;
  otherSocialMedia: string;
  personalWebsite: string;
  testimonials: Array<{
    clientName: string;
    clientTitle: string;
    testimonial: string;
    imageKey: string;
  }>;
  lastStepIndex?: number;
}

const BASE = "/api/backend";

function mapResponseToPayload(res: OnboardingResponse): OnboardingPayload {
  return {
    firstName: res.first_name,
    lastName: res.last_name,
    professionalTitle: res.professional_title,
    countryPhoneCode: (res as { country_phone_code?: string }).country_phone_code ?? "",
    phoneNumber: res.phone_number,
    city: res.city,
    state: res.state,
    country: res.country,
    addressLine1: (res as { address_line_1?: string }).address_line_1 ?? "",
    addressLine2: (res as { address_line_2?: string }).address_line_2 ?? "",
    postalCode: (res as { postal_code?: string }).postal_code ?? "",
    profilePicture: res.profile_picture,
    headline: res.headline,
    shortSummary: res.short_summary,
    detailedDescription: res.detailed_description,
    keySkills: res.key_skills ?? [],
    areasOfSpecialization: res.areas_of_specialization ?? [],
    yearsOfExperience: res.years_of_experience ?? 0,
    languagesSpoken: res.languages_spoken ?? "",
    portfolioLink: res.portfolio_link ?? "",
    portfolioSamples: (res.portfolio_samples ?? []).map((s) => {
      const sample = s as {
        fileKey?: string;
        uploadedFiles?: Array<{ key: string; size: number }>;
        uploaded_files?: Array<{ key: string; size: number }>;
      };
      const fileKey = sample.fileKey ?? "";
      const rawFiles = sample.uploadedFiles ?? sample.uploaded_files ?? [];
      const isUploadedFilesArray = Array.isArray(rawFiles);
      const uploadedFiles = (isUploadedFilesArray ? rawFiles : []).map((item) =>
        typeof item === "object" && item && "key" in item
          ? { key: (item as { key?: string }).key ?? "", size: Number((item as { size?: number }).size) || 0 }
          : { key: "", size: 0 }
      );
      // Use uploadedFiles when present (including empty [] after removal); only fall back to legacy fileKey when uploadedFiles is missing
      const normalized = isUploadedFilesArray ? uploadedFiles : (fileKey ? [{ key: fileKey, size: 0 }] : []);
      return {
        projectTitle: (s as { projectTitle?: string }).projectTitle ?? "",
        client: (s as { client?: string }).client ?? "",
        description: (s as { description?: string }).description ?? "",
        skillsUsed: (s as { skillsUsed?: string[] }).skillsUsed ?? [],
        portfolioLink: (s as { portfolioLink?: string }).portfolioLink ?? "",
        fileKey,
        uploadedFiles: normalized,
      };
    }),
    workHistory: (res.work_history ?? []).map((w) => ({
      company: w.company ?? "",
      jobTitle: w.jobTitle ?? "",
      startDate: w.startDate ?? "",
      endDate: w.endDate ?? "",
      responsibilities: w.responsibilities ?? "",
    })),
    education: (res.education ?? []).map((e) => ({
      degree: e.degree ?? "",
      institution: e.institution ?? "",
      graduationYear: e.graduationYear ?? "",
    })),
    certifications: (() => {
      const raw: unknown = res.certifications;
      if (Array.isArray(raw)) {
        return raw.map((c: { title?: string; description?: string; file_key?: string }) => ({
          title: c.title ?? "",
          description: c.description ?? "",
          fileKey: c.file_key ?? "",
        }));
      }
      if (typeof raw === "string" && (raw as string).trim()) {
        return [{ title: "", description: raw as string, fileKey: "" }];
      }
      return [];
    })(),
    availability: res.availability ?? "full-time",
    weeklyHours: res.weekly_hours ?? 40,
    startDate: res.start_date ?? "",
    hourlyRate: res.hourly_rate ?? 0,
    projectBasedRate: res.project_based_rate ?? "",
    retainerRate: res.retainer_rate ?? "",
    currency: res.currency ?? "USD",
    minProjectSize: res.min_project_size ?? "",
    linkedinUrl: res.linkedin_url ?? "",
    otherSocialMedia: res.other_social_media ?? "",
    personalWebsite: res.personal_website ?? "",
    testimonials: (res.testimonials ?? []).map((t) => {
      const item = t as { clientName?: string; clientTitle?: string; testimonial?: string; imageKey?: string };
      return {
        clientName: item.clientName ?? "",
        clientTitle: item.clientTitle ?? "",
        testimonial: item.testimonial ?? "",
        imageKey: item.imageKey ?? "",
      } as { clientName: string; clientTitle: string; testimonial: string; imageKey: string };
    }),
    lastStepIndex: (res as { last_step_index?: number }).last_step_index ?? 0,
  };
}

/** GET /onboarding/status */
export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const res = await fetch(`${BASE}/onboarding/status`, { credentials: "include" });
  return parseApiResponseRequired<OnboardingStatusResponse>(res);
}

/** GET /onboarding - returns null if not yet submitted */
export async function getOnboarding(): Promise<OnboardingPayload | null> {
  const res = await fetch(`${BASE}/onboarding`, { credentials: "include" });
  const data = await parseApiResponse<OnboardingResponse | null>(res);
  if (data == null) return null;
  return mapResponseToPayload(data as OnboardingResponse);
}

/** POST /onboarding - submit and mark completed */
export async function submitOnboarding(payload: OnboardingPayload): Promise<OnboardingResponse> {
  const res = await fetch(`${BASE}/onboarding`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return parseApiResponseRequired<OnboardingResponse>(res);
}

/** PATCH /onboarding - update without marking completed */
export async function updateOnboarding(payload: OnboardingPayload): Promise<OnboardingResponse> {
  const res = await fetch(`${BASE}/onboarding`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  return parseApiResponseRequired<OnboardingResponse>(res);
}
