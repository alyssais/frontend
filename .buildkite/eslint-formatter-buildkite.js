const spawnSync = require('child_process').spawnSync;

module.exports = function(results) {
  console.log("--- DEBUG: env inside node")
  console.debug(process.env);

  const { warning, error } = results.reduce(
      function(acc, file) {
        if (file.errorCount > 0) {
          acc.error.push(file);
        }

        if (file.warningCount > 0) {
          acc.warning.push(file);
        }

        return acc;
      },
      {
        warning: [],
        error: []
      }
    );

  if (error.length > 0) {
    let errorOutput = `
#### ESLint Errors

${
  error.map(function(file) {
    return `
<details><summary>${file.filePath}</summary>

${
  file.messages.map(function(message) {
    if (message.severity > 1) {
      return '';
    }

    return `${message.line}:${message.column}: ${message.message} (${message.ruleId})`;
  }).join('\n\n')
}

</details>`;

      // return JSON.stringify(file, null, 2);
  }).join('\n\n')
}`;

    if (process.env["BUILDKITE"]) {
      const result = spawnSync(
        'buildkite-agent', [ 'annotate', '--context', 'eslint', '--style', 'error', ],
        { encoding: 'utf8', input: errorOutput }
      );

      console.log(result);
    } else {
      console.log(errorOutput);
    }
  }

  if (warning.length > 0) {
    let warningOutput = `
#### ESLint Warnings

${
  warning.map(function(file) {
    return `
<details><summary>${file.filePath}</summary>

${
  file.messages.map(function(message) {
    if (message.severity > 1) {
      return '';
    }

    return `${message.line}:${message.column}: ${message.message} (${message.ruleId})`;
  }).join('\n\n')
}

</details>`;

      // return JSON.stringify(file, null, 2);
  }).join('\n\n')
}`;

    if (process.env["BUILDKITE"]) {
      const result = spawnSync(
        'buildkite-agent', [ 'annotate', '--context', 'eslint', '--style', 'warning' ],
        { encoding: 'utf8', input: warningOutput }
      );

      console.log(result);
    } else {
      console.log(warningOutput);
    }
  }

  return '';
};
