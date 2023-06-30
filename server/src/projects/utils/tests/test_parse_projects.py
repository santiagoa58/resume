import projects.utils.parse_projects as parse_projects

TEST_REPO = {
    "id": 1,
    "name": "test_name",
    "full_name": "test_full_name",
    "owner": {
        "login": "test_login",
        "avatar_url": "test_avatar_url",
        "gravatar_id": "test_gravatar_id",
        "html_url": "test_owner_html_url",
        "type": "test_type",
    },
    "private": False,
    "html_url": "test_html_url",
    "description": "test_description",
    "fork": False,
    "url": "test_url",
    "languages_url": "test_languages_url",
    "homepage": "test_homepage",
    "language": "test_language",
    "forks_count": 1,
    "stargazers_count": 1,
    "watchers_count": 1,
    "size": 1,
    "default_branch": "test_default_branch",
    "topics": ["test_topic"],
    "archived": False,
    "disabled": False,
    "visibility": "test_visibility",
    "pushed_at": "test_pushed_at",
    "created_at": "test_created_at",
    "updated_at": "test_updated_at",
    "subscribers_count": 1,
    "forks": 1,
    "open_issues": 1,
    "watchers": 1,
}


def test_parse_valid_projects():
    repos = [TEST_REPO]
    languages_by_repo_name = {"test_name": ["test"]}
    projects = parse_projects.parse_projects(repos, languages_by_repo_name)
    assert len(projects) == 1
    assert projects[0].id == 1
    assert projects[0].name == "test_name"
    assert projects[0].full_name == "test_full_name"
    assert projects[0].owner.name == "test_login"
    assert projects[0].owner.avatar_url == "test_avatar_url"
    assert projects[0].owner.gravatar_id == "test_gravatar_id"
    assert projects[0].owner.html_url == "test_owner_html_url"
    assert projects[0].owner.type == "test_type"
    assert projects[0].private is False
    assert projects[0].html_url == "test_html_url"
    assert projects[0].description == "test_description"
    assert projects[0].fork is False
    assert projects[0].url == "test_url"
    assert projects[0].languages_url == "test_languages_url"
    assert projects[0].homepage == "test_homepage"
    assert projects[0].language == "test_language"
    assert projects[0].forks_count == 1
    assert projects[0].stargazers_count == 1
    assert projects[0].watchers_count == 1
    assert projects[0].size == 1
    assert projects[0].default_branch == "test_default_branch"
    assert len(projects[0].topics) == 1
    assert projects[0].topics[0] == "test_topic"
    assert projects[0].archived == False
    assert projects[0].disabled == False
    assert projects[0].visibility == "test_visibility"
    assert projects[0].pushed_at == "test_pushed_at"
    assert projects[0].created_at == "test_created_at"
    assert projects[0].updated_at == "test_updated_at"
    assert projects[0].subscribers_count == 1
    assert projects[0].forks == 1
    assert projects[0].open_issues == 1
    assert projects[0].watchers == 1
    assert len(projects[0].languages) == 1
    assert projects[0].languages[0] == "test"


def test_parse_projects_with_no_languages():
    repos = [TEST_REPO]
    languages_by_repo_name = {"non_existing_repo_name": ["test"]}
    projects = parse_projects.parse_projects(repos, languages_by_repo_name)
    assert len(projects[0].languages) == 0


def test_parse_projects_with_invalid_repos():
    repos = [{}]
    languages_by_repo_name = {"test_name": ["test"]}
    projects = parse_projects.parse_projects(repos, languages_by_repo_name)
    # Should not raise an exception
    assert len(projects) == 1
    # default values should be present in the project if none were provided
    owner = projects[0].owner
    assert owner is not None
    assert owner.name == ""
    assert owner.avatar_url == ""
    assert owner.gravatar_id == ""
    assert owner.html_url == ""
    assert owner.type == ""
    assert projects[0].id == None
    assert projects[0].name == ""
    assert projects[0].full_name == ""
    assert projects[0].private == None
    assert projects[0].html_url == ""
    assert projects[0].description == ""
    assert projects[0].fork == None
    assert projects[0].url == ""
    assert projects[0].languages_url == ""
    assert projects[0].homepage == ""
    assert projects[0].language == ""
    assert projects[0].forks_count == None
    assert projects[0].stargazers_count == None
    assert projects[0].watchers_count == None
    assert projects[0].size == None
    assert projects[0].default_branch == ""
    assert projects[0].topics == []
    assert projects[0].archived == None
    assert projects[0].disabled == None
    assert projects[0].visibility == ""
    assert projects[0].pushed_at == ""
    assert projects[0].created_at == ""
    assert projects[0].updated_at == ""
    assert projects[0].subscribers_count == None
    assert projects[0].forks == None
    assert projects[0].open_issues == None
    assert projects[0].watchers == None


if __name__ == "__main__":
    test_parse_valid_projects()
    test_parse_projects_with_no_languages()
    test_parse_projects_with_invalid_repos()
