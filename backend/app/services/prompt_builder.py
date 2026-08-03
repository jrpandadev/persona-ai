from app.prompts import SYSTEM_PROMPT


def format_list_section(title: str, items: list) -> str:
    """Formats a simple list section."""

    if not items:
        return ""

    text = f"\n## {title}\n\n"

    for item in items:
        text += f"- {item}\n"

    return text


def format_dict_section(title: str, data: dict) -> str:
    """Formats a dictionary section."""

    if not data:
        return ""

    text = f"\n## {title}\n\n"

    for key, value in data.items():

        if isinstance(value, list):

            text += f"{key.title()}:\n"

            for item in value:
                text += f"- {item}\n"

            text += "\n"

        else:
            text += f"{key.title()}: {value}\n"

    return text


def build_prompt(candidate: dict, user_question: str, history: list, job_description: str | None = None) -> str:

    personal = candidate.get("personal", {})
    education = candidate.get("education", [])
    skills = candidate.get("skills", {})
    projects = candidate.get("projects", [])
    experience = candidate.get("experience", [])
    achievements = candidate.get("achievements", [])
    certifications = candidate.get("certifications", [])
    social_links = candidate.get("social_links", {})

    history_text = ""
    for message in history:
        history_text += (
            f"{message.role.capitalize()}: {message.content}\n"
        )

    # -----------------------------
    # Education
    # -----------------------------
    education_text = ""

    if education:

        education_text = "\n## Education\n\n"

        for edu in education:

            education_text += f"""
Institution: {edu.get("institution")}
Degree: {edu.get("degree")}
Field of Study: {edu.get("field_of_study")}
CGPA: {edu.get("cgpa")}
Duration: {edu.get("start_year")} - {edu.get("end_year")}

"""

    # -----------------------------
    # Projects
    # -----------------------------
    projects_text = ""

    if projects:

        projects_text = "\n## Projects\n\n"

        for project in projects:

            projects_text += f"""
Project Name: {project.get("name")}
Description: {project.get("description")}
Tech Stack: {", ".join(project.get("tech_stack", []))}
"""

            highlights = project.get("highlights", [])

            if highlights:

                projects_text += "\nHighlights:\n"

                for item in highlights:
                    projects_text += f"- {item}\n"

            github = project.get("github")

            if github:
                projects_text += f"\nGitHub: {github}\n"

            demo = project.get("demo")

            if demo:
                projects_text += f"Demo: {demo}\n"

            projects_text += "\n"

    # -----------------------------
    # Experience
    # -----------------------------
    experience_text = ""

    if experience:

        experience_text = "\n## Experience\n\n"

        for exp in experience:

            experience_text += f"""
Organization: {exp.get("organization")}
Role: {exp.get("role")}
Duration: {exp.get("duration")}
"""

            responsibilities = exp.get("responsibilities", [])

            if responsibilities:

                experience_text += "\nResponsibilities:\n"

                for item in responsibilities:
                    experience_text += f"- {item}\n"

            experience_text += "\n"

    # -----------------------------
    # Job Description
    # -----------------------------
    jd_text = ""
    if job_description and job_description.strip():
        jd_text = f"\n# Job Description Context\n\n{job_description}\n"

    # -----------------------------
    # Final Prompt
    # -----------------------------
    prompt = f"""
{SYSTEM_PROMPT}

# Conversation History

{history_text}
{jd_text}

# Candidate Profile

## Personal Information

Name: {personal.get("name")}
Title: {personal.get("title")}
Location: {personal.get("location")}
Email: {personal.get("email")}
Phone: {personal.get("phone")}

Bio:
{personal.get("bio")}

{education_text}

{format_dict_section("Skills", skills)}

{projects_text}

{experience_text}

{format_list_section("Achievements", achievements)}

{format_list_section("Certifications", certifications)}

{format_dict_section("Social Links", social_links)}

# User Question

{user_question}
"""

    return prompt


def build_job_match_prompt(candidate: dict, job_description: str) -> str:
    from app.prompts import JOB_MATCH_SYSTEM_PROMPT

    personal = candidate.get("personal", {})
    skills = candidate.get("skills", {})
    projects = candidate.get("projects", [])
    experience = candidate.get("experience", [])

    candidate_summary = f"""
Name: {personal.get("name")}
Title: {personal.get("title")}

{format_dict_section("Skills", skills)}

## Experience
"""
    for exp in experience:
        candidate_summary += f"- {exp.get('role')} at {exp.get('organization')}\n"

    candidate_summary += "\n## Projects\n"
    for proj in projects:
        candidate_summary += f"- {proj.get('name')}: {proj.get('description')} (Tech: {', '.join(proj.get('tech_stack', []))})\n"

    prompt = f"""
{JOB_MATCH_SYSTEM_PROMPT}

# Job Description to Analyze:

{job_description}


# Candidate Profile (Do not invent anything outside this):

{candidate_summary}
"""
    return prompt
