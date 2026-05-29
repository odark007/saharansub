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

// 2. Define path to main.js
const jsPath = path.join(__dirname, 'the-human-thinking-machine/applied-computer-science/main.js');

try {
    let content = fs.readFileSync(jsPath, 'utf8');

    // 3. Swap placeholders
    content = content.replace('%%SUPABASE_URL%%', process.env.SUPABASE_URL || '');
    content = content.replace('%%SUPABASE_ANON_KEY%%', process.env.SUPABASE_ANON_KEY || '');
    content = content.replace('%%EMAILJS_SERVICE_ID%%', process.env.EMAILJS_SERVICE_ID || '');
    content = content.replace('%%EMAILJS_PUBLIC_KEY%%', process.env.EMAILJS_PUBLIC_KEY || '');
    content = content.replace('%%EMAILJS_TEMPLATE_ID%%', process.env.EMAILJS_TEMPLATE_ID || '');

    fs.writeFileSync(jsPath, content);
    console.log('Successfully injected keys into main.js');
} catch (err) {
    console.error('Build Error:', err.message);
    process.exit(1); // <--- CRITICAL: Tells Netlify to stop if something goes wrong
}