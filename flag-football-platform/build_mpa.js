const fs = require('fs');
const path = require('path');

const routes = [
  'login',
  'signup',
  'onboarding',
  'card1',
  'card2',
  'profile',
  'favorites',
  'settings',
  'nfl-guide',
  'progress',
  'chat-history',
  'rule',
  'section',
  'category'
];

const indexPath = path.join(__dirname, 'index.html');
const indexHtmlContent = fs.readFileSync(indexPath, 'utf-8');

routes.forEach(route => {
  const dirPath = path.join(__dirname, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  const routeIndexPath = path.join(dirPath, 'index.html');
  // Copy index.html content to the route's index.html
  // Since we already used absolute paths for scripts/styles in index.html,
  // we just write it directly.
  fs.writeFileSync(routeIndexPath, indexHtmlContent);
  console.log(`Created ${route}/index.html`);
});

// Also create netlify _redirects to handle dynamic routes correctly
const redirectsContent = `
/rule/*    /rule/index.html    200
/section/* /section/index.html 200
/category/* /category/index.html 200
/*          /index.html         200
`;
fs.writeFileSync(path.join(__dirname, '_redirects'), redirectsContent.trim());
console.log('Created _redirects for Netlify');

// And create vercel.json in case they use Vercel
const vercelContent = {
  "rewrites": [
    { "source": "/rule/:id", "destination": "/rule/index.html" },
    { "source": "/section/:id", "destination": "/section/index.html" },
    { "source": "/category/:id", "destination": "/category/index.html" },
    { "source": "/category/:id/:index", "destination": "/category/index.html" }
  ]
};
fs.writeFileSync(path.join(__dirname, 'vercel.json'), JSON.stringify(vercelContent, null, 2));
console.log('Created vercel.json for fallback routes');
