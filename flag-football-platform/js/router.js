// Router
import { renderLogin } from './views/login.js';
import { renderSignup } from './views/signup.js';
import { renderOnboarding } from './views/onboarding.js';

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
    
    switch(path) {
      case '/':
        this.renderHome();
        break;
      case '/login':
        renderLogin();
        this.hideVoiceButton();
        break;
      case '/signup':
        renderSignup();
        this.hideVoiceButton();
        break;
      case '/onboarding':
        renderOnboarding();
        this.hideVoiceButton();
        break;
      case '/nfl-guide':
        container.innerHTML = '<h1>NFL Flag Referee Guide</h1><p>Coming soon</p>';
        this.hideVoiceButton();
        break;
      case '/profile':
        container.innerHTML = '<h1>Profile</h1><p>Your profile</p>';
        this.hideVoiceButton();
        break;
      case '/favorites':
        container.innerHTML = '<h1>Favorites</h1><p>Your bookmarks</p>';
        this.hideVoiceButton();
        break;
      case '/settings':
        container.innerHTML = '<h1>Settings</h1><p>App settings</p>';
        this.hideVoiceButton();
        break;
      case '/progress':
        container.innerHTML = '<h1>Progress</h1><p>Your learning progress</p>';
        this.hideVoiceButton();
        break;
      case '/chat-history':
        container.innerHTML = '<h1>Chat History</h1><p>Your conversations</p>';
        this.hideVoiceButton();
        break;
      default:
        container.innerHTML = '<h1>Page Not Found</h1>';
    }
  }

  renderHome() {
    const container = document.getElementById('view-container');
    container.innerHTML = `
      <div>
        <h1 class="text-primary" style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">Welcome to Flag Football</h1>
        <p style="margin-bottom: 24px; color: #333;">Learn the rules and improve your game</p>
        
        <div class="home-cards">
          <a href="#" class="home-card" onclick="alert('Card 1 - Coming in Part 3'); return false;">
            <div class="home-card-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="home-card-content">
              <h2 class="home-card-title">Game Play Quick Reference</h2>
              <p class="home-card-description">Quick access to rules during gameplay</p>
            </div>
          </a>
          
          <a href="#" class="home-card" onclick="alert('Card 2 - Coming in Part 3'); return false;">
            <div class="home-card-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="home-card-content">
              <h2 class="home-card-title">Learn How to Play</h2>
              <p class="home-card-description">Step-by-step introduction to flag football</p>
            </div>
          </a>
        </div>
      </div>
    `;
    this.showVoiceButton();
  }

  // Voice button helpers
  showVoiceButton() {
    const btn = document.getElementById('voice-chat-btn');
    if (btn) btn.classList.remove('hidden');
  }

  hideVoiceButton() {
    const btn = document.getElementById('voice-chat-btn');
    if (btn) btn.classList.add('hidden');
  }
}