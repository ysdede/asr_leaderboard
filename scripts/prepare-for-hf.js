import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');
const TEMPLATE_DIR = path.join(PROJECT_ROOT, 'space_template');
const DIST_DIR = path.join(PROJECT_ROOT, 'dist');

// Create README.md for Hugging Face Space
const createReadme = () => {
  const readmeSpacePath = path.join(PROJECT_ROOT, 'READMESPACE.md');
  
  if (fs.existsSync(readmeSpacePath)) {
    fs.copyFileSync(readmeSpacePath, path.join(TEMPLATE_DIR, 'README.md'));
    console.log('✅ Copied READMESPACE.md to README.md for Hugging Face Space');
  } else {
    console.warn('⚠️ READMESPACE.md not found, skipping README.md creation');
  }
};

// Create a .gitattributes file to handle line endings correctly
const createGitAttributes = () => {
  const gitattributesContent = `* text=auto eol=lf
*.{png,jpg,jpeg,gif,webp,woff,woff2} binary
`;
  fs.writeFileSync(path.join(TEMPLATE_DIR, '.gitattributes'), gitattributesContent);
  console.log('✅ Created .gitattributes for Hugging Face Space');
};

// Get git information
function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const commitId = execSync('git rev-parse --short HEAD').toString().trim();
    return { branch, commitId };
  } catch (error) {
    console.error('Error getting git info:', error.message);
    return { branch: 'unknown', commitId: 'unknown' };
  }
}

// Main function
const main = () => {
  console.log('🚀 Preparing build for Hugging Face Spaces...');
  
  // Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Ensure template directory exists
  if (!fs.existsSync(TEMPLATE_DIR)) {
    fs.mkdirSync(TEMPLATE_DIR, { recursive: true });
  }
  
  // Create necessary files in the template directory
  createReadme();
  createGitAttributes();
  
  // Save git information to a JSON file
  const gitInfo = getGitInfo();
  fs.writeFileSync(
    path.join(DIST_DIR, 'git-info.json'),
    JSON.stringify(gitInfo, null, 2)
  );
  
  console.log('✨ Template is ready for Hugging Face Spaces!');
  console.log('📋 Instructions:');
  console.log('1. Create a new Static HTML Space on Hugging Face');
  console.log('2. Upload the contents of the dist/ directory to your Space');
  console.log('3. Your app should be live at https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME');
  console.log(`Git Info: Branch: ${gitInfo.branch}, Commit: ${gitInfo.commitId}`);
};

// Run the script
main();
