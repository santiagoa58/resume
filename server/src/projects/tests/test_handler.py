# test project handler
from projects.handler import lambda_handler
import json


#  get test event
def _get_test_event(path: str = "projects", queryStringParameters: str ={}, pathParameters: str = {}) -> dict:
    return {
        "body": "ec4c9d18-bd19-4601-b283-aca637d01b15",
        "resource": "/{proxy+}",
        "path": f"/{path}",
        "httpMethod": "GET",
        "isBase64Encoded": True,
        "queryStringParameters": queryStringParameters,
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


def test_lambda_handler_get_all_projects():
    response = lambda_handler(_get_test_event(), None)
    # ensure response has the correct headers
    assert response["headers"]["Access-Control-Allow-Origin"] == "*"
    assert response["headers"]["Access-Control-Allow-Methods"] == "GET, OPTIONS"
    assert response["statusCode"] == 200
    assert response["body"] is not None
    projects = json.loads(response["body"])
    assert isinstance(projects, list)
    assert len(projects) > 0
    project_name = projects[0].get("name")
    project_id = projects[0].get("id")
    assert project_name is not None
    assert project_id is not None
    assert isinstance(projects[0]["languages"], list)
    assert len(projects[0]["languages"]) > 0


def test_lambda_handler_get_frontend_projects():
    # simulate a GET request to /projects?filters=frontend
    response = lambda_handler(
        _get_test_event("projects", {"filters": "frontend"}), None
    )
    # ensure response has the correct headers
    assert response["headers"]["Access-Control-Allow-Origin"] == "*"
    assert response["headers"]["Access-Control-Allow-Methods"] == "GET, OPTIONS"
    assert response["statusCode"] == 200
    projects = json.loads(response["body"])
    assert isinstance(projects, list)
    assert len(projects) > 0
    project_name = projects[0].get("name")
    project_id = projects[0].get("id")
    assert project_name is not None
    assert project_id is not None
    assert isinstance(projects[0]["languages"], list)
    assert len(projects[0]["languages"]) > 0
    assert all("frontend" in project.get("topics", []) for project in projects)


if __name__ == "__main__":
    test_lambda_handler_get_all_projects()
