const fs = require('fs');
const path = require('path');

// 1. Load variables from .env if it exists (for local dev)
if (fs.existsSync('.env')) {
    try {
        require('dotenv').config();
        console.log('Local .env detected and loaded.');
    } catch (e) {
        console.log('dotenv not installed, relying on system env.');
    }
}

// 2. Define files to process
const filesToProcess = [
    path.join(__dirname, 'the-human-thinking-machine/applied-computer-science/main.js'),
    path.join(__dirname, 'the-human-thinking-machine/the-human-thinking-machine.js'),
    path.join(__dirname, 'the-human-thinking-machine/ready-2-play/ready-2-play.js')
];

filesToProcess.forEach(jsPath => {
    try {
        if (!fs.existsSync(jsPath)) {
            console.warn(`File not found: ${jsPath}`);
            return;
        }

        let content = fs.readFileSync(jsPath, 'utf8');

        // 3. Swap placeholders
        content = content.replace(/%%SUPABASE_URL%%/g, process.env.SUPABASE_URL || '');
        content = content.replace(/%%SUPABASE_ANON_KEY%%/g, process.env.SUPABASE_ANON_KEY || '');
        content = content.replace(/%%EMAILJS_SERVICE_ID%%/g, process.env.EMAILJS_SERVICE_ID || '');
        content = content.replace(/%%EMAILJS_PUBLIC_KEY%%/g, process.env.EMAILJS_PUBLIC_KEY || '');
        content = content.replace(/%%EMAILJS_TEMPLATE_HUMAN_THINKING_ID%%/g, process.env.EMAILJS_TEMPLATE_HUMAN_THINKING_ID || '');

        fs.writeFileSync(jsPath, content);
        console.log(`Successfully injected keys into ${path.basename(jsPath)}`);
    } catch (err) {
        console.error(`Build Error for ${jsPath}:`, err.message);
        process.exit(1); // <--- CRITICAL: Tells Netlify to stop if something goes wrong
    }
});