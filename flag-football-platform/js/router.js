// Router
import { renderLogin } from './views/login.js';
import { renderSignup } from './views/signup.js';
import { renderOnboarding } from './views/onboarding.js';
import { renderHome } from './views/home.js';
import { renderCard1 } from './views/card1.js';
import { renderCard2 } from './views/card2.js';
import { renderRuleDetail } from './views/ruleDetail.js';
import { renderSectionDetail } from './views/sectionDetail.js';
import { renderCategoryDetail } from './views/categoryDetail.js';
import { renderNflGuide }       from './views/nflGuide.js';
import { renderChatHistory }    from './views/chatHistory.js';
export class Router {
  constructor() {
    this.currentRoute = '/';
  }

  async init() {
    // Load current page based on URL
    let path = window.location.pathname;
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    this.navigate(path);
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
        renderNflGuide();
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
        renderChatHistory();
        this.hideVoiceButton();
        break;
      default:
        // Default might be an unknown route, or it could be /index.html mapping to /
        if (path.endsWith('index.html')) {
           this.navigate(path.replace(/index\.html$/, ''));
           return;
        }
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