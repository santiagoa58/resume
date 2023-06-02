import json
from typing import List
from resumes.service.google_docs_service import (
    GoogleDocsReaderService,
    GoogleDriveDocType,
)
from googleapiclient.errors import HttpError as GoogleAPIHttpError
from resumes.utils.parse_google_doc import parse_google_doc, ResumeDocType
from dotenv import load_dotenv
import os
import re

# load environment variables
load_dotenv()


# get all resumes using GoogleDocsReaderService
def get_all_resumes(docs_reader: GoogleDocsReaderService) -> List[GoogleDriveDocType]:
    """Get all resumes from google docs"""
    folder_id = os.getenv("GOOGLE_RESUME_FOLDER_ID")
    return docs_reader.get_google_doc_ids(folder_id)


# handles the GET /resumes and /resumes/{id} requests
def lambda_handler(event, _context):
    """AWS Lambda Function Handler for GET /resumes and /resumes/{id}"""

    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    }
    response = {"statusCode": 200, "headers": headers}
    if event["httpMethod"] == "GET":
        docs_reader = GoogleDocsReaderService()
        try:
            if event["path"] == "/resumes":
                resumes = get_all_resumes(docs_reader)
                return {
                    **response,
                    "body": json.dumps(resumes),
                }
            # check if the request has a path parameter of /resumes/{id}
            elif re.match(r"^/resumes/(.+)$", event["path"]):
                resume_id = event["pathParameters"]["id"]
                resume = docs_reader.get_google_doc(resume_id)
                resume_json = parse_google_doc(resume)
                return {
                    **response,
                    "body": json.dumps(resume_json),
                }
        except GoogleAPIHttpError as e:
            return {
                **response,
                "statusCode": e.resp.status,
                "body": json.dumps(e.error_details),
            }
        except Exception as e:
            # an unknown error occurred
            return {**response, "statusCode": 500, "body": json.dumps(str(e))}
    # return error if the request is not a GET request or if the path parameter is not /resumes or /resumes/{id}
    return {**response, "statusCode": 400, "body": json.dumps("Bad Request")}
