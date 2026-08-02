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


def build_prompt(candidate: dict, user_question: str) -> str:

    personal = candidate.get("personal", {})
    education = candidate.get("education", [])
    skills = candidate.get("skills", {})
    projects = candidate.get("projects", [])
    experience = candidate.get("experience", [])
    achievements = candidate.get("achievements", [])
    certifications = candidate.get("certifications", [])
    social_links = candidate.get("social_links", {})

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
    # Final Prompt
    # -----------------------------
    prompt = f"""
{SYSTEM_PROMPT}

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
