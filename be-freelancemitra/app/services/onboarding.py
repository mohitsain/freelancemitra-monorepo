"""Onboarding service - map FE payload to DB and back."""
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.onboarding import UserOnboarding
from app.models.user import User
from app.schemas.onboarding import (
    OnboardingCreate,
    OnboardingResponse,
    OnboardingStatus,
    PortfolioSample,
    WorkHistoryItem,
    EducationItem,
    CertificationItem,
    TestimonialItem,
)


def _payload_to_attrs(payload: OnboardingCreate) -> dict:
    """Convert OnboardingCreate (camelCase) to DB model attributes (snake_case)."""
    return {
        "first_name": payload.firstName,
        "last_name": payload.lastName,
        "professional_title": payload.professionalTitle,
        "country_phone_code": getattr(payload, "countryPhoneCode", "") or "",
        "phone_number": payload.phoneNumber,
        "city": payload.city,
        "state": payload.state,
        "country": payload.country,
        "address_line_1": getattr(payload, "addressLine1", "") or "",
        "address_line_2": getattr(payload, "addressLine2", "") or "",
        "postal_code": getattr(payload, "postalCode", "") or "",
        "profile_picture": payload.profilePicture,
        "headline": payload.headline,
        "short_summary": payload.shortSummary,
        "detailed_description": payload.detailedDescription,
        "key_skills": payload.keySkills,
        "areas_of_specialization": payload.areasOfSpecialization,
        "years_of_experience": payload.yearsOfExperience,
        "languages_spoken": payload.languagesSpoken,
        "portfolio_link": payload.portfolioLink,
        "portfolio_samples": [
            {
                "projectTitle": s.projectTitle,
                "client": s.client,
                "description": s.description,
                "skillsUsed": s.skillsUsed,
                "portfolioLink": s.portfolioLink,
                "fileKey": getattr(s, "fileKey", "") or "",
                "uploadedFiles": getattr(s, "uploadedFiles", None) or [],
            }
            for s in payload.portfolioSamples
        ],
        "work_history": [h.model_dump() for h in payload.workHistory],
        "education": [e.model_dump() for e in payload.education],
        "certifications": [
            {
                "title": c.title,
                "description": c.description,
                "file_key": getattr(c, "fileKey", "") or "",
            }
            for c in (payload.certifications or [])
        ],
        "availability": payload.availability,
        "weekly_hours": payload.weeklyHours,
        "start_date": payload.startDate,
        "hourly_rate": float(payload.hourlyRate),
        "project_based_rate": payload.projectBasedRate,
        "retainer_rate": payload.retainerRate,
        "currency": payload.currency,
        "min_project_size": payload.minProjectSize,
        "linkedin_url": payload.linkedinUrl,
        "other_social_media": payload.otherSocialMedia,
        "personal_website": payload.personalWebsite,
        "testimonials": [t.model_dump() for t in payload.testimonials],
        "last_step_index": getattr(payload, "lastStepIndex", 0) or 0,
    }


async def upsert_onboarding(
    db: AsyncSession,
    user_id: UUID,
    payload: OnboardingCreate,
    *,
    mark_completed: bool = True,
) -> UserOnboarding:
    """Create or update onboarding for user. Email set from user (login only). Optionally set user.onboarding_completed_at."""
    result_user = await db.execute(select(User).where(User.id == user_id))
    user = result_user.scalar_one_or_none()
    result = await db.execute(
        select(UserOnboarding).where(UserOnboarding.user_id == user_id)
    )
    ob = result.scalar_one_or_none()
    attrs = _payload_to_attrs(payload)
    # Never save presigned URL: store S3 key only; create URL at runtime
    if attrs.get("profile_picture", "").startswith(("http://", "https://")):
        attrs["profile_picture"] = ob.profile_picture if ob else ""
    if user and user.email:
        attrs["email"] = user.email
    if ob:
        for k, v in attrs.items():
            setattr(ob, k, v)
        await db.flush()
    else:
        ob = UserOnboarding(user_id=user_id, **attrs)
        db.add(ob)
        await db.flush()

    if mark_completed:
        result_user = await db.execute(select(User).where(User.id == user_id))
        user = result_user.scalar_one()
        user.onboarding_completed_at = datetime.now(timezone.utc)
        await db.flush()

    return ob


async def get_onboarding_by_user_id(
    db: AsyncSession,
    user_id: UUID,
) -> UserOnboarding | None:
    """Get onboarding record for user."""
    result = await db.execute(
        select(UserOnboarding).where(UserOnboarding.user_id == user_id)
    )
    return result.scalar_one_or_none()


def to_response(ob: UserOnboarding) -> OnboardingResponse:
    """Map UserOnboarding model to OnboardingResponse."""
    return OnboardingResponse(
        id=ob.id,
        user_id=ob.user_id,
        first_name=ob.first_name,
        last_name=ob.last_name,
        professional_title=ob.professional_title,
        email=ob.email,
        country_phone_code=getattr(ob, "country_phone_code", "") or "",
        phone_number=ob.phone_number,
        city=ob.city,
        state=ob.state,
        country=ob.country,
        address_line_1=getattr(ob, "address_line_1", "") or "",
        address_line_2=getattr(ob, "address_line_2", "") or "",
        postal_code=getattr(ob, "postal_code", "") or "",
        profile_picture=ob.profile_picture,
        headline=ob.headline,
        short_summary=ob.short_summary,
        detailed_description=ob.detailed_description,
        key_skills=ob.key_skills or [],
        areas_of_specialization=ob.areas_of_specialization or [],
        years_of_experience=ob.years_of_experience,
        languages_spoken=ob.languages_spoken,
        portfolio_link=ob.portfolio_link,
        portfolio_samples=ob.portfolio_samples or [],
        uploaded_files=getattr(ob, "uploaded_file_keys", None) or [],
        work_history=ob.work_history or [],
        education=ob.education or [],
        certifications=ob.certifications if isinstance(getattr(ob, "certifications", None), list) else [],
        availability=ob.availability,
        weekly_hours=ob.weekly_hours,
        start_date=ob.start_date,
        hourly_rate=float(ob.hourly_rate),
        project_based_rate=ob.project_based_rate,
        retainer_rate=ob.retainer_rate,
        currency=ob.currency,
        min_project_size=ob.min_project_size,
        linkedin_url=ob.linkedin_url,
        other_social_media=ob.other_social_media,
        personal_website=ob.personal_website,
        testimonials=ob.testimonials or [],
        last_step_index=getattr(ob, "last_step_index", 0) or 0,
        created_at=ob.created_at,
        updated_at=ob.updated_at,
    )


def to_status(user: User) -> OnboardingStatus:
    """Build onboarding status from user."""
    return OnboardingStatus(
        completed=user.onboarding_completed_at is not None,
        completed_at=user.onboarding_completed_at,
    )


class OnboardingService:
    """Onboarding service facade."""

    async def upsert(
        self,
        db: AsyncSession,
        user_id: UUID,
        payload: OnboardingCreate,
        *,
        mark_completed: bool = True,
    ) -> UserOnboarding:
        return await upsert_onboarding(db, user_id, payload, mark_completed=mark_completed)

    async def get_by_user_id(
        self, db: AsyncSession, user_id: UUID
    ) -> UserOnboarding | None:
        return await get_onboarding_by_user_id(db, user_id)

    def to_response(self, ob: UserOnboarding) -> OnboardingResponse:
        return to_response(ob)

    def to_status(self, user: User) -> OnboardingStatus:
        return to_status(user)


onboarding_service = OnboardingService()
