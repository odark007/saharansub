// Card1 View - Game Play Quick Reference
import { fetchRulebook } from '../api.js';
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderCard1() {
  const container = document.getElementById('view-container');
  
  showLoading('Loading rules...');
  
  try {
    // Get user's default rulebook or use NFL Flag
    const user = window.app.state.getState('user');
    const defaultRulebook = user?.default_rulebook || localStorage.getItem('defaultRulebook') || 'nfl_flag';
    
    // Fetch all rulebooks to let user choose
    const rulebooksResponse = await fetch('http://localhost:3000/api/admin/rulebooks');
    const rulebooksResult = await rulebooksResponse.json();
    const rulebooks = rulebooksResult.data || [];
    
    // Get the first active rulebook
    const activeRulebook = rulebooks.find(rb => rb.status === 'active');
    
    if (!activeRulebook) {
      hideLoading();
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <div class="empty-state-title">No Rulebooks Available</div>
          <div class="empty-state-description">
            Please contact an administrator to upload rulebooks.
          </div>
          <a href="/" data-route="/" class="btn btn-primary" style="margin-top: 16px;">
            <i class="fas fa-home"></i> Back to Home
          </a>
        </div>
      `;
      return;
    }
    
    // Fetch the full rulebook with sections, categories, and rules
    const rulebook = await fetchRulebook(activeRulebook.id);
    
    hideLoading();
    
    // Flatten all rules for quick reference
    const allRules = [];
    rulebook.sections.forEach(section => {
      section.categories.forEach(category => {
        category.rules.forEach(rule => {
          allRules.push({
            ...rule,
            sectionTitle: section.title,
            categoryTitle: category.title,
            difficulty: section.difficulty_level
          });
        });
      });
    });
    
    container.innerHTML = `
      <div>
        <div style="margin-bottom: 24px;">
          <a href="/" data-route="/" style="color: #013369; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <i class="fas fa-arrow-left"></i> Back to Home
          </a>
          <h1 class="text-primary" style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">
            Game Play Quick Reference
          </h1>
          <p style="color: #666;">
            ${rulebook.name} - Version ${rulebook.version}
          </p>
        </div>
        
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-body">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">
                <i class="fas fa-search"></i> Search Rules
              </label>
              <input 
                type="text" 
                id="rule-search" 
                class="form-input" 
                placeholder="Search by keyword, tag, or rule title..."
              />
            </div>
          </div>
        </div>
        
        <div id="rules-container">
          ${renderRulesList(allRules)}
        </div>
      </div>
    `;
    
    // Add search functionality
    const searchInput = document.getElementById('rule-search');
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const filtered = allRules.filter(rule => 
        rule.title.toLowerCase().includes(searchTerm) ||
        rule.content.toLowerCase().includes(searchTerm) ||
        rule.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        rule.sectionTitle.toLowerCase().includes(searchTerm) ||
        rule.categoryTitle.toLowerCase().includes(searchTerm)
      );
      
      document.getElementById('rules-container').innerHTML = renderRulesList(filtered);
    });
    
  } catch (error) {
    hideLoading();
    console.error('Failed to load rulebook:', error);
    showToast('Failed to load rules', 'error');
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Failed to Load Rules</div>
        <div class="empty-state-description">
          ${error.message || 'Please try again later.'}
        </div>
        <button class="btn btn-primary" onclick="window.location.reload()">
          <i class="fas fa-redo"></i> Retry
        </button>
      </div>
    `;
  }
}

function renderRulesList(rules) {
  if (rules.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="empty-state-title">No Rules Found</div>
        <div class="empty-state-description">
          Try adjusting your search terms.
        </div>
      </div>
    `;
  }
  
  return `
    <div style="display: grid; gap: 16px;">
      ${rules.map(rule => `
        <div class="card" style="cursor: pointer;" onclick="window.app.router.navigate('/rule/${rule.id}')">
          <div class="card-body">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
              <h3 style="font-size: 18px; font-weight: 700; color: #013369; margin: 0;">
                ${rule.title}
              </h3>
              <span class="tag tag-primary">${rule.difficulty}</span>
            </div>
            
            <div style="font-size: 14px; color: #666; margin-bottom: 8px;">
              <i class="fas fa-folder"></i> ${rule.sectionTitle} → ${rule.categoryTitle}
            </div>
            
            <p style="color: #333; font-size: 14px; line-height: 1.6; margin-bottom: 12px;">
              ${rule.content.substring(0, 150)}${rule.content.length > 150 ? '...' : ''}
            </p>
            
            ${rule.tags && rule.tags.length > 0 ? `
              <div class="rule-tags">
                ${rule.tags.map(tag => `<span class="tag tag-secondary">${tag}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}