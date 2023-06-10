import json
import os
import requests
from typing import List, Dict
from common.service.manage_secrets import SecretsManagerService
from dotenv import load_dotenv

# load environment variables
load_dotenv()

ProjectType = Dict[str, any]  # Define this type according to your needs


class ProjectsReaderService:
    # constructor
    def __init__(self):
        projects_secrets_manager = SecretsManagerService(os.getenv("AWS_REGION"))
        access_token = projects_secrets_manager.get_secret(
            os.getenv("PROJECTS_ACCESS_TOKEN_SECRET_NAME")
        )["github_token"]
        self.auth_headers = {
            "Authorization": f"token {access_token}",
            "Accept": "application/vnd.github.v3+json",
        }
        self.base_url = os.getenv("PROJECTS_BASE_URL")
        self.username = os.getenv("PROJECTS_USERNAME")

    # get a single project's languages from github api
    def get_project_languages(self, project_name: str) -> List[str]:
        languages_url = (
            f"{self.base_url}/repos/{self.username}/{project_name}/languages"
        )
        languages_response = requests.get(languages_url, headers=self.auth_headers)
        if languages_response.status_code != 200:
            raise Exception(languages_response.json())
        return list(languages_response.json().keys())

    # get github projects from github api
    def get_projects(self) -> List[ProjectType]:
        repos_url = f"{self.base_url}/users/{self.username}/repos"
        repos_response = requests.get(repos_url, headers=self.auth_headers)
        if repos_response.status_code != 200:
            raise Exception(repos_response.json())
        repos = repos_response.json()
        for repo in repos:
            languages = self.get_project_languages(repo["name"])
            repo["languages"] = languages
        # Sort repos by updated_at in descending order (most recent first)
        repos.sort(key=lambda repo: repo["updated_at"], reverse=True)

        return repos


def lambda_handler(event, _context):
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Content-Type": "application/json",
    }
    response = {"statusCode": 200, "headers": headers}
    if event["httpMethod"] == "GET" and event["path"] == "/projects":
        service = ProjectsReaderService()
        try:
            projects = service.get_projects()
            return {
                **response,
                "statusCode": 200,
                "body": json.dumps(projects),
            }
        except Exception as e:
            return {**response, "statusCode": 500, "body": json.dumps(str(e))}
    # return error if the request is not a GET projects request
    return {**response, "statusCode": 400, "body": json.dumps("Bad Request")}
