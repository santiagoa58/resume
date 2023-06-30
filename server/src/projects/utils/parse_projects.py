from typing import Optional, List, Dict


class ProjectUser:
    def __init__(
        self,
        name: Optional[str],
        avatar_url: str,
        gravatar_id: Optional[str],
        html_url: str,
        type: str,
    ):
        self.name = name
        self.avatar_url = avatar_url
        self.gravatar_id = gravatar_id
        self.html_url = html_url
        self.type = type

    def to_dict(self):
        return {
            "name": self.name,
            "avatar_url": self.avatar_url,
            "gravatar_id": self.gravatar_id,
            "html_url": self.html_url,
            "type": self.type,
        }


class Project:
    def __init__(
        self,
        id: int,
        name: str,
        full_name: str,
        owner: ProjectUser,
        private: bool,
        html_url: str,
        description: Optional[str],
        fork: bool,
        url: str,
        languages_url: str,
        homepage: Optional[str],
        language: Optional[str],
        forks_count: int,
        stargazers_count: int,
        watchers_count: int,
        size: int,
        default_branch: str,
        topics: List[str],
        archived: bool,
        disabled: bool,
        visibility: str,
        pushed_at: Optional[str],
        created_at: Optional[str],
        updated_at: Optional[str],
        subscribers_count: Optional[int],
        forks: int,
        open_issues: int,
        watchers: int,
        languages: List[str],
    ):
        self.id = id
        self.name = name
        self.full_name = full_name
        self.owner = owner
        self.private = private
        self.html_url = html_url
        self.description = description
        self.fork = fork
        self.url = url
        self.languages_url = languages_url
        self.homepage = homepage
        self.language = language
        self.forks_count = forks_count
        self.stargazers_count = stargazers_count
        self.watchers_count = watchers_count
        self.size = size
        self.default_branch = default_branch
        self.topics = topics
        self.archived = archived
        self.disabled = disabled
        self.visibility = visibility
        self.pushed_at = pushed_at
        self.created_at = created_at
        self.updated_at = updated_at
        self.subscribers_count = subscribers_count
        self.forks = forks
        self.open_issues = open_issues
        self.watchers = watchers
        self.languages = languages

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "full_name": self.full_name,
            "owner": self.owner.to_dict(),
            "private": self.private,
            "html_url": self.html_url,
            "description": self.description,
            "fork": self.fork,
            "url": self.url,
            "languages_url": self.languages_url,
            "homepage": self.homepage,
            "language": self.language,
            "forks_count": self.forks_count,
            "stargazers_count": self.stargazers_count,
            "watchers_count": self.watchers_count,
            "size": self.size,
            "default_branch": self.default_branch,
            "topics": self.topics,
            "archived": self.archived,
            "disabled": self.disabled,
            "visibility": self.visibility,
            "pushed_at": self.pushed_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "subscribers_count": self.subscribers_count,
            "forks": self.forks,
            "open_issues": self.open_issues,
            "watchers": self.watchers,
            "languages": self.languages,
        }


def _safe_get(dictionary: Dict, key: str, default=None):
    if dictionary is None:
        return default
    value = dictionary.get(key, default)
    return value


def _get_parsed_project(repo: Dict, languages: List[str]) -> Project:
    owner_info = _safe_get(repo, "owner", {})
    owner = ProjectUser(
        name=_safe_get(owner_info, "login", ""),
        avatar_url=_safe_get(owner_info, "avatar_url", ""),
        gravatar_id=_safe_get(owner_info, "gravatar_id", ""),
        html_url=_safe_get(owner_info, "html_url", ""),
        type=_safe_get(owner_info, "type", ""),
    )
    project = Project(
        id=_safe_get(repo, "id"),
        name=_safe_get(repo, "name", ""),
        full_name=_safe_get(repo, "full_name", ""),
        owner=owner,
        private=_safe_get(repo, "private"),
        html_url=_safe_get(repo, "html_url", ""),
        description=_safe_get(repo, "description", ""),
        fork=_safe_get(repo, "fork"),
        url=_safe_get(repo, "url", ""),
        languages_url=_safe_get(repo, "languages_url", ""),
        homepage=_safe_get(repo, "homepage", ""),
        language=_safe_get(repo, "language", ""),
        forks_count=_safe_get(repo, "forks_count"),
        stargazers_count=_safe_get(repo, "stargazers_count"),
        watchers_count=_safe_get(repo, "watchers_count"),
        size=_safe_get(repo, "size"),
        default_branch=_safe_get(repo, "default_branch", ""),
        topics=_safe_get(repo, "topics", []),
        archived=_safe_get(repo, "archived"),
        disabled=_safe_get(repo, "disabled"),
        visibility=_safe_get(repo, "visibility", ""),
        pushed_at=_safe_get(repo, "pushed_at", ""),
        created_at=_safe_get(repo, "created_at", ""),
        updated_at=_safe_get(repo, "updated_at", ""),
        subscribers_count=_safe_get(repo, "subscribers_count"),
        forks=_safe_get(repo, "forks"),
        open_issues=_safe_get(repo, "open_issues"),
        watchers=_safe_get(repo, "watchers"),
        languages=languages,
    )
    return project


def _get_languages_by_repo_name(
    languages_by_repo_name: Dict[str, List[str]], repo_name: str
):
    if repo_name is None or repo_name not in languages_by_repo_name:
        return []
    return languages_by_repo_name[repo_name]


def parse_projects(
    repos: List[Dict], languages_by_repo_name: Dict[str, List[str]]
) -> List[Project]:
    return [
        _get_parsed_project(
            repo, _get_languages_by_repo_name(languages_by_repo_name, repo.get("name"))
        )
        for repo in repos
    ]
