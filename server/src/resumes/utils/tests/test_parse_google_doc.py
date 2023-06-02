from resumes.utils.parse_google_doc import parse_google_doc
from resumes.service.google_docs_service import GoogleDocType

TEST_GOOGLE_DOC_CONTENTS = [
    "Firstname Lastname\n",
    "website.com/lorem |  lorem@ipsum.com |  linkedin.com/in/lorem | Open to Relocation\n",
    "\n",
    "FULL STACK SOFTWARE ENGINEER\n",
    "Consectetur adipiscing elit. \n",
    "\n",
    "SKILLS\n",
    "TypeScript, JavaScript | Agile Methodologies | React, Redux | TDD, Unit Testing, Jest | Webpack | Babel | Frontend Optimization Techniques | Design Patterns & MVC | REST APIs | Familiarity with Python | Introductory AWS Knowledge | Experience in setting up CI/CD pipelines using GitHub Actions | Dev Tools Debugging\n",
    "\n",
    "EXPERIENCE\n",
    "Google, Sydney, TT                                                                                                                                                  MAY 2013 - PRESENT\n",
    "Software Engineer \t\n",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius diam sit amet est semper, a bibendum ante ultricies. Vivamus pulvinar nisi ac lobortis consectetur. Donec semper tortor non sapien commodo, et lacinia nunc ornare.\n",
    "Fusce sagittis, elit nec molestie tempor, neque velit aliquam purus, in ultrices turpis est ut nunc. Cras egestas nisl nec felis scelerisque, vitae interdum lectus facilisis. Sed auctor diam sit amet nunc commodo, in commodo nunc fringilla.\n",
    "Lorem something ipsum so dolor sit ament elit nec molestie neque velit aliquam purus\n",
    "\n",
    "Reddit, New York, NY                                                                                               JUNE 2019 - MAY 2022\n",
    "Dolor Sit Amet \n",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id lacus lorem. Integer consequat, nunc at dictum blandit, orci turpis pharetra nulla, a interdum mauris arcu eget sapien.\n",
    "\n",
    "EDUCATION\n",
    "Bachelor of Science in Dolor Science, School University College                                                     SEPTEMBER 2015 - JUNE 2018\n",
    "\n",
    "\n",
    "PERSONAL PROJECT\n",
    "lorem.project.com\n",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id lacus lorem. Integer consequat, nunc at dictum blandit, orci turpis pharetra nulla, a interdum mauris arcu eget sapien.\n",
]


def test_parse_google_doc():
    google_doc: GoogleDocType = {
        "id": "ec4c9d18-bd19-4601-b283-aca637d01b15",
        "name": "Resume File Google Doc Name",
        "content": TEST_GOOGLE_DOC_CONTENTS,
    }
    resume_json = parse_google_doc(google_doc)
    # check if the resume json is the same as the expected resume json
    assert resume_json.get("doc_id") == "ec4c9d18-bd19-4601-b283-aca637d01b15"
    assert resume_json.get("doc_name") == "Resume File Google Doc Name"
    assert resume_json.get("name") == "Firstname Lastname"
    assert resume_json.get("contacts") == [
        "website.com/lorem",
        "lorem@ipsum.com",
        "linkedin.com/in/lorem",
    ]
    assert resume_json.get("location") == "Open to Relocation"
    assert resume_json.get("title") == "FULL STACK SOFTWARE ENGINEER"
    assert resume_json.get("summary") == "Consectetur adipiscing elit."
    assert resume_json.get("skills") == [
        "TypeScript",
        "JavaScript",
        "Agile Methodologies",
        "React",
        "Redux",
        "TDD",
        "Unit Testing",
        "Jest",
        "Webpack",
        "Babel",
        "Frontend Optimization Techniques",
        "Design Patterns & MVC",
        "REST APIs",
        "Familiarity with Python",
        "Introductory AWS Knowledge",
        "Experience in setting up CI/CD pipelines using GitHub Actions",
        "Dev Tools Debugging",
    ]
    assert resume_json.get("experiences") == [
        {
            "company": "Google",
            "location": "Sydney, TT",
            "duration": "MAY 2013 - PRESENT",
            "role": "Software Engineer",
            "responsibilities": [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed varius diam sit amet est semper, a bibendum ante ultricies. Vivamus pulvinar nisi ac lobortis consectetur. Donec semper tortor non sapien commodo, et lacinia nunc ornare.",
                "Fusce sagittis, elit nec molestie tempor, neque velit aliquam purus, in ultrices turpis est ut nunc. Cras egestas nisl nec felis scelerisque, vitae interdum lectus facilisis. Sed auctor diam sit amet nunc commodo, in commodo nunc fringilla.",
                "Lorem something ipsum so dolor sit ament elit nec molestie neque velit aliquam purus",
            ],
        },
        {
            "company": "Reddit",
            "location": "New York, NY",
            "duration": "JUNE 2019 - MAY 2022",
            "role": "Dolor Sit Amet",
            "responsibilities": [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id lacus lorem. Integer consequat, nunc at dictum blandit, orci turpis pharetra nulla, a interdum mauris arcu eget sapien."
            ],
        },
    ]
    assert resume_json.get("educations") == [
        {
            "degree": "Bachelor of Science in Dolor Science",
            "institution": "School University College",
            "duration": "SEPTEMBER 2015 - JUNE 2018",
        }
    ]
    assert resume_json.get("personal_projects") == [
        {
            "name": "lorem.project.com",
            "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id lacus lorem. Integer consequat, nunc at dictum blandit, orci turpis pharetra nulla, a interdum mauris arcu eget sapien.",
        }
    ]


def test_parse_empty_google_doc():
    assert parse_google_doc({}) == {}
    assert parse_google_doc(None) == {}
    google_doc: GoogleDocType = {
        "id": "ec4c9d18-bd19-4601-b283-aca637d01b15",
        "name": "Resume File Google Doc Name",
        "content": [],
    }
    resume_json = parse_google_doc(google_doc)
    assert resume_json == {}


if __name__ == "__main__":
    test_parse_google_doc()
    test_parse_empty_google_doc()
