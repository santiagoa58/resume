from googleapiclient.discovery import build
from typing import List, TypedDict
from google.oauth2.service_account import Credentials
import os
from dotenv import load_dotenv


# google doc type returned from google drive
class GoogleDriveDocType(TypedDict):
    # id of the google doc
    id: str
    # name of the google doc
    name: str


# google doc type returned from google docs
class GoogleDocType(TypedDict):
    # id of the google doc
    id: str
    # name of the google doc
    name: str
    # list of paragraphs in the google doc
    content: List[str]


# load environment variables
load_dotenv()


# class GoogleDocsReader used to read google docs from google drive
class GoogleDocsReaderService:
    # constructor
    def __init__(self):
        docs_api_info = {
            "type": os.getenv("GOOGLE_DOCS_API_KEY_ACCOUNT_TYPE"),
            "project_id": os.getenv("GOOGLE_DOCS_API_KEY_PROJECT_ID"),
            "private_key_id": os.getenv("GOOGLE_DOCS_API_PRIVATE_KEY_ID"),
            "private_key": os.getenv("GOOGLE_DOCS_API_PRIVATE_KEY").replace(
                "\\n", "\n"
            ),
            "client_email": os.getenv("GOOGLE_DOCS_API_CLIENT_EMAIL"),
            "client_id": os.getenv("GOOGLE_DOCS_API_CLIENT_ID"),
            "auth_uri": os.getenv("GOOGLE_DOCS_API_AUTH_URI"),
            "token_uri": os.getenv("GOOGLE_DOCS_API_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv(
                "GOOGLE_DOCS_API_AUTH_PROVIDER_CERT_URL"
            ),
            "client_x509_cert_url": os.getenv("GOOGLE_DOCS_API_CLIENT_CERT_URL"),
            "universe_domain": os.getenv("GOOGLE_DOCS_API_UNIVERSE_DOMAIN"),
        }
        creds = Credentials.from_service_account_info(docs_api_info)
        self._docs_service = build("docs", "v1", credentials=creds)
        self._drive_service = build("drive", "v3", credentials=creds)

    # get google doc ids from google drive
    def get_google_doc_ids(self, folder_id: str) -> List[GoogleDriveDocType]:
        all_docs: List[GoogleDriveDocType] = []
        has_next_page = True
        next_page_token = None
        # get all google docs in the folder
        while has_next_page:
            results = (
                self._drive_service.files()
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

    # get a single google doc from google drive
    def get_google_doc(self, doc_id: str) -> dict:
        resume_response = (
            self._docs_service.documents().get(documentId=doc_id).execute()
        )
        return self._get_google_doc_contents(resume_response)

    # get the contents of a google doc
    def _get_google_doc_contents(self, resume_response: dict) -> GoogleDocType:
        """converts a google_doc response into a GoogleDocType"""
        name = resume_response.get("title")
        id = resume_response.get("documentId")
        content = resume_response.get("body", {}).get("content", [])
        # get all the paragraph strings from the google doc
        paragraphs: List[str] = []
        for content_item in content:
            paragraph = content_item.get("paragraph", None)
            if paragraph is not None:
                # combine all the text from each paragraph element into one string
                elements = paragraph.get("elements", [])
                paragraph_text_content = ""
                for element in elements:
                    element_text = element.get("textRun", {}).get("content", "")
                    if element_text and isinstance(element_text, str):
                        paragraph_text_content += element_text
                paragraphs.append(paragraph_text_content)
        return {
            "name": name,
            "id": id,
            "content": paragraphs,
        }
