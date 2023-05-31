from api.resumes.service.google_docs_service import GoogleDocsReaderService
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv()


# test retriving google docs from google drive
def test_get_google_docs():
    docs_reader = GoogleDocsReaderService()
    folder_id = os.getenv("GOOGLE_RESUME_FOLDER_ID")
    docs = docs_reader.get_google_doc_ids(folder_id)
    assert isinstance(docs, list)
    assert len(docs) > 0
    doc_name = docs[0].get("name")
    doc_id = docs[0].get("id")
    assert doc_name is not None
    assert doc_id is not None
    assert isinstance(doc_id, str)
    assert isinstance(doc_name, str)


# test getting a google doc and its contents
def test_get_google_doc():
    docs_reader = GoogleDocsReaderService()
    folder_id = os.getenv("GOOGLE_RESUME_FOLDER_ID")
    docs = docs_reader.get_google_doc_ids(folder_id)
    doc_id = docs[0].get("id")
    doc = docs_reader.get_google_doc(doc_id)
    assert isinstance(doc, dict)
    assert doc.get("id") is not None
    assert doc.get("name") is not None
    assert doc.get("content") is not None
    assert isinstance(doc.get("id"), str)
    assert isinstance(doc.get("name"), str)
    assert isinstance(doc.get("content"), list)


if __name__ == "__main__":
    test_get_google_docs()
    test_get_google_doc()
