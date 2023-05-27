from service.google_docs_service import GoogleDocsReader
from dotenv import load_dotenv
import os

# load environment variables
load_dotenv()


# test retriving google docs from google drive
def test_get_google_docs():
    docs_reader = GoogleDocsReader()
    folder_id = os.getenv("GOOGLE_RESUME_FOLDER_ID")
    docs = docs_reader.get_google_doc_ids(folder_id)
    # expect docs to be a list
    assert isinstance(docs, list)
    # expect docs to have at least one item
    assert len(docs) > 0
    # expect docs to have a name and id
    doc_name = docs[0].get("name")
    doc_id = docs[0].get("id")
    assert doc_name is not None
    assert doc_id is not None
    # expect doc_id to be a string
    assert isinstance(doc_id, str)
    # expect doc_name to be a string
    assert isinstance(doc_name, str)


if __name__ == "__main__":
    test_get_google_docs()
