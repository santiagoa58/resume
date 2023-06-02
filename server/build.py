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


### function that creates a package directory for the server
# the output directory will be package/{name} where name is the name of the package
# the package folder structure will be:
# package/{name}
#   - {name} (the source code)
#   - handler.py (aws lambda handler file at the root of the package directory)
def create_package_dir(name: str, source_code_path: str = "src"):
    if os.path.exists(f"package/{name}"):
        shutil.rmtree(f"package/{name}")
    # copy src directory to package directory but ignore tests and __pycache__ directories
    shutil.copytree(
        f"{source_code_path}/{name}",
        # nest the code in its own module directory
        f"package/{name}/{name}",
        ignore=shutil.ignore_patterns("tests", "__pycache__"),
    )
    # if the handler.py file exists in the package/{name}/{name} directory
    if os.path.exists(f"package/{name}/{name}/handler.py"):
        # move the handler.py file from the package/{name}/{name} directory to package/{name} directory
        shutil.move(f"package/{name}/{name}/handler.py", f"package/{name}/handler.py")


def build():
    # resumes lambda
    create_package_dir("resumes")
    # projects lambda
    create_package_dir("projects")
    # common layer
    create_package_dir("common")
    install_dependencies("package/common")


if __name__ == "__main__":
    build()
