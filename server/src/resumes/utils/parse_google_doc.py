from enum import Enum
from typing import Dict, List, Optional, Union, Tuple
from resumes.service.google_docs_service import GoogleDocType
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
    # email of the resume author from the contacts
    email: Optional[str]
    # list of contact information for the resume author
    contacts: List[str]
    # location of the resume author
    location: Optional[str]
    # professional title of the resume author
    title: str
    # summary section of the resume
    summary: str
    # list of skills
    skills: List[str]
    # list of work experience
    experiences: List[ResumeDocExperienceType]
    # education section of the resume
    educations: List[ResumeDocEducationType]
    # list of personal projects
    personal_projects: List[ResumeDocPersonalProjectType]


# enum for the resume section titles
class ResumeSectionTitles(Enum):
    SKILLS = "SKILLS"
    EXPERIENCE = "EXPERIENCE"
    EDUCATION = "EDUCATION"
    PERSONAL_PROJECTS = "PERSONAL PROJECT"


def _clean_string(string_to_clean: str) -> str:
    """removes white spaces and new lines from a string"""
    return string_to_clean.strip()


def _clean_list_of_strings(list_of_strings: List[str]) -> List[str]:
    """removes white spaces and new lines and filters out empty strings from a list of strings"""
    return [_clean_string(s) for s in list_of_strings if _clean_string(s)]


def _get_index_after_title(doc_contents: List[str], title: str) -> int:
    """returns the index of the first non-empty string after the title"""
    # get the index of the title using _clean_string() on each string in doc_contents
    title_index = -1
    for index, string in enumerate(doc_contents):
        if _clean_string(string) == _clean_string(title):
            title_index = index
    # return the next non-empty string after the title
    if title_index != -1:
        next_index = title_index + 1
        if next_index < len(doc_contents):
            return next_index
    return -1


def _get_section_between_titles(
    doc_contents: List[str], first_title: str, last_title: str
) -> List[str]:
    """returns the section between the first title and the last title"""
    if doc_contents:
        first_content_index = _get_index_after_title(doc_contents, first_title)
        last_content_index = _get_index_after_title(doc_contents, last_title)
        if first_content_index != -1 and last_content_index != -1:
            return doc_contents[first_content_index : last_content_index - 1]
    return []


def _get_resume_author_name(*, filtered_doc_contents: List[str]) -> str:
    """returns the name of the resume author"""
    if not filtered_doc_contents:
        return ""
    # assume the first non-empty string is the name of the resume author
    return filtered_doc_contents[0]


def _get_resume_author_contacts_and_location(
    *, filtered_doc_contents: List[str]
) -> List[str]:
    """returns all the contact information of the resume author with the author's location"""
    # if the filtered contents is empty after removing the first element, then there are no contacts
    contents_without_name = filtered_doc_contents[1:]
    if not contents_without_name:
        return []
    # assume the first non-empty string is the contact information of the resume author
    contacts = contents_without_name[0]
    # split the contacts string by the pipe character and strip the white spaces
    return [c.strip() for c in contacts.split("|")]


def _get_resume_author_contacts(*, filtered_doc_contents: List[str]) -> List[str]:
    """returns all the contact information of the resume author without the author's email and location"""
    contacts_list_with_location = _get_resume_author_contacts_and_location(
        filtered_doc_contents=filtered_doc_contents
    )
    # remove the author's email and location
    email = _get_resume_author_email(filtered_doc_contents=filtered_doc_contents)
    location = _get_resume_author_location(filtered_doc_contents=filtered_doc_contents)
    contacts_without_email_and_location = []
    for contact in contacts_list_with_location:
        if contact != email and contact != location:
            contacts_without_email_and_location.append(contact)
    return contacts_without_email_and_location


def _get_resume_author_email(*, filtered_doc_contents: List[str]) -> Optional[str]:
    """returns the email of the resume author"""
    contacts_list_with_location = _get_resume_author_contacts_and_location(
        filtered_doc_contents=filtered_doc_contents
    )
    # assume the first non-empty string with an @ is the email of the resume author
    for contact in contacts_list_with_location:
        if "@" in contact:
            return contact
    return None


def _get_resume_author_location(*, filtered_doc_contents: List[str]) -> Optional[str]:
    """returns the location of the resume author"""
    contacts_list_with_location = _get_resume_author_contacts_and_location(
        filtered_doc_contents=filtered_doc_contents
    )
    # ex: contacts_list_with_location: ["user@email.com", "github.com/user", "Boston MA, US", "linkedin.com/user", "something.else/blah"]
    # gets the "Boston MA, US" assuming any string with spaces is not a link or email and represents a location
    for contact in contacts_list_with_location:
        if " " in contact:
            return contact
    return None


def _get_resume_author_title(*, filtered_doc_contents: List[str]) -> str:
    """returns the professional title of the resume author"""
    # assume the third non-empty string is the professional title of the resume author
    if len(filtered_doc_contents) >= 3:
        return filtered_doc_contents[2]
    return ""


def _get_resume_summary(*, filtered_doc_contents: List[str]) -> str:
    """returns the summary section of the resume"""
    # assume the summary section is right after the professional title
    professional_title = _get_resume_author_title(
        filtered_doc_contents=filtered_doc_contents
    )
    summary_index = _get_index_after_title(filtered_doc_contents, professional_title)
    if summary_index != -1:
        return filtered_doc_contents[summary_index]
    return ""


def _get_resume_skills(*, filtered_doc_contents: List[str]) -> List[str]:
    """returns the skills section of the resume"""
    # assume the skills section is before the work experience section
    skills_section = _get_section_between_titles(
        filtered_doc_contents,
        ResumeSectionTitles.SKILLS.value,
        ResumeSectionTitles.EXPERIENCE.value,
    )
    # split the skills by "," and "|" and strip white spaces
    skills = []
    for skill_with_delimeter in skills_section:
        for skill in re.split(r"[,|]", skill_with_delimeter):
            skill_without_whitespace = skill.strip()
            if skill_without_whitespace:
                skills.append(skill_without_whitespace)
    return skills


def _parse_company_info(line: str) -> Tuple[str, str, str]:
    """returns the company name, location, and duration at that company from a single line"""
    # assume the format of the line is "Company Name, Location                Duration"
    split_parts = re.split(r"\s{2,}", _clean_string(line))
    if len(split_parts) != 2:
        raise ValueError(
            "Input string should have a company/location part and a duration part."
        )
    company_location, duration = split_parts
    # assume the company and location are separated by a comma like "Company Name, City, State"
    company_location_parts = company_location.split(",", 1)
    if len(company_location_parts) != 2:
        raise ValueError(
            "Company/location part should contain a company and a location."
        )
    company, location = map(_clean_string, company_location_parts)
    return company, location, duration


def _parse_education_info(line: str) -> Tuple[str, str, str]:
    """returns the degree and duration from a single line"""
    # assume the format of the line is "Degree, School Name               Duration"
    split_parts = re.split(r"\s{2,}", _clean_string(line))
    if len(split_parts) != 2:
        raise ValueError(
            "Input string should have a degree/school part and a duration part."
        )
    school, duration = split_parts
    # assume the degree and school name are separated by a comma like "B.S in Mechanical Engineering, ABC University"
    school_parts = school.split(",", 1)
    if len(school_parts) != 2:
        raise ValueError("degree/school part should contain a degree and a school.")
    degree, school_name = map(_clean_string, school_parts)
    return degree, school_name, duration


def _parse_work_experience_from_a_single_company(
    single_company_experience: List[str],
) -> ResumeDocExperienceType:
    """parses the work experience from a single company"""
    if single_company_experience and len(single_company_experience) >= 2:
        # assume the first non-empty string contains the company name, location, and duration
        company_name, company_location, duration = _parse_company_info(
            single_company_experience[0]
        )
        # assume the second non-empty string is the role
        role = _clean_string(single_company_experience[1])
        # assume the rest of the strings are the responsibilities
        responsibilities = _clean_list_of_strings(single_company_experience[2:])
        return {
            "company": company_name,
            "location": company_location,
            "duration": duration,
            "role": role,
            "responsibilities": responsibilities,
        }
    return {}


def _parse_resume_experience_section(
    experience_section: List[str],
) -> List[ResumeDocExperienceType]:
    """parses the work experience section of the resume from a list of strings"""
    if experience_section:
        # split the experience section by new lines
        experiences: List[List[str]] = []
        experience = []
        for content in experience_section:
            if content == "\n" and experience:
                experiences.append(experience)
                experience = []
            else:
                experience.append(content)
        # parse each experience
        return [_parse_work_experience_from_a_single_company(e) for e in experiences]
    return []


def _get_resume_experiences(
    doc_contents: List[str],
) -> List[ResumeDocExperienceType]:
    """returns the work experience section of the resume"""
    # assume the experience section is before the education section
    experience_section = _get_section_between_titles(
        doc_contents,
        ResumeSectionTitles.EXPERIENCE.value,
        ResumeSectionTitles.EDUCATION.value,
    )
    return _parse_resume_experience_section(experience_section)


def _get_resume_educations(doc_contents: List[str]) -> List[ResumeDocEducationType]:
    """returns the education section of the resume"""
    # assume the education section is before the personal projects section
    education_section = _get_section_between_titles(
        doc_contents,
        ResumeSectionTitles.EDUCATION.value,
        ResumeSectionTitles.PERSONAL_PROJECTS.value,
    )
    education_section = _clean_list_of_strings(education_section)
    if education_section:
        educations: List[ResumeDocEducationType] = []
        for line in education_section:
            degree, school_name, duration = _parse_education_info(line)
            educations.append(
                {
                    "degree": degree,
                    "institution": school_name,
                    "duration": duration,
                }
            )
        return educations
    return []


def _get_resume_personal_projects(
    *, filtered_doc_contents: List[str]
) -> List[ResumeDocPersonalProjectType]:
    """returns the personal projects section of the resume"""
    ## assume the personal projects section is the last section
    projects_section_start_index = _get_index_after_title(
        filtered_doc_contents, ResumeSectionTitles.PERSONAL_PROJECTS.value
    )
    projects_section = filtered_doc_contents[projects_section_start_index:]
    if projects_section:
        projects: List[ResumeDocPersonalProjectType] = []
        name, description = "", ""
        for index, line in enumerate(projects_section):
            # assume the personal project name is the first string
            if index % 2 == 0:
                name = line
            # assume the personal project description is the second string
            else:
                description = line
                projects.append({"name": name, "description": description})
        return projects
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
    doc_contents = google_doc.get("content", [])
    filtered_doc_contents = _clean_list_of_strings(doc_contents)
    resume_doc: ResumeDocType = {"doc_id": doc_id, "doc_name": doc_name}
    resume_doc["name"] = _get_resume_author_name(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["contacts"] = _get_resume_author_contacts(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["email"] = _get_resume_author_email(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["location"] = _get_resume_author_location(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["title"] = _get_resume_author_title(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["summary"] = _get_resume_summary(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["skills"] = _get_resume_skills(
        filtered_doc_contents=filtered_doc_contents
    )
    resume_doc["experiences"] = _get_resume_experiences(doc_contents)
    resume_doc["educations"] = _get_resume_educations(doc_contents)
    resume_doc["personal_projects"] = _get_resume_personal_projects(
        filtered_doc_contents=filtered_doc_contents
    )
    return resume_doc
