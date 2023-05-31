import api.resumes.handler as handler
import json

TEST_RESUME_DOC_JSON_RESPONSE = {
    "doc_id": "ec4c9d18-bd19-4601-b283-aca637d01b15",
    "doc_name": "Resume File Google Doc Name",
    "name": "NAME",
    "contacts": [
        "github.com/name",
        "name@email.com",
        "linkedin.com/in/name",
    ],
    "location": "Open to Relocation",
    "title": "SOFTWARE ENGINEER",
    "summary": "Software Engineer with 3+ years of experience in developing web applications.",
    "skills": [
        "TypeScript",
        "JavaScript",
        "React",
        "Redux",
        "Next.js",
        "Node.js",
        "Express.js",
        "Python",
        "Flask",
        "Java",
        "Spring",
        "SQL",
        "PostgreSQL",
        "MongoDB",
        "AWS",
        "Docker",
        "Kubernetes",
        "Terraform",
        "Git",
        "GitHub",
        "Bitbucket",
    ],
    "experiences": [
        {
            "company": "Google",
            "location": "San Francisco, CA",
            "duration": "June 2019 - Present",
            "role": "Software Engineer",
            "responsibilities": [
                "Developed a web application for the Google Cloud Platform (GCP) that enables users to manage their GCP resources, which led to a 20% increase in user engagement.",
                "Implemented a new feature for the GCP web application that enables users to manage their GCP resources, which led to a 20% increase in user engagement.",
            ],
        },
        {
            "company": "Facebook",
            "location": "Menlo Park, CA",
            "duration": "June 2018 - June 2019",
            "role": "Software Engineer",
            "responsibilities": [
                "Developed a web application for the Facebook Cloud Platform (FCP) that enables users to manage their FCP resources, which led to a 20% increase in user engagement.",
                "Implemented a new feature for the FCP web application that enables users to manage their FCP resources, which led to a 20% increase in user engagement.",
            ],
        },
    ],
    "educations": [
        {
            "degree": "Bachelor of Science in Computer Science",
            "institution": "University of California, Berkeley",
            "duration": "September 2015 - June 2018",
        }
    ],
    "personal_projects": [
        {"name": "Project 1", "description": "Project 1 description"}
    ],
}


# get test event
def _get_test_event(path: str = "resumes", pathParameters: str = {}) -> dict:
    return {
        "body": "ec4c9d18-bd19-4601-b283-aca637d01b15",
        "resource": "/{proxy+}",
        "path": f"/{path}",
        "httpMethod": "GET",
        "isBase64Encoded": True,
        "queryStringParameters": {"foo": "bar"},
        "multiValueQueryStringParameters": {"foo": ["bar"]},
        "pathParameters": pathParameters,
        "stageVariables": {"baz": "qux"},
        "headers": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, sdch",
            "Accept-Language": "en-US,en;q=0.8",
            "Cache-Control": "max-age=0",
            "CloudFront-Forwarded-Proto": "https",
            "CloudFront-Is-Desktop-Viewer": "true",
            "CloudFront-Is-Mobile-Viewer": "false",
            "CloudFront-Is-SmartTV-Viewer": "false",
            "CloudFront-Is-Tablet-Viewer": "false",
            "CloudFront-Viewer-Country": "US",
            "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Custom User Agent String",
            "Via": "1.1 2dc5d267-41c4-4813-8109-9ef0a2a3bb08.cloudfront.net (CloudFront)",
            "X-Amz-Cf-Id": "7b869b3c-a5f5-4a77-be44-c374c806d5e1==",
            "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
            "X-Forwarded-Port": "443",
            "X-Forwarded-Proto": "https",
        },
        "multiValueHeaders": {
            "Accept": [
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
            ],
            "Accept-Encoding": ["gzip, deflate, sdch"],
            "Accept-Language": ["en-US,en;q=0.8"],
            "Cache-Control": ["max-age=0"],
            "CloudFront-Forwarded-Proto": ["https"],
            "CloudFront-Is-Desktop-Viewer": ["true"],
            "CloudFront-Is-Mobile-Viewer": ["false"],
            "CloudFront-Is-SmartTV-Viewer": ["false"],
            "CloudFront-Is-Tablet-Viewer": ["false"],
            "CloudFront-Viewer-Country": ["US"],
            "Host": ["0123456789.execute-api.us-east-1.amazonaws.com"],
            "Upgrade-Insecure-Requests": ["1"],
            "User-Agent": ["Custom User Agent String"],
            "Via": [
                "1.1 da151c0e-3de4-4686-82e7-7270183a8fdd.cloudfront.net (CloudFront)"
            ],
            "X-Amz-Cf-Id": ["82d5026c-a704-4ed4-971e-8feec4bf64c9=="],
            "X-Forwarded-For": ["127.0.0.1, 127.0.0.2"],
            "X-Forwarded-Port": ["443"],
            "X-Forwarded-Proto": ["https"],
        },
        "requestContext": {
            "accountId": "123456789012",
            "resourceId": "123456",
            "stage": "prod",
            "requestId": "28ae6867-5243-4262-b1a9-cef8a952be4f",
            "requestTime": "09/Apr/2015:12:34:56 +0000",
            "requestTimeEpoch": 1428582896000,
            "identity": {
                "cognitoIdentityPoolId": None,
                "accountId": None,
                "cognitoIdentityId": None,
                "caller": None,
                "accessKey": None,
                "sourceIp": "127.0.0.1",
                "cognitoAuthenticationType": None,
                "cognitoAuthenticationProvider": None,
                "userArn": None,
                "userAgent": "Custom User Agent String",
                "user": None,
            },
            "path": f"/prod/{path}",
            "resourcePath": "/{proxy+}",
            "httpMethod": "GET",
            "apiId": "1234567890",
            "protocol": "HTTP/1.1",
        },
    }


# ensures that the api response is a json response with the correct fields
def _assert_api_json_resume_doc_response(json_response: dict):
    assert json_response.keys() == TEST_RESUME_DOC_JSON_RESPONSE.keys()
    # assert that the values are the correct type
    for key in json_response.keys():
        assert isinstance(json_response[key], type(TEST_RESUME_DOC_JSON_RESPONSE[key]))
        if isinstance(json_response[key], list):
            for item in json_response[key]:
                assert isinstance(item, type(TEST_RESUME_DOC_JSON_RESPONSE[key][0]))
        elif isinstance(json_response[key], dict):
            for nested_key in json_response[key].keys():
                assert isinstance(
                    json_response[key][nested_key],
                    type(TEST_RESUME_DOC_JSON_RESPONSE[key][nested_key]),
                )


def test_lambda_handler_get_all_resumes():
    response = handler.lambda_handler(_get_test_event(), None)
    assert response["statusCode"] == 200
    assert response["body"] is not None
    resumes = json.loads(response["body"])
    assert isinstance(resumes, list)
    assert len(resumes) > 0
    resume_name = resumes[0].get("name")
    resume_id = resumes[0].get("id")
    assert resume_name is not None
    assert resume_id is not None


def test_lambda_handler_get_resume_with_id():
    all_resumes_response = handler.lambda_handler(_get_test_event(), None)
    all_resumes = json.loads(all_resumes_response["body"])
    first_resume = all_resumes[0]
    resume_doc_response = handler.lambda_handler(
        _get_test_event(
            f"resumes/{first_resume.get('id')}", {"id": first_resume.get("id")}
        ),
        None,
    )
    assert resume_doc_response["statusCode"] == 200
    assert resume_doc_response["body"] is not None
    resume = json.loads(resume_doc_response["body"])
    assert isinstance(resume, dict)
    _assert_api_json_resume_doc_response(resume)


# test bad request
def test_lambda_handler_bad_request():
    # test GET request with invalid path
    response = handler.lambda_handler(
        _get_test_event("bad_request", {"id": "123"}), None
    )
    assert response["statusCode"] == 400
    assert response["body"] is not None
    assert response["body"] == '"Bad Request"'
    # test getting doc with invalid id
    response = handler.lambda_handler(
        _get_test_event("resumes/123", {"id": "123"}), None
    )
    assert response["statusCode"] == 404
    assert response["body"] is not None


if __name__ == "__main__":
    test_lambda_handler_get_all_resumes()
    test_lambda_handler_get_resume_with_id()
    test_lambda_handler_bad_request()
