# import libraries to make a script to build the server
import os
import shutil
import subprocess
import sys


# install dependencies from requirements.txt to src directory
def install_dependencies(destination_path: str, requirements_path: str = None):
    subprocess.run(
        [
            sys.executable,
            "-m",
            "pip",
            "install",
            "-r",
            f"{requirements_path}/requirements.txt"
            if requirements_path
            else "requirements.txt",
            "-t",
            destination_path,
        ],
        check=True,
    )


# function that creates a package directory for the server
def create_package_dir(name: str, source_code_path: str = "src/api"):
    if os.path.exists(f"package/{name}"):
        shutil.rmtree(f"package/{name}")
    # copy src directory to package directory but ignore tests and __pycache__ directories
    shutil.copytree(
        f"{source_code_path}/{name}",
        f"package/{name}",
        ignore=shutil.ignore_patterns("tests", "__pycache__"),
    )


def build():
    # resumes lambda
    create_package_dir("resumes")
    # projects lambda
    create_package_dir("projects")
    # common layer
    create_package_dir("common", "src")
    install_dependencies("package/common")


if __name__ == "__main__":
    build()
