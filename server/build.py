# import libraries to make a script to build the server
import os
import shutil
import subprocess
import sys


def add_import_layer_to_lambda_handler(path_to_handler_file: str):
    """Adds the import statement for the layer to the lambda handler file.

    Args:
        path_to_handler_file (str): The path to the lambda handler file. ex: 'server\handler.py'
    """

    # Read the original file
    with open(path_to_handler_file, "r") as file:
        lines = file.readlines()

    # Check if 'import sys' is in the file
    import_sys_exists = any("import sys" in line for line in lines)

    # If 'import sys' is not in the file, add it at the start
    if not import_sys_exists:
        lines.insert(0, "import sys\n")

    # Check if 'sys.path.append('/opt')' is in the file
    append_opt_exists = any("sys.path.append('/opt')" in line for line in lines)

    # If 'sys.path.append('/opt')' is not in the file, add it after 'import sys'
    if not append_opt_exists:
        if import_sys_exists:
            # Find the index of 'import sys' and insert 'sys.path.append('/opt')' after it
            import_sys_index = next(
                i for i, line in enumerate(lines) if "import sys" in line
            )
            lines.insert(import_sys_index + 1, "sys.path.append('/opt')\n")
        else:
            # If 'import sys' was not originally in the file, 'sys.path.append('/opt')' is inserted at index 1
            lines.insert(1, "sys.path.append('/opt')\n")

    # Write the modified lines back to the file
    with open(path_to_handler_file, "w") as file:
        file.writelines(lines)


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
        # to allow layers to work in the lambda, append the sys.path statement to the layer code in aws
        add_import_layer_to_lambda_handler(f"package/{name}/handler.py")


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
