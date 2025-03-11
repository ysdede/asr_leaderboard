import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const HF_SPACE_REPO = 'git@hf.co:spaces/ysdede/turkish_asr_leaderboard';
const DIST_DIR = path.join(__dirname, '../dist');
const TEMP_DIR = path.join(__dirname, '../temp_hf_deploy');
const TEMPLATE_DIR = path.join(__dirname, '../space_template');
const PROJECT_ROOT = path.join(__dirname, '..');

// Run a command and print its output
const runCommand = (command, cwd = process.cwd(), ignoreError = false) => {
  console.log(`🔄 Running: ${command}`);
  try {
    const output = execSync(command, { cwd, stdio: 'pipe' }).toString();
    console.log(output);
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Error executing command: ${command}`);
    console.error(error.message);
    if (!ignoreError) {
      throw error;
    }
    return { success: false, error };
  }
};

// Check if dist directory exists
const checkDistDirectory = () => {
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  console.log('✅ dist directory exists');
};

// Create a temporary directory for HF Space repo
const setupTempDirectory = () => {
  console.log('🚀 Setting up temporary directory for Hugging Face Space repository...');
  
  // Remove the temporary directory if it exists
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
  // Create the temporary directory
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  
  console.log('✅ Temporary directory created');
};

// Clone the HF Space repository to the temporary directory
const cloneHfSpaceRepo = () => {
  console.log(`🚀 Cloning Hugging Face Space repository...`);
  
  const cloneResult = runCommand(`git clone ${HF_SPACE_REPO} .`, TEMP_DIR, true);
  
  if (!cloneResult.success) {
    // If clone fails, create a new git repository
    console.log('⚠️ Clone failed, initializing a new git repository');
    runCommand('git init', TEMP_DIR);
    runCommand(`git remote add origin ${HF_SPACE_REPO}`, TEMP_DIR);
    console.log('✅ New repository initialized');
  } else {
    console.log('✅ Repository cloned successfully');
  }
};

// Clean all files in the temp directory except .git
const cleanTempDirectory = () => {
  console.log('🧹 Cleaning files in the repository (keeping .git)...');
  
  fs.readdirSync(TEMP_DIR).forEach(file => {
    if (file !== '.git') {
      const filePath = path.join(TEMP_DIR, file);
      try {
        if (fs.lstatSync(filePath).isDirectory()) {
          fs.rmSync(filePath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`⚠️ Could not remove ${file}: ${error.message}`);
      }
    }
  });
  
  console.log('✅ Repository cleaned');
};

// Copy build files and template files to the temporary directory
const copyFilesToTemp = () => {
  console.log('🚀 Copying build and template files to the repository...');
  
  // Copy all files from dist to the temp directory
  fs.readdirSync(DIST_DIR).forEach(file => {
    const srcPath = path.join(DIST_DIR, file);
    const destPath = path.join(TEMP_DIR, file);
    
    try {
      if (fs.lstatSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (error) {
      console.error(`⚠️ Could not copy ${file}: ${error.message}`);
    }
  });

  // Copy all files from template to the temp directory
  fs.readdirSync(TEMPLATE_DIR).forEach(file => {
    const srcPath = path.join(TEMPLATE_DIR, file);
    const destPath = path.join(TEMP_DIR, file);
    
    try {
      if (fs.lstatSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (error) {
      console.error(`⚠️ Could not copy ${file}: ${error.message}`);
    }
  });
  
  console.log('✅ Build and template files copied');
};

// Commit and push changes to HF Space
const commitAndPush = () => {
  console.log('🚀 Committing and pushing changes to Hugging Face Space...');
  
  const timestamp = new Date().toISOString();
  
  // Add and commit changes
  runCommand('git add .', TEMP_DIR);
  runCommand(`git commit -m "Update leaderboard: ${timestamp}"`, TEMP_DIR);
  
  // Force push to main branch (this will overwrite any remote changes)
  console.log('Force pushing to Hugging Face Space repository...');
  const pushResult = runCommand('git push -u origin main --force', TEMP_DIR, true);
  
  if (pushResult.success) {
    console.log('✅ Successfully force pushed to main branch');
  } else {
    // Try pushing to master branch if main fails
    console.log('⚠️ Push to main branch failed, trying master branch...');
    const pushMasterResult = runCommand('git push -u origin master --force', TEMP_DIR, true);
    
    if (pushMasterResult.success) {
      console.log('✅ Successfully force pushed to master branch');
    } else {
      console.error('❌ Failed to push to both main and master branches');
      throw new Error('Failed to push changes to Hugging Face Space repository');
    }
  }
};

// Clean up temporary directory
const cleanUp = () => {
  console.log('🧹 Cleaning up temporary directory...');
  
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
  
  console.log('✅ Cleanup complete');
};

// Main function
const main = async () => {
  console.log('🚀 Starting deployment to Hugging Face Space...');
  
  // Build the project first
  try {
    runCommand('npm run build');
  } catch (error) {
    console.error('❌ Build failed');
    process.exit(1);
  }
  
  checkDistDirectory();
  setupTempDirectory();
  cloneHfSpaceRepo();
  cleanTempDirectory(); // Clean all files except .git before copying new files
  copyFilesToTemp(); // Copy both dist and template files
  commitAndPush();
  cleanUp();
  
  console.log('✨ Deployment complete!');
  console.log('📋 Your app should be live at https://huggingface.co/spaces/ysdede/turkish_asr_leaderboard');
};

// Run the script
main().catch(error => {
  console.error('❌ Deployment failed');
  console.error(error);
  process.exit(1);
});
