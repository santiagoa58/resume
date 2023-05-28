import json
from typing import List
from service.google_docs_service import GoogleDocsReaderService, GoogleDriveDocType
from dotenv import load_dotenv
import os
import re

# load environment variables
load_dotenv()


# get all resumes using GoogleDocsReaderService
def get_all_resumes() -> List[GoogleDriveDocType]:
    """Get all resumes from google docs"""
    docs_reader = GoogleDocsReaderService()
    folder_id = os.getenv("GOOGLE_RESUME_FOLDER_ID")
    print(f"folder_id: {folder_id}")
    return docs_reader.get_google_doc_ids(folder_id)


# handles the GET /resumes and /resumes/{id} requests
def lambda_handler(event, _context):
    """AWS Lambda Function Handler for GET /resumes and /resumes/{id}"""
    # check if the request is a GET request
    if event["httpMethod"] == "GET":
        # check if the request has a path parameter of /resumes
        if event["path"] == "/resumes":
            # get all the resume names and ids
            resumes = get_all_resumes()
            # return the resume names and ids
            return {"statusCode": 200, "body": json.dumps(resumes)}
        # check if the request has a path parameter of /resumes/{id}
        elif re.match(r"^/resumes/(.+)$", event["path"]):
            # TODO implement
            return {"statusCode": 200, "body": json.dumps("Hello from Lambda!")}
    # return error if the request is not a GET request or if the path parameter is not /resumes or /resumes/{id}
    return {"statusCode": 400, "body": json.dumps("Bad Request")}
