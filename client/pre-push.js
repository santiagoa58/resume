/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
const { exec } = require('child_process');

// Update these commands to fit your project
const commands = ['pre-push'];

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}
(async () => {
  try {
    for (const command of commands) {
      console.log(`Running: ${command}`);
      await runCommand(command);
    }
  } catch (error) {
    console.error('Pre-push check failed. Fix errors before pushing.');
    process.exit(1);
  }
})();
