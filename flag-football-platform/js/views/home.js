// Home View - Display Rulebooks
import { fetchRulebooks, fetchStats } from '../api.js';
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderHome() {
  const container = document.getElementById('view-container');
  
  // Show loading while fetching data
  showLoading('Loading rulebooks...');
  
  try {
    // Fetch rulebooks and stats
    const [rulebooks, stats] = await Promise.all([
      fetchRulebooks(),
      fetchStats()
    ]);
    
    hideLoading();
    
    // Get user's default rulebook preference
    const user = window.app.state.getState('user');
    const defaultRulebook = user?.default_rulebook || localStorage.getItem('defaultRulebook') || 'nfl_flag';
    
    container.innerHTML = `
      <div>
        <h1 class="text-primary" style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">
          Welcome to Flag Football
        </h1>
        <p style="margin-bottom: 24px; color: #666;">
          Learn the rules and improve your game
        </p>
        
        ${stats ? `
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #013369 0%, #0B2265 100%);">
          <div class="card-body" style="padding: 16px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; color: white; text-align: center;">
              <div>
                <div style="font-size: 32px; font-weight: 700;">${stats.rulebooks}</div>
                <div style="font-size: 12px; opacity: 0.9;">Rulebooks</div>
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700;">${stats.rules}</div>
                <div style="font-size: 12px; opacity: 0.9;">Rules</div>
              </div>
              <div>
                <div style="font-size: 32px; font-weight: 700;">${stats.users}</div>
                <div style="font-size: 12px; opacity: 0.9;">Users</div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}
        
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #013369;">
          Get Started
        </h2>
        
        <div class="home-cards">
          <a href="/card1" data-route="/card1" class="home-card">
            <div class="home-card-icon">
              <i class="fas fa-search"></i>
            </div>
            <div class="home-card-content">
              <h2 class="home-card-title">Game Play Quick Reference</h2>
              <p class="home-card-description">Quick access to rules during gameplay</p>
              <span class="home-card-badge">${rulebooks.length} Rulebooks Available</span>
            </div>
          </a>
          
          <a href="/card2" data-route="/card2" class="home-card">
            <div class="home-card-icon">
              <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="home-card-content">
              <h2 class="home-card-title">Learn How to Play</h2>
              <p class="home-card-description">Step-by-step introduction to flag football</p>
              <span class="home-card-badge">Structured Learning Path</span>
            </div>
          </a>
        </div>
        
        ${rulebooks.length > 0 ? `
        <div style="margin-top: 32px;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #013369;">
            Available Rulebooks
          </h2>
          <div style="display: grid; gap: 16px;">
            ${rulebooks.map(rulebook => `
              <div class="card" style="cursor: pointer;" onclick="window.app.router.navigate('/rulebook/${rulebook.id}')">
                <div class="card-body">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                      <h3 style="font-size: 18px; font-weight: 700; color: #013369; margin-bottom: 4px;">
                        ${rulebook.name}
                      </h3>
                      <p style="color: #666; font-size: 14px;">Version ${rulebook.version}</p>
                    </div>
                    <span class="tag tag-${rulebook.status === 'active' ? 'success' : 'secondary'}">
                      ${rulebook.status}
                    </span>
                  </div>
                  <div style="margin-top: 12px; font-size: 14px; color: #666;">
                    <i class="fas fa-calendar"></i>
                    Added ${new Date(rulebook.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : `
        <div class="empty-state" style="margin-top: 32px;">
          <div class="empty-state-icon">
            <i class="fas fa-book"></i>
          </div>
          <div class="empty-state-title">No Rulebooks Yet</div>
          <div class="empty-state-description">
            Rulebooks will appear here once uploaded by administrators.
          </div>
        </div>
        `}
      </div>
    `;
    
  } catch (error) {
    hideLoading();
    console.error('Failed to load home data:', error);
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Failed to Load Data</div>
        <div class="empty-state-description">
          ${error.message || 'Please check your internet connection and try again.'}
        </div>
        <button class="btn btn-primary" onclick="window.location.reload()">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}