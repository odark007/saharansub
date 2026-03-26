// Flag Football Platform - Main Application Entry Point
import { Router } from './router.js';
import { State } from './state.js';
import { Auth } from './auth.js';
import { DB } from './db.js';
import { showToast, showLoading, hideLoading } from './utils.js';

class App {
  constructor() {
    this.router = null;
    this.state = null;
    this.auth = null;
    this.db = null;
    this.isOnline = navigator.onLine;
  }

  async init() {
    try {
      // Show loading
      showLoading('Initializing app...');

      // Initialize core services
      this.state = new State();
      this.auth = new Auth();
      this.db = new DB();
      await this.db.init();

      // Register service worker
      await this.registerServiceWorker();

      // Setup event listeners
      this.setupEventListeners();

      // Initialize router
      this.router = new Router();
      await this.router.init();

      // Handle email confirmation callback
      await this.handleAuthCallback();

      // Check authentication status
      const user = await this.auth.getCurrentUser();
      if (user) {
        await this.handleAuthenticatedUser(user);
      } else {
        await this.handleAnonymousUser();
      }

      // Hide loading
      hideLoading();

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      hideLoading();
      showToast('Failed to initialize app', 'error');
    }
  }

  async handleAuthCallback() {
    // Check if URL contains auth tokens (from email confirmation)
    const hash = window.location.hash;

    if (hash && hash.includes('access_token')) {
      showLoading('Verifying email...');

      // Supabase will automatically handle the token
      // Wait a moment for it to process
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear the hash from URL
      window.history.replaceState(null, '', window.location.pathname);

      hideLoading();
      showToast('Email verified! You can now log in.', 'success');

      // Redirect to login
      this.router.navigate('/login');
    }
  }

  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js');
        console.log('Service Worker registered:', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast('New version available! Refresh to update.', 'info');
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  setupEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarClose = document.getElementById('sidebar-close');

    menuToggle?.addEventListener('click', () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.add('active');
    });

    sidebarClose?.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });

    sidebarOverlay?.addEventListener('click', () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn?.addEventListener('click', async (e) => {
      e.preventDefault();
      await this.handleLogout();
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.hideOfflineIndicator();
      showToast('Connection restored', 'success');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showOfflineIndicator();
      showToast('You are offline', 'warning');
    });

    // Check initial online status
    if (!this.isOnline) {
      this.showOfflineIndicator();
    }

    // Voice chat button (will be shown/hidden by router)
    const voiceChatBtn = document.getElementById('voice-chat-btn');
    voiceChatBtn?.addEventListener('click', () => {
      if (!this.isOnline) {
        showToast('Voice chat requires internet connection', 'warning');
        return;
      }
      this.router.navigate('/chat');
    });

    // Navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-route]');
      if (link) {
        e.preventDefault();
        const route = link.getAttribute('data-route') || link.getAttribute('href');
        this.router.navigate(route);

        // Close sidebar if open
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
      }
    });

    // Update active nav items
    window.addEventListener('routechange', (e) => {
      this.updateActiveNavItems(e.detail.route);
    });
  }

  async handleAuthenticatedUser(user) {
    console.log('Authenticated user:', user.id);

    // Load user data
    const userData = await this.auth.getUserData(user.id);
    this.state.setState('user', userData);
    this.state.setState('isAuthenticated', true);

    // Update UI for logged-in state
    this.updateAuthUI(true);

    // Sync data if online
    if (this.isOnline) {
      await this.syncOfflineData();
    }
  }

  async handleAnonymousUser() {
    console.log('Anonymous user detected');

    // Check if there's a session ID in local storage
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      localStorage.setItem('sessionId', sessionId);
    }

    this.state.setState('sessionId', sessionId);
    this.state.setState('isAuthenticated', false);

    // Update UI for logged-out state
    this.updateAuthUI(false);

    // Check if onboarding is complete
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      this.router.navigate('/onboarding');
    }
  }

  async handleLogout() {
    try {
      showLoading('Logging out...');

      await this.auth.signOut();

      // Clear state
      this.state.clearState();

      // Clear local storage (except session ID for anonymous users)
      const sessionId = this.generateSessionId();
      localStorage.clear();
      localStorage.setItem('sessionId', sessionId);

      // Update UI
      this.updateAuthUI(false);

      hideLoading();
      showToast('Logged out successfully', 'success');

      // Navigate to home
      this.router.navigate('/');

    } catch (error) {
      console.error('Logout error:', error);
      hideLoading();
      showToast('Failed to logout', 'error');
    }
  }


  updateAuthUI(isAuthenticated) {
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const logoutBtn = document.getElementById('logout-btn');

    if (isAuthenticated) {
      // Hide login/signup, show logout
      if (loginLink) loginLink.style.display = 'none';
      if (signupLink) signupLink.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
      // Show login/signup, hide logout
      if (loginLink) loginLink.style.display = 'flex';
      if (signupLink) signupLink.style.display = 'flex';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  }

  async syncOfflineData() {
    try {
      const offlineQueue = await this.db.getOfflineQueue();
      if (offlineQueue.length === 0) return;

      console.log(`Syncing ${offlineQueue.length} offline actions...`);
      showLoading('Syncing data...');

      for (const action of offlineQueue) {
        try {
          await this.processOfflineAction(action);
          await this.db.removeFromOfflineQueue(action.id);
        } catch (error) {
          console.error('Failed to sync action:', action, error);
        }
      }

      hideLoading();
      showToast('Data synced successfully', 'success');
    } catch (error) {
      console.error('Sync failed:', error);
      hideLoading();
    }
  }

  async processOfflineAction(action) {
    // Process different types of offline actions
    switch (action.type) {
      case 'bookmark':
        await this.auth.syncBookmark(action.data);
        break;
      case 'progress':
        await this.auth.syncProgress(action.data);
        break;
      case 'quiz_attempt':
        await this.auth.syncQuizAttempt(action.data);
        break;
      default:
        console.warn('Unknown action type:', action.type);
    }
  }

  showOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    indicator?.classList.remove('hidden');
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    indicator?.classList.add('hidden');
  }

  updateActiveNavItems(route) {
    // Update sidebar links
    document.querySelectorAll('.sidebar-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route') || link.getAttribute('href');
      if (linkRoute === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update bottom nav items
    document.querySelectorAll('.bottom-nav-item').forEach(link => {
      const linkRoute = link.getAttribute('data-route') || link.getAttribute('href');
      if (linkRoute === route || (route.startsWith(linkRoute) && linkRoute !== '/')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    window.app.init();
  });
} else {
  window.app = new App();
  window.app.init();
}

export { App };