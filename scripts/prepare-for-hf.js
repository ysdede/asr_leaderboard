const fs = require('fs');
const path = require('path');

// Create README.md for Hugging Face Space
const createReadme = () => {
  const readmeContent = `# Turkish ASR Leaderboard

This is a benchmark leaderboard for Turkish Automatic Speech Recognition (ASR) models. It displays performance metrics for various ASR models tested on Turkish speech datasets.

## Metrics

- **WER**: Word Error Rate (lower is better)
- **CER**: Character Error Rate (lower is better)
- **Similarity**: Cosine similarity between reference and prediction texts (higher is better)
- **Speed**: Real-time factor (higher is better)

## Source Code

The source code for this project is available on GitHub: [https://github.com/ysdede/turkish_asr_leaderboard](https://github.com/ysdede/turkish_asr_leaderboard)
`;

  fs.writeFileSync(path.join(__dirname, '../dist/README.md'), readmeContent);
  console.log('✅ Created README.md for Hugging Face Space');
};

// Create a simple requirements.txt file (needed for some HF Spaces)
const createRequirements = () => {
  const requirementsContent = `# No Python requirements - this is a static HTML app
`;
  fs.writeFileSync(path.join(__dirname, '../dist/requirements.txt'), requirementsContent);
  console.log('✅ Created requirements.txt for Hugging Face Space');
};

// Create a .gitattributes file to handle line endings correctly
const createGitAttributes = () => {
  const gitattributesContent = `* text=auto eol=lf
*.{png,jpg,jpeg,gif,webp,woff,woff2} binary
`;
  fs.writeFileSync(path.join(__dirname, '../dist/.gitattributes'), gitattributesContent);
  console.log('✅ Created .gitattributes for Hugging Face Space');
};

// Main function
const main = () => {
  console.log('🚀 Preparing build for Hugging Face Spaces...');
  
  // Check if dist directory exists
  if (!fs.existsSync(path.join(__dirname, '../dist'))) {
    console.error('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Create necessary files
  createReadme();
  createRequirements();
  createGitAttributes();
  
  console.log('✨ Build is ready for Hugging Face Spaces!');
  console.log('📋 Instructions:');
  console.log('1. Create a new Static HTML Space on Hugging Face');
  console.log('2. Upload the contents of the dist/ directory to your Space');
  console.log('3. Your app should be live at https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME');
};

// Run the script
main();
