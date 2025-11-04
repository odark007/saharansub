// Card2 View - Learn How to Play (Structured Learning)
import { fetchRulebook } from '../api.js';
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderCard2() {
  const container = document.getElementById('view-container');
  
  showLoading('Loading learning path...');
  
  try {
    // Get all rulebooks
    const rulebooksResponse = await fetch('http://localhost:3000/api/admin/rulebooks');
    const rulebooksResult = await rulebooksResponse.json();
    const rulebooks = rulebooksResult.data || [];
    
    const activeRulebook = rulebooks.find(rb => rb.status === 'active');
    
    if (!activeRulebook) {
      hideLoading();
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-graduation-cap"></i>
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
    
    // Fetch the full rulebook
    const rulebook = await fetchRulebook(activeRulebook.id);
    
    hideLoading();
    
    // Group sections by difficulty
    const basicSections = rulebook.sections.filter(s => s.difficulty_level === 'basic');
    const intermediateSections = rulebook.sections.filter(s => s.difficulty_level === 'intermediate');
    const advancedSections = rulebook.sections.filter(s => s.difficulty_level === 'advanced');
    
    container.innerHTML = `
      <div>
        <div style="margin-bottom: 24px;">
          <a href="/" data-route="/" style="color: #013369; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <i class="fas fa-arrow-left"></i> Back to Home
          </a>
          <h1 class="text-primary" style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">
            Learn How to Play
          </h1>
          <p style="color: #666;">
            ${rulebook.name} - Structured Learning Path
          </p>
        </div>
        
        ${renderDifficultySection('Basic', 'Start here if you\'re new to flag football', basicSections, 'success')}
        ${renderDifficultySection('Intermediate', 'Build on your foundational knowledge', intermediateSections, 'primary')}
        ${renderDifficultySection('Advanced', 'Master the complex rules and strategies', advancedSections, 'danger')}
      </div>
    `;
    
  } catch (error) {
    hideLoading();
    console.error('Failed to load learning path:', error);
    showToast('Failed to load learning path', 'error');
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Failed to Load Learning Path</div>
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

function renderDifficultySection(level, description, sections, colorClass) {
  return `
    <div style="margin-bottom: 32px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <span class="tag tag-${colorClass}" style="font-size: 16px; padding: 8px 16px;">
          ${level}
        </span>
        <p style="color: #666; margin: 0;">${description}</p>
      </div>
      
      ${sections.length === 0 ? `
        <div class="card">
          <div class="card-body">
            <p style="color: #666; margin: 0; text-align: center;">
              No ${level.toLowerCase()} sections available yet.
            </p>
          </div>
        </div>
      ` : `
        <div style="display: grid; gap: 16px;">
          ${sections.map((section, index) => `
            <div class="card" style="cursor: pointer;" onclick="window.app.router.navigate('/section/${section.id}')">
              <div class="card-body">
                <div style="display: flex; gap: 16px; align-items: start;">
                  <div style="flex-shrink: 0; width: 48px; height: 48px; background: linear-gradient(135deg, #013369 0%, #0B2265 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px;">
                    ${index + 1}
                  </div>
                  <div style="flex: 1;">
                    <h3 style="font-size: 18px; font-weight: 700; color: #013369; margin-bottom: 8px;">
                      ${section.title}
                    </h3>
                    <div style="color: #666; font-size: 14px;">
                      ${section.categories?.length || 0} categories • 
                      ${section.categories?.reduce((sum, cat) => sum + (cat.rules?.length || 0), 0) || 0} rules
                    </div>
                  </div>
                  <i class="fas fa-chevron-right" style="color: #013369; margin-top: 12px;"></i>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}