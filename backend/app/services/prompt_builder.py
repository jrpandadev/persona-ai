"""
Prompt construction for chat and job-match endpoints.

Converts the raw candidate.json dict into clean, readable text and
assembles the system/user message pair for each LLM call.

The formatted profile is cached because the underlying candidate data
is static (loaded once via lru_cache in candidate_loader).
"""

from functools import lru_cache

from app.prompts import SYSTEM_PROMPT, JOB_MATCH_SYSTEM_PROMPT


# ── Formatting Helpers ───────────────────────────────────────────────────────

def _format_list_section(title: str, items: list) -> str:
    """Format a simple list section (e.g., Achievements, Certifications)."""
    if not items:
        return ""
    lines = [f"\n[{title.upper()}]\n"]
    for item in items:
        lines.append(f"  - {item}")
    return "\n".join(lines)


def _format_dict_section(title: str, data: dict) -> str:
    """Format a dictionary section (e.g., Skills, Social Links)."""
    if not data:
        return ""
    lines = [f"\n[{title.upper()}]\n"]
    for key, value in data.items():
        if isinstance(value, list) and value:
            lines.append(f"  {key.title()}: {', '.join(str(v) for v in value)}")
        elif value:
            lines.append(f"  {key.title()}: {value}")
    return "\n".join(lines)


def _format_candidate_profile(candidate: dict) -> str:
    """Convert candidate.json into clean, readable text for the prompt."""
    sections: list[str] = []

    # Personal Information
    personal = candidate.get("personal", {})
    if personal:
        info = []
        if name := personal.get("name"):
            info.append(f"Name: {name}")
        if title := personal.get("title"):
            info.append(f"Title: {title}")
        if location := personal.get("location"):
            info.append(f"Location: {location}")
        if email := personal.get("email"):
            info.append(f"Email: {email}")
        if bio := personal.get("bio"):
            info.append(f"\nBio: {bio}")
        sections.append("[PERSONAL INFORMATION]\n\n" + "\n".join(info))

    # Education
    education = candidate.get("education", [])
    if education:
        lines = ["[EDUCATION]"]
        for edu in education:
            parts = []
            if inst := edu.get("institution"):
                parts.append(f"  Institution: {inst}")
            if degree := edu.get("degree"):
                parts.append(f"  Degree: {degree}")
            if field := edu.get("field_of_study"):
                parts.append(f"  Field: {field}")
            if cgpa := edu.get("cgpa"):
                parts.append(f"  CGPA: {cgpa}")
            start = edu.get("start_year", "")
            end = edu.get("end_year", "")
            if start or end:
                parts.append(f"  Duration: {start} - {end}")
            lines.append("\n".join(parts))
        sections.append("\n\n".join(lines))

    # Skills
    skills = candidate.get("skills", {})
    if skills:
        sections.append(_format_dict_section("Skills", skills))

    # Projects
    projects = candidate.get("projects", [])
    if projects:
        lines = ["[PROJECTS]"]
        for proj in projects:
            parts = [f"  Name: {proj.get('name', 'Unnamed')}"]
            if desc := proj.get("description"):
                parts.append(f"  Description: {desc}")
            if tech := proj.get("tech_stack"):
                parts.append(f"  TechStack: {', '.join(tech)}")
            if highlights := proj.get("highlights"):
                parts.append("  Highlights:")
                for h in highlights:
                    parts.append(f"    - {h}")
            if github := proj.get("github"):
                parts.append(f"  GitHub: {github}")
            lines.append("\n".join(parts))
        sections.append("\n\n".join(lines))

    # Experience
    experience = candidate.get("experience", [])
    if experience:
        lines = ["[EXPERIENCE]"]
        for exp in experience:
            parts = [f"  Organization: {exp.get('organization', 'Unknown')}"]
            if role := exp.get("role"):
                parts.append(f"  Role: {role}")
            if duration := exp.get("duration"):
                parts.append(f"  Duration: {duration}")
            if responsibilities := exp.get("responsibilities"):
                parts.append("  Responsibilities:")
                for r in responsibilities:
                    parts.append(f"    - {r}")
            lines.append("\n".join(parts))
        sections.append("\n\n".join(lines))

    # Achievements
    achievements = candidate.get("achievements", [])
    if achievements:
        sections.append(_format_list_section("Achievements", achievements))

    # Certifications
    certifications = candidate.get("certifications", [])
    if certifications:
        sections.append(_format_list_section("Certifications", certifications))

    # Social Links
    social_links = candidate.get("social_links", {})
    if social_links:
        sections.append(_format_dict_section("Social Links", social_links))

    # Interests
    interests = candidate.get("interests", [])
    if interests:
        sections.append(_format_list_section("Interests", interests))

    return "\n\n".join(sections)


# ── Cached Profile Text ─────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _get_profile_text(profile_hash: int) -> str:
    """
    Cache the formatted profile text.

    The `profile_hash` parameter exists solely to make lru_cache work with
    a dict input — the caller passes id(candidate) which is stable because
    the candidate dict itself is cached via lru_cache in candidate_loader.
    """
    # This is a trick: we can't hash a dict, but since the dict is a cached
    # singleton, its id() is stable. The actual candidate dict is passed to
    # _format_candidate_profile via the build_* functions below.
    raise RuntimeError("Should not be called directly")


_cached_profile_text: str | None = None
_cached_profile_id: int | None = None


def _get_or_format_profile(candidate: dict) -> str:
    """Return cached formatted profile text, rebuilding only if the dict changes."""
    global _cached_profile_text, _cached_profile_id
    candidate_id = id(candidate)
    if _cached_profile_id != candidate_id or _cached_profile_text is None:
        _cached_profile_text = _format_candidate_profile(candidate)
        _cached_profile_id = candidate_id
    return _cached_profile_text


# ── Public API ───────────────────────────────────────────────────────────────

def build_prompt(
    candidate: dict,
    user_question: str,
    history: list,
    job_description: str | None = None,
) -> tuple[str, str]:
    """
    Build the chat prompt.

    Returns (system_prompt, user_message) tuple.

    The candidate profile is embedded in the system prompt. The job
    description (if provided) is appended to the user message to avoid
    bloating the system prompt on every conversation turn.
    """
    profile_text = _get_or_format_profile(candidate)

    system_prompt = f"""{SYSTEM_PROMPT}

# Candidate Profile (ONLY source of truth — never go beyond this)

{profile_text}
"""

    # Embed JD in the user message, not the system prompt, to avoid
    # sending it redundantly with every history message.
    user_msg = user_question
    if job_description and job_description.strip():
        user_msg = f"""{user_question}

---
[Active Job Description Context — use this to provide role-aware answers]

{job_description.strip()}"""

    return system_prompt, user_msg


def build_job_match_prompt(
    candidate: dict,
    job_description: str,
) -> tuple[str, str]:
    """
    Build the JD analysis prompt.

    Returns (system_prompt, user_message) tuple.
    """
    profile_text = _get_or_format_profile(candidate)

    user_message = f"""Analyze this job description against the candidate profile and produce a match report.

# Job Description to Analyze:

{job_description.strip()}

# Candidate Profile (Do not invent anything outside this):

{profile_text}
"""

    return JOB_MATCH_SYSTEM_PROMPT, user_message
