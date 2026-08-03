from app.prompts import SYSTEM_PROMPT, JOB_MATCH_SYSTEM_PROMPT


def _format_list_section(title: str, items: list) -> str:
    """Formats a simple list section."""
    if not items:
        return ""
    lines = [f"\n## {title}\n"]
    for item in items:
        lines.append(f"- {item}")
    return "\n".join(lines)


def _format_dict_section(title: str, data: dict) -> str:
    """Formats a dictionary section."""
    if not data:
        return ""
    lines = [f"\n## {title}\n"]
    for key, value in data.items():
        if isinstance(value, list) and value:
            lines.append(f"{key.title()}: {', '.join(str(v) for v in value)}")
        elif value:
            lines.append(f"{key.title()}: {value}")
    return "\n".join(lines)


def _format_candidate_profile(candidate: dict) -> str:
    """Convert candidate.json into clean, readable text for the prompt."""
    sections = []

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
        sections.append("## Personal Information\n\n" + "\n".join(info))

    # Education
    education = candidate.get("education", [])
    if education:
        lines = ["## Education\n"]
        for edu in education:
            parts = []
            if inst := edu.get("institution"):
                parts.append(f"Institution: {inst}")
            if degree := edu.get("degree"):
                parts.append(f"Degree: {degree}")
            if field := edu.get("field_of_study"):
                parts.append(f"Field: {field}")
            if cgpa := edu.get("cgpa"):
                parts.append(f"CGPA: {cgpa}")
            start = edu.get("start_year", "")
            end = edu.get("end_year", "")
            if start or end:
                parts.append(f"Duration: {start} - {end}")
            lines.append("\n".join(parts))
        sections.append("\n".join(lines))

    # Skills
    skills = candidate.get("skills", {})
    if skills:
        sections.append(_format_dict_section("Skills", skills))

    # Projects
    projects = candidate.get("projects", [])
    if projects:
        lines = ["## Projects\n"]
        for proj in projects:
            parts = [f"Project: {proj.get('name', 'Unnamed')}"]
            if desc := proj.get("description"):
                parts.append(f"Description: {desc}")
            if tech := proj.get("tech_stack"):
                parts.append(f"Tech Stack: {', '.join(tech)}")
            if highlights := proj.get("highlights"):
                parts.append("Highlights:")
                for h in highlights:
                    parts.append(f"  - {h}")
            if github := proj.get("github"):
                parts.append(f"GitHub: {github}")
            lines.append("\n".join(parts) + "\n")
        sections.append("\n".join(lines))

    # Experience
    experience = candidate.get("experience", [])
    if experience:
        lines = ["## Experience\n"]
        for exp in experience:
            parts = [f"Organization: {exp.get('organization', 'Unknown')}"]
            if role := exp.get("role"):
                parts.append(f"Role: {role}")
            if duration := exp.get("duration"):
                parts.append(f"Duration: {duration}")
            if responsibilities := exp.get("responsibilities"):
                parts.append("Responsibilities:")
                for r in responsibilities:
                    parts.append(f"  - {r}")
            lines.append("\n".join(parts) + "\n")
        sections.append("\n".join(lines))

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


def build_prompt(
    candidate: dict,
    user_question: str,
    history: list,
    job_description: str | None = None,
) -> tuple[str, str]:
    """
    Build the chat prompt.
    Returns (system_prompt, user_message) tuple for proper LLM message separation.
    """
    profile_text = _format_candidate_profile(candidate)

    jd_block = ""
    if job_description and job_description.strip():
        jd_block = f"\n\n# Job Description Context\n\n{job_description.strip()}"

    system_prompt = f"""{SYSTEM_PROMPT}

# Candidate Profile (ONLY source of truth — never go beyond this)

{profile_text}
{jd_block}
"""

    return system_prompt, user_question


def build_job_match_prompt(
    candidate: dict,
    job_description: str,
) -> tuple[str, str]:
    """
    Build the JD analysis prompt.
    Returns (system_prompt, user_message) tuple.
    """
    profile_text = _format_candidate_profile(candidate)

    user_message = f"""Analyze this job description against the candidate profile and produce a match report.

# Job Description to Analyze:

{job_description.strip()}

# Candidate Profile (Do not invent anything outside this):

{profile_text}
"""

    return JOB_MATCH_SYSTEM_PROMPT, user_message
