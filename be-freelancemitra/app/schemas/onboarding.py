"""Onboarding request/response schemas - aligned with fe-freelancemitra OnboardingData."""
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class PortfolioSample(BaseModel):
    """Single portfolio sample. uploadedFiles: list of {key, size} (max 5, 25MB per sample)."""

    projectTitle: str = ""
    client: str = ""
    description: str = ""
    skillsUsed: list[str] = Field(default_factory=list)
    portfolioLink: str = ""
    fileKey: str = ""  # legacy single file; prefer uploadedFiles
    uploadedFiles: list[dict] = Field(default_factory=list)  # [{"key": str, "size": int}]; max 5, 25MB per sample


class WorkHistoryItem(BaseModel):
    """Work history entry."""

    company: str = ""
    jobTitle: str = ""
    startDate: str = ""
    endDate: str = ""
    responsibilities: str = ""


class EducationItem(BaseModel):
    """Education entry."""

    degree: str = ""
    institution: str = ""
    graduationYear: str = ""


class CertificationItem(BaseModel):
    """Certification or award entry - title, description, optional file (max 10 MB)."""

    title: str = ""
    description: str = ""
    fileKey: str = ""


class TestimonialItem(BaseModel):
    """Testimonial entry."""

    clientName: str = ""
    clientTitle: str = ""
    testimonial: str = ""


class OnboardingCreate(BaseModel):
    """Payload to create/update onboarding - camelCase to match frontend. Email comes from login only."""

    firstName: str = ""
    lastName: str = ""
    professionalTitle: str = ""
    countryPhoneCode: str = ""
    phoneNumber: str = ""
    city: str = ""
    state: str = ""
    country: str = ""
    addressLine1: str = ""
    addressLine2: str = ""
    postalCode: str = ""
    profilePicture: str = ""
    headline: str = ""
    shortSummary: str = ""
    detailedDescription: str = ""
    keySkills: list[str] = Field(default_factory=list)
    areasOfSpecialization: list[str] = Field(default_factory=list)
    yearsOfExperience: int = 0
    languagesSpoken: str = ""
    portfolioLink: str = ""
    portfolioSamples: list[PortfolioSample] = Field(default_factory=list)
    workHistory: list[WorkHistoryItem] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list)
    certifications: list[CertificationItem] = Field(default_factory=list)
    availability: str = "full-time"
    weeklyHours: int = 40
    startDate: str = ""
    hourlyRate: float = 0
    projectBasedRate: str = ""
    retainerRate: str = ""
    currency: str = "USD"
    minProjectSize: str = ""
    linkedinUrl: str = ""
    otherSocialMedia: str = ""
    personalWebsite: str = ""
    testimonials: list[TestimonialItem] = Field(default_factory=list)
    lastStepIndex: int = 0  # resume: last step user was on (0-based)


class OnboardingResponse(BaseModel):
    """Onboarding in API responses - snake_case (matches DB)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    first_name: str
    last_name: str
    professional_title: str
    email: str  # from login, read-only
    country_phone_code: str
    phone_number: str
    city: str
    state: str
    country: str
    address_line_1: str
    address_line_2: str
    postal_code: str
    profile_picture: str
    headline: str
    short_summary: str
    detailed_description: str
    key_skills: list
    areas_of_specialization: list
    years_of_experience: int
    languages_spoken: str
    portfolio_link: str
    portfolio_samples: list
    uploaded_files: list
    work_history: list
    education: list
    certifications: list  # list of { title, description, file_key }
    availability: str
    weekly_hours: int
    start_date: str
    hourly_rate: float
    project_based_rate: str
    retainer_rate: str
    currency: str
    min_project_size: str
    linkedin_url: str
    other_social_media: str
    personal_website: str
    testimonials: list
    last_step_index: int = 0
    created_at: datetime
    updated_at: datetime


class OnboardingStatus(BaseModel):
    """Onboarding completion status."""

    completed: bool
    completed_at: datetime | None = None
