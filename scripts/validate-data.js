const fs = require('node:fs');
const path = require('node:path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

let hasError = false;

function validateJsonFile(filePath) {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    JSON.parse(raw);
    console.log(`[OK] ${relativePath}`);
  } catch (error) {
    hasError = true;
    console.error(`[ERROR] ${relativePath}`);
    console.error(error.message);
  }
}

function walkDirectory(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walkDirectory(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      validateJsonFile(fullPath);
    }
  }
}

if (!fs.existsSync(dataDir)) {
  console.error(`Data directory not found: ${dataDir}`);
  process.exit(1);
}

walkDirectory(dataDir);

if (hasError) {
  process.exit(1);
}

console.log('All data files are valid JSON.');
