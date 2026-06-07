const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const rootDir = path.join(__dirname, '..');
const foldersToCheck = ['src', 'scripts'];

let hasError = false;

function checkFile(filePath) {
  const relativePath = path.relative(rootDir, filePath);

  const result = spawnSync(process.execPath, ['--check', filePath], {
    encoding: 'utf8',
  });

  if (result.status === 0) {
    console.log(`[OK] ${relativePath}`);
    return;
  }

  hasError = true;
  console.error(`[ERROR] ${relativePath}`);

  if (result.stderr) {
    console.error(result.stderr.trim());
  }

  if (result.stdout) {
    console.error(result.stdout.trim());
  }
}

function walkDirectory(directory) {
  if (!fs.existsSync(directory)) {
    return;
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      checkFile(fullPath);
    }
  }
}

for (const folder of foldersToCheck) {
  walkDirectory(path.join(rootDir, folder));
}

if (hasError) {
  process.exit(1);
}

console.log('All JavaScript files passed syntax checks.');
