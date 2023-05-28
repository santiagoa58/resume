# import libraries to make a script to build the server
import os
import shutil
import subprocess
import sys


# function that creates a package directory for the server
def create_package_dir():
    # remove the package directory if it exists
    if os.path.exists("package"):
        shutil.rmtree("package")
    # copy src directory to package directory but ignore tests and __pycache__ directories
    shutil.copytree(
        "src", "package", ignore=shutil.ignore_patterns("tests", "__pycache__")
    )
    # install dependencies from requirements.txt to package directory
    subprocess.run(
        [
            sys.executable,
            "-m",
            "pip",
            "install",
            "-r",
            "requirements.txt",
            "-t",
            "package",
        ],
        check=True,
    )


if __name__ == "__main__":
    create_package_dir()
