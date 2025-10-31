// Router - Minimal
export class Router {
  constructor() {
    this.currentRoute = '/';
  }

  async init() {
    // Handle navigation clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route');
        this.navigate(route);
      }
    });

    // Load home page
    this.navigate('/');
  }

  navigate(path) {
    this.currentRoute = path;

    // Dispatch event for active nav highlighting
    window.dispatchEvent(new CustomEvent('routechange', {
      detail: { route: path }
    }));

    // Render content
    const container = document.getElementById('view-container');

    switch (path) {
      case '/':
        container.innerHTML = '<h1>Home Page</h1><p>Welcome to Flag Football</p>';
        break;
      case '/nfl-guide':
        // Dynamically import and render the NFL Guide view
        import('./views/nfl-guide/nflGuide.js').then(module => {
          module.renderNFLGuide(container);
        }).catch(error => {
          console.error('Failed to load NFL Guide view:', error);
          container.innerHTML = '<h1>Error loading guide</h1><p>Please try again later.</p>';
        });
        break;
      case '/profile':
        container.innerHTML = '<h1>Profile</h1><p>Your profile</p>';
        break;
      case '/favorites':
        container.innerHTML = '<h1>Favorites</h1><p>Your bookmarks</p>';
        break;
      case '/settings':
        container.innerHTML = '<h1>Settings</h1><p>App settings</p>';
        break;
      case '/progress':
        container.innerHTML = '<h1>Progress</h1><p>Your learning progress</p>';
        break;
      case '/chat-history':
        container.innerHTML = '<h1>Chat History</h1><p>Your conversations</p>';
        break;
      default:
        container.innerHTML = '<h1>Page Not Found</h1>';
    }
  }
}