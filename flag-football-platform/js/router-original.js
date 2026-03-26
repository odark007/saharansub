// Router
import { renderLogin } from './views/login.js';
import { renderSignup } from './views/signup.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderHome } from './views/home.js';
import { renderCard1 } from './views/card1.js';
import { renderCard2 } from './views/card2.js';
import { renderRuleDetail } from './views/ruleDetail.js';
import { renderSectionDetail } from './views/sectionDetail.js';
import { renderCategoryDetail } from './views/categoryDetail.js'
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

    // Handle dynamic routes (like /rule/:id)
    if (path.startsWith('/rule/')) {
      const ruleId = path.split('/rule/')[1];
      renderRuleDetail(ruleId);
      this.showVoiceButton();
      return;
    }

    if (path.startsWith('/section/')) {
      const sectionId = path.split('/section/')[1];
      renderSectionDetail(sectionId);
      this.showVoiceButton();
      return;
    }

    if (path.startsWith('/category/')) {
      const parts = path.split('/category/')[1].split('/');
      const categoryId = parts[0];
      const ruleIndex = parts[1] ? parseInt(parts[1]) : 0;
      renderCategoryDetail(categoryId, ruleIndex);
      this.showVoiceButton();
      return;
    }

    // Render content
    const container = document.getElementById('view-container');

    switch (path) {
      case '/':
        renderHome();
        this.showVoiceButton();
        break;
      case '/login':
        renderLogin();
        this.hideVoiceButton();
        break;
      case '/card1':
        renderCard1();
        this.showVoiceButton();
        break;
      case '/card2':
        renderCard2();
        this.showVoiceButton();
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