from enum import Enum
from typing import Dict, List, Union
from service.google_docs_service import GoogleDocType
import re


# type for work experience in a resume doc
class ResumeDocExperienceType(Dict[str, Union[str, List[str]]]):
    # name of the company
    company: str
    # location of the company
    location: str
    # duration of the work experience
    duration: str
    # role of the resume author
    role: str
    # list of responsibilities
    responsibilities: List[str]


# type for education in a resume doc
class ResumeDocEducationType(Dict[str, str]):
    # degree obtained by the resume author
    degree: str
    # institution where the resume author obtained their degree
    institution: str
    # duration of the education
    duration: str


# type for personal project in a resume doc
class ResumeDocPersonalProjectType(Dict[str, str]):
    # name of the personal project
    name: str
    # description of the personal project
    description: str


# type for the response from the resume doc handler
class ResumeDocType(Dict[str, Union[str, List[dict]]]):
    # id of the resume doc
    doc_id: str
    # name of the resume doc
    doc_name: str
    # name of the resume author
    name: str
    # list of contact information for the resume author
    contacts: List[str]
    # location of the resume author
    location: str
    # professional title of the resume author
    title: str
    # summary section of the resume
    summary: str
    # list of skills
    skills: List[str]
    # list of work experience
    experience: List[ResumeDocExperienceType]
    # education section of the resume
    education: ResumeDocEducationType
    # list of personal projects
    personal_projects: List[ResumeDocPersonalProjectType]


# enum for the resume section titles
class ResumeSectionTitles(Enum):
    SKILLS = "SKILLS"
    EXPERIENCE = "EXPERIENCE"
    EDUCATION = "EDUCATION"
    PERSONAL_PROJECTS = "PERSONAL PROJECTS"


# remove white spaces and new lines and filter out empty strings from a list of strings
def _clean_list_of_strings(list_of_strings: List[str]) -> List[str]:
    return [s.strip() for s in list_of_strings if s.strip()]


def _get_index_after_title(filtered_contents: List[str], title: str) -> int:
    """returns the index of the first non-empty string after the title"""
    title_index = filtered_contents.index(title) if title in filtered_contents else None
    # return the next non-empty string after the title
    if title_index is not None:
        next_index = title_index + 1
        if next_index < len(filtered_contents):
            return next_index
    return -1


def _get_resume_author_name(filtered_contents: List[str]) -> str:
    """returns the name of the resume author"""
    # assume the first non-empty string is the name of the resume author
    return filtered_contents[0]


def _get_resume_author_contacts_and_location(filtered_contents: List[str]) -> List[str]:
    """returns all the contact information of the resume author with the author's location at the end"""
    # if the filtered contents is empty after removing the first element, then there are no contacts
    contents_without_name = filtered_contents[1:]
    if not contents_without_name:
        return []
    # assume the first non-empty string is the contact information of the resume author
    contacts = contents_without_name[0]
    # split the contacts string by the pipe character and strip the white spaces
    return [c.strip() for c in contacts.split("|")]


def _get_resume_author_contacts(filtered_contents: List[str]) -> List[str]:
    """returns all the contact information of the resume author"""
    contacts_list_with_location = _get_resume_author_contacts_and_location(
        filtered_contents
    )
    # remove the last element from the list since it is the location
    return contacts_list_with_location[:-1]


def _get_resume_author_location(filtered_contents: List[str]) -> str:
    """returns the location of the resume author"""
    contacts_list_with_location = _get_resume_author_contacts_and_location(
        filtered_contents
    )
    # assume the last element is the location
    return contacts_list_with_location[-1]


def _get_resume_author_title(filtered_contents: List[str]) -> str:
    """returns the professional title of the resume author"""
    # assume the third non-empty string is the professional title of the resume author
    if len(filtered_contents) >= 3:
        return filtered_contents[2]
    return ""


def _get_resume_summary(filtered_contents: List[str]) -> str:
    """returns the summary section of the resume"""
    # assume the summary section is right after the professional title
    professional_title = _get_resume_author_title(filtered_contents)
    summary_index = _get_index_after_title(filtered_contents, professional_title)
    if summary_index != -1:
        return filtered_contents[summary_index]
    return ""


def _get_resume_skills(filtered_contents: List[str]) -> List[str]:
    """returns the skills section of the resume"""
    # assume the skills section is titled "SKILLS" and that it's before the work "EXPERIENCE" section
    skills_index = _get_index_after_title(
        filtered_contents, ResumeSectionTitles.SKILLS.value
    )
    experience_index = _get_index_after_title(
        filtered_contents, ResumeSectionTitles.EXPERIENCE.value
    )
    if skills_index != -1 and experience_index != -1:
        skills_section = filtered_contents[skills_index : experience_index - 1]
        # split the skills by "," and "|" and strip white spaces
        skills = []
        for skill_with_delimeter in skills_section:
            for skill in re.split(r"[,|]", skill_with_delimeter):
                skill_without_whitespace = skill.strip()
                if skill_without_whitespace:
                    skills.append(skill_without_whitespace)
        return skills
    return []


def _get_resume_experience(
    filtered_contents: List[str],
) -> List[ResumeDocExperienceType]:
    """returns the work experience section of the resume"""
    return []


def _get_resume_education(filtered_contents: List[str]) -> ResumeDocEducationType:
    """returns the education section of the resume"""
    return {}


def _get_resume_personal_projects(
    filtered_contents: List[str],
) -> List[ResumeDocPersonalProjectType]:
    """returns the personal projects section of the resume"""
    return []


def parse_google_doc(
    google_doc: GoogleDocType,
) -> ResumeDocType:
    """takes in a google doc and returns a more descriptive resume doc with the contents as key value pairs

    Assumes the google doc has the following format:

    * Name
    * Contact Information | Location
    * Professional Title
    * Summary
    * Skills
    * Work Experience
    * Education
    * Personal Projects
    """
    if not google_doc or len(google_doc.get("content", [])) == 0:
        return {}
    doc_id = google_doc.get("id")
    doc_name = google_doc.get("name")
    filtered_contents = _clean_list_of_strings(google_doc.get("content", []))
    resume_doc: ResumeDocType = {"doc_id": doc_id, "doc_name": doc_name}
    resume_doc["name"] = _get_resume_author_name(filtered_contents)
    resume_doc["contacts"] = _get_resume_author_contacts(filtered_contents)
    resume_doc["location"] = _get_resume_author_location(filtered_contents)
    resume_doc["title"] = _get_resume_author_title(filtered_contents)
    resume_doc["summary"] = _get_resume_summary(filtered_contents)
    resume_doc["skills"] = _get_resume_skills(filtered_contents)
    resume_doc["experience"] = _get_resume_experience(filtered_contents)
    resume_doc["education"] = _get_resume_education(filtered_contents)
    resume_doc["personal_projects"] = _get_resume_personal_projects(filtered_contents)
    return resume_doc
