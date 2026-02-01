"""Personalized proposal generation from user onboarding/portfolio + job description (OpenAI)."""
from __future__ import annotations

from typing import TYPE_CHECKING

from openai import AsyncOpenAI

from app.config import get_settings

if TYPE_CHECKING:
    from app.models.onboarding import UserOnboarding


def build_profile_summary(ob: UserOnboarding) -> str:
    """Build a plain-text profile summary from onboarding for the LLM."""
    parts: list[str] = []

    name = f"{ob.first_name or ''} {ob.last_name or ''}".strip() or "Freelancer"
    parts.append(f"Name: {name}")

    if ob.professional_title:
        parts.append(f"Professional title: {ob.professional_title}")
    if ob.headline:
        parts.append(f"Headline: {ob.headline}")
    if ob.years_of_experience:
        parts.append(f"Years of experience: {ob.years_of_experience}")
    if ob.short_summary:
        parts.append(f"Summary: {ob.short_summary}")
    if ob.detailed_description:
        parts.append(f"Detailed description: {ob.detailed_description}")

    if ob.key_skills and isinstance(ob.key_skills, list) and ob.key_skills:
        skills = ", ".join(str(s) for s in ob.key_skills)
        parts.append(f"Key skills: {skills}")
    if ob.areas_of_specialization and isinstance(ob.areas_of_specialization, list) and ob.areas_of_specialization:
        areas = ", ".join(str(a) for a in ob.areas_of_specialization)
        parts.append(f"Areas of specialization: {areas}")
    if ob.languages_spoken:
        parts.append(f"Languages: {ob.languages_spoken}")

    if ob.work_history and isinstance(ob.work_history, list) and ob.work_history:
        parts.append("Work history:")
        for h in ob.work_history[:10]:
            if isinstance(h, dict):
                job = h.get("jobTitle") or h.get("job_title", "")
                company = h.get("company", "")
                start = h.get("startDate") or h.get("start_date", "")
                end = h.get("endDate") or h.get("end_date", "")
                resp = h.get("responsibilities", "")
                parts.append(f"  - {job}" + (f" at {company}" if company else "") + f" ({start} – {end})")
                if resp:
                    parts.append(f"    {resp[:300]}{'...' if len(resp) > 300 else ''}")

    if ob.education and isinstance(ob.education, list) and ob.education:
        parts.append("Education:")
        for e in ob.education[:5]:
            if isinstance(e, dict):
                degree = e.get("degree", "")
                inst = e.get("institution", "")
                year = e.get("graduationYear") or e.get("graduation_year", "")
                parts.append(f"  - {degree}" + (f", {inst}" if inst else "") + (f" ({year})" if year else ""))

    if ob.portfolio_samples and isinstance(ob.portfolio_samples, list) and ob.portfolio_samples:
        parts.append("Portfolio / work samples:")
        for s in ob.portfolio_samples[:8]:
            if isinstance(s, dict):
                title = s.get("projectTitle") or s.get("project_title", "")
                client = s.get("client", "")
                desc = s.get("description", "")
                skills_used = s.get("skillsUsed") or s.get("skills_used") or []
                parts.append(f"  - {title}" + (f" (Client: {client})" if client else ""))
                if desc:
                    parts.append(f"    {desc[:250]}{'...' if len(desc) > 250 else ''}")
                if skills_used:
                    parts.append(f"    Skills: {', '.join(str(x) for x in skills_used)}")

    if ob.testimonials and isinstance(ob.testimonials, list) and ob.testimonials:
        parts.append("Testimonials:")
        for t in ob.testimonials[:3]:
            if isinstance(t, dict):
                quote = t.get("testimonial", "")
                client_name = t.get("clientName") or t.get("client_name", "")
                if quote:
                    parts.append(f"  - \"{quote[:200]}{'...' if len(quote) > 200 else ''}\" — {client_name}")

    if ob.availability:
        parts.append(f"Availability: {ob.availability}")
    if ob.hourly_rate and float(ob.hourly_rate) > 0:
        parts.append(f"Hourly rate: {ob.currency} {ob.hourly_rate}")
    if ob.project_based_rate:
        parts.append(f"Project-based rate: {ob.project_based_rate}")
    if ob.portfolio_link:
        parts.append(f"Portfolio link: {ob.portfolio_link}")
    if ob.linkedin_url:
        parts.append(f"LinkedIn: {ob.linkedin_url}")
    if ob.personal_website:
        parts.append(f"Website: {ob.personal_website}")

    return "\n".join(parts) if parts else "No profile data provided."


async def generate_personalized_proposal(
    job_description: str,
    profile_summary: str,
    *,
    platform: str | None = None,
    job_budget: str | None = None,
    hourly_rate: str | None = None,
    api_key: str | None = None,
    chat_model: str | None = None,
) -> str:
    """
    Generate a personalized freelance proposal using OpenAI.
    Uses only the provided profile summary and job description; does not invent facts.
    """
    settings = get_settings()
    key = api_key or settings.openai_api_key
    if not key:
        return "OpenAI API key is not configured. Set OPENAI_API_KEY in .env to generate proposals."
    client = AsyncOpenAI(api_key=key)
    model = chat_model or settings.openai_chat_model

    extra_context = []
    if platform:
        extra_context.append(f"Platform: {platform} (tailor tone/length to this platform if relevant).")
    if job_budget:
        extra_context.append(f"Client's stated job budget: {job_budget}.")
    if hourly_rate:
        extra_context.append(f"Client's stated hourly rate: {hourly_rate}.")
    extra_block = "\n".join(extra_context) if extra_context else ""

    prompt = f"""You are writing a personalized freelance proposal. Your task is to write a compelling, professional proposal that:
1. Addresses the client's job description directly.
2. Uses ONLY the freelancer's profile/portfolio data below — do not invent experience, skills, or projects.
3. Highlights the freelancer's most relevant experience, skills, and work samples for this job.
4. Is concise (roughly 150–300 words), professional in tone, and ends with a clear next step (e.g. availability for a call).
{f'Additional context (use if relevant): {extra_block}' if extra_block else ''}

Job description:
---
{job_description}
---

Freelancer profile and portfolio:
---
{profile_summary}
---

Write the proposal:"""

    try:
        r = await client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
        )
        return (r.choices[0].message.content or "").strip()
    except Exception as e:
        return f"Error generating proposal: {e!s}"
