from googleapiclient.discovery import build
from typing import List, TypedDict
from google.oauth2.service_account import Credentials
from service.manage_secrets import SecretsManager
import os
from dotenv import load_dotenv


# google doc type returned from google drive
class GoogleDriveDocType(TypedDict):
    id: str
    name: str


# load environment variables
load_dotenv()


# class GoogleDocsReader used to read google docs from google drive
class GoogleDocsReader:
    # constructor
    def __init__(self):
        docs_secrets_manager = SecretsManager(os.getenv("AWS_REGION"))
        api_key_secrets = docs_secrets_manager.get_secret(
            os.getenv("GOOGLE_DOCS_API_KEY_SECRET_NAME")
        )
        creds = Credentials.from_service_account_info(api_key_secrets)
        self.docs_service = build("docs", "v1", credentials=creds)
        self.drive_service = build("drive", "v3", credentials=creds)

    # get google doc ids from google drive
    def get_google_doc_ids(self, folder_id: str) -> List[GoogleDriveDocType]:
        all_docs: List[GoogleDriveDocType] = []
        has_next_page = True
        next_page_token = None
        # get all google docs in the folder
        while has_next_page:
            results = (
                self.drive_service.files()
                .list(
                    q=f"'{folder_id}' in parents",
                    fields="nextPageToken, files(id, name)",
                    pageToken=next_page_token,
                )
                .execute()
            )
            all_docs.extend(results.get("files", []))
            # get next page of results
            next_page_token = results.get("nextPageToken", None)
            has_next_page = next_page_token is not None
        return all_docs

    # get google doc
    # def get_google_doc(self, doc_id: str) -> str:
    # doc = self.service.documents().get(documentId=doc_id).execute()
    # return doc.get("body").get("content")

    # read and return the contents of the google doc
    # def read_google_doc(self, doc_id: str) -> str:
    #     doc = self.get_google_doc(doc_id)
    #     doc_content = ""
    #     for element in doc:
    #         if "paragraph" in element:
    #             for value in element["paragraph"]["elements"]:
    #                 doc_content += value["textRun"]["content"]
    #     return doc_content
