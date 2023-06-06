const fs = require('fs');
const path = require('path');

/**
 * This script will create a pre-push hook script in the .git/hooks directory
 * that will run the lint and type-check scripts before pushing to the remote repository.
 * to execute this script, run the following command from the root directory of the project:
 * node client/pre-push-hook-setup.js
 *
 * To verify that the script was created successfully, run the following command:
 * cat .git/hooks/pre-push
 */

const prePushHook = `# !/bin/sh

remote="$1"
url="$2"

# Get the list of changed files
changed_files=$(git diff --name-only @{push}..)

run_checks=0

# Check if any of the changed files are in the client directory
for file in $changed_files; do
  if [[ $file == client/* ]]; then
    run_checks=1
    break
  fi
done

# If there are no changes in the client directory, exit the script
if [ $run_checks -eq 0 ]; then
  exit 0
fi

# Save the current working directory
pushd . > /dev/null

# Change to the client directory
cd "client"

# Run your commands:
npm run lint
lint_exit_code=$?

npm run type-check
type_check_exit_code=$?

# Restore the original working directory
popd > /dev/null

# If any of the commands failed, abort the push
if [ $lint_exit_code -ne 0 ] || [ $type_check_exit_code -ne 0 ]; then
  exit 1
fi

exit 0

`;

// Write the pre-push hook script to the .git/hooks directory
fs.writeFileSync(path.join('.git', 'hooks', 'pre-push'), prePushHook);

// Change the permissions of the script to make it executable
fs.chmodSync(path.join('.git', 'hooks', 'pre-push'), '755');
