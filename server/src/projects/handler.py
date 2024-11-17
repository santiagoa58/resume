import json
import os
import requests
from typing import List, Dict
from dotenv import load_dotenv
from projects.utils.parse_projects import parse_projects, Project

# load environment variables
load_dotenv()


class ProjectsReaderService:
    # constructor
    def __init__(self):
        access_token = os.getenv("GITHUB_PROJECTS_ACCESS_TOKEN")
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

    # get a map of project names to languages from github api
    def get_languages_by_repo_name(self, repos: List[Project]) -> Dict[str, List[str]]:
        languages_by_repo_name = {}
        for repo in repos:
            repo_name = repo["name"]
            languages = self.get_project_languages(repo_name)
            languages_by_repo_name[repo_name] = languages
        return languages_by_repo_name

    # get github projects from github api
    def get_projects(self) -> List[Dict[str, any]]:
        repos_url = f"{self.base_url}/users/{self.username}/repos"
        repos_response = requests.get(repos_url, headers=self.auth_headers)
        if repos_response.status_code != 200:
            raise Exception(repos_response.json())
        repos = repos_response.json()
        languages_by_repo_name = self.get_languages_by_repo_name(repos)
        parsed_repos = parse_projects(repos, languages_by_repo_name)
        return [repo.to_dict() for repo in parsed_repos]


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
            # process a GET request like /projects?filters=frontend
            # if filters are provided, filter the projects by the topics
            # if no filters are provided, return all projects
            filter = event["queryStringParameters"]
            projects = service.get_projects()
            if filter:
                filters = filter.get("filters").split(",")
                projects = [
                    project
                    for project in projects
                    if all(topic in project.get("topics", []) for topic in filters)
                ]
            return {
                **response,
                "statusCode": 200,
                "body": json.dumps(projects),
            }
        except Exception as e:
            return {**response, "statusCode": 500, "body": json.dumps(str(e))}
    # return error if the request is not a GET projects request
    return {**response, "statusCode": 400, "body": json.dumps("Bad Request")}
