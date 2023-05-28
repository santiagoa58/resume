import json
from typing import List
from service.google_docs_service import GoogleDocsReaderService, GoogleDriveDocType
from googleapiclient.errors import HttpError as GoogleAPIHttpError
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

    if event["httpMethod"] == "GET":
        docs_reader = GoogleDocsReaderService()
        try:
            if event["path"] == "/resumes":
                resumes = get_all_resumes(docs_reader)
                return {"statusCode": 200, "body": json.dumps(resumes)}
            # check if the request has a path parameter of /resumes/{id}
            elif re.match(r"^/resumes/(.+)$", event["path"]):
                resume_id = event["pathParameters"]["id"]
                resume = docs_reader.get_google_doc(resume_id)
                return {"statusCode": 200, "body": json.dumps(resume)}
        except GoogleAPIHttpError as e:
            return {"statusCode": e.resp.status, "body": json.dumps(e.error_details)}
        except Exception as e:
            # an unknown error occurred
            return {"statusCode": 500, "body": json.dumps(str(e))}
    # return error if the request is not a GET request or if the path parameter is not /resumes or /resumes/{id}
    return {"statusCode": 400, "body": json.dumps("Bad Request")}
