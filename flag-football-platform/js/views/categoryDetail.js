// Category Detail View - Sequential Rule Navigation
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderCategoryDetail(categoryId, ruleIndex = 0) {
  const container = document.getElementById('view-container');
  
  showLoading('Loading...');
  
  try {
    // Fetch all rulebooks to find this category
    const rulebooksResponse = await fetch('http://localhost:3000/api/admin/rulebooks');
    const rulebooksResult = await rulebooksResponse.json();
    const rulebooks = rulebooksResult.data || [];
    
    let foundCategory = null;
    let foundSection = null;
    let foundRulebook = null;
    
    // Search through all rulebooks
    for (const rb of rulebooks) {
      const response = await fetch(`http://localhost:3000/api/admin/rulebooks/${rb.id}`);
      const result = await response.json();
      const rulebook = result.data;
      
      for (const section of rulebook.sections || []) {
        const category = section.categories?.find(c => c.id === categoryId);
        if (category) {
          foundCategory = category;
          foundSection = section;
          foundRulebook = rulebook;
          break;
        }
      }
      if (foundCategory) break;
    }
    
    if (!foundCategory || !foundCategory.rules || foundCategory.rules.length === 0) {
      hideLoading();
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="empty-state-title">Category Not Found</div>
          <div class="empty-state-description">
            The requested category could not be found or has no rules.
          </div>
          <a href="/card2" data-route="/card2" class="btn btn-primary" style="margin-top: 16px;">
            <i class="fas fa-arrow-left"></i> Back to Learning Path
          </a>
        </div>
      `;
      return;
    }
    
    // Ensure ruleIndex is valid
    if (ruleIndex < 0) ruleIndex = 0;
    if (ruleIndex >= foundCategory.rules.length) ruleIndex = foundCategory.rules.length - 1;
    
    const currentRule = foundCategory.rules[ruleIndex];
    const totalRules = foundCategory.rules.length;
    const progressPercent = Math.round(((ruleIndex + 1) / totalRules) * 100);
    
    hideLoading();
    
    container.innerHTML = `
      <div>
        <!-- Header with Progress -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #013369 0%, #0B2265 100%);">
          <div class="card-body">
            <div style="color: white;">
              <!-- Breadcrumb -->
              <div style="font-size: 14px; opacity: 0.9; margin-bottom: 12px;">
                ${foundSection.title} → ${foundCategory.title}
              </div>
              
              <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">
                Rule ${ruleIndex + 1} of ${totalRules}
              </h1>
              
              <!-- Progress Bar -->
              <div class="progress-label" style="color: white;">
                <span>Category Progress</span>
                <span>${progressPercent}%</span>
              </div>
              <div class="progress-container" style="background: rgba(255,255,255,0.2);">
                <div class="progress-bar" style="width: ${progressPercent}%; background: #28A745;"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Rule Content -->
        <div class="rule-content">
          <h2 class="rule-title">${currentRule.title}</h2>
          
          <div class="rule-body">
            ${formatRuleContent(currentRule.content)}
          </div>
          
          ${currentRule.tags && currentRule.tags.length > 0 ? `
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E5E5;">
              <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #666;">
                <i class="fas fa-tags"></i> Tags
              </h3>
              <div class="rule-tags">
                ${currentRule.tags.map(tag => `<span class="tag tag-secondary">${tag}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Navigation Controls -->
        <div style="margin: 32px 0;">
          <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center;">
            <button 
              class="btn ${ruleIndex === 0 ? 'btn-secondary' : 'btn-primary'}" 
              onclick="navigateToPreviousInCategory('${categoryId}', ${ruleIndex})"
              ${ruleIndex === 0 ? 'disabled' : ''}
              style="justify-self: start;"
            >
              <i class="fas fa-chevron-left"></i> Previous
            </button>
            
            <div style="text-align: center;">
              <div style="font-size: 14px; color: #666;">
                ${ruleIndex + 1} / ${totalRules}
              </div>
            </div>
            
            <button 
              class="btn ${ruleIndex === totalRules - 1 ? 'btn-success' : 'btn-primary'}" 
              onclick="navigateToNextInCategory('${categoryId}', ${ruleIndex}, ${totalRules})"
              style="justify-self: end;"
            >
              ${ruleIndex === totalRules - 1 ? 'Complete <i class="fas fa-check"></i>' : 'Next <i class="fas fa-chevron-right"></i>'}
            </button>
          </div>
        </div>
        
        <!-- Quick Navigation (Rule List) -->
        <div class="card" style="margin-bottom: 24px;">
          <div class="card-header" style="background: white; color: #013369; border-bottom: 2px solid #E5E5E5; cursor: pointer;" onclick="toggleRuleList()">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; font-size: 18px; font-weight: 700;">
                <i class="fas fa-list"></i> All Rules in ${foundCategory.title}
              </h3>
              <i class="fas fa-chevron-down" id="rule-list-chevron" style="transition: transform 0.3s;"></i>
            </div>
          </div>
          <div class="card-body" id="rule-list" style="display: none; padding: 16px;">
            <div style="display: grid; gap: 8px;">
              ${foundCategory.rules.map((rule, idx) => `
                <div 
                  class="action-btn ${idx === ruleIndex ? 'active' : ''}" 
                  onclick="navigateToRuleInCategory('${categoryId}', ${idx})"
                  style="cursor: pointer; padding: 12px; display: flex; align-items: center; gap: 12px; ${idx === ruleIndex ? 'background: #013369; color: white;' : ''}"
                >
                  <span style="flex-shrink: 0; width: 28px; height: 28px; background: ${idx === ruleIndex ? 'white' : '#013369'}; color: ${idx === ruleIndex ? '#013369' : 'white'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">
                    ${idx + 1}
                  </span>
                  <span style="flex: 1; text-align: left;">${rule.title}</span>
                  ${idx < ruleIndex ? '<i class="fas fa-check-circle" style="color: #28A745;"></i>' : ''}
                  ${idx === ruleIndex ? '<i class="fas fa-arrow-right"></i>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: grid; gap: 12px; margin-bottom: 24px;">
          <button class="btn btn-secondary btn-block" onclick="window.app.router.navigate('/section/${foundSection.id}')">
            <i class="fas fa-arrow-left"></i> Back to ${foundSection.title}
          </button>
          <button class="btn btn-primary btn-block" onclick="window.app.router.navigate('/rule/${currentRule.id}')">
            <i class="fas fa-expand"></i> View Full Rule Details
          </button>
        </div>
      </div>
    `;
    
    // Store context
    window.currentCategoryContext = {
      category: foundCategory,
      section: foundSection,
      rulebook: foundRulebook,
      currentIndex: ruleIndex
    };
    
    // Scroll to top
    window.scrollTo(0, 0);
    
  } catch (error) {
    hideLoading();
    console.error('Failed to load category:', error);
    showToast('Failed to load category', 'error');
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Error Loading Category</div>
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

// Format rule content
function formatRuleContent(content) {
  if (!content) return '';
  
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map(para => {
    para = para.trim();
    
    if (/^\d+\./.test(para)) {
      const items = para.split(/\n(?=\d+\.)/);
      return '<ol>' + items.map(item => {
        const text = item.replace(/^\d+\.\s*/, '');
        return `<li>${text}</li>`;
      }).join('') + '</ol>';
    } else if (/^[-•*]/.test(para)) {
      const items = para.split(/\n(?=[-•*])/);
      return '<ul>' + items.map(item => {
        const text = item.replace(/^[-•*]\s*/, '');
        return `<li>${text}</li>`;
      }).join('') + '</ul>';
    } else if (para.length > 0) {
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }
    return '';
  }).join('');
}

// Toggle rule list
window.toggleRuleList = function() {
  const ruleList = document.getElementById('rule-list');
  const chevron = document.getElementById('rule-list-chevron');
  
  if (ruleList.style.display === 'none') {
    ruleList.style.display = 'block';
    chevron.style.transform = 'rotate(180deg)';
  } else {
    ruleList.style.display = 'none';
    chevron.style.transform = 'rotate(0deg)';
  }
};

// Navigate to previous rule in category
window.navigateToPreviousInCategory = function(categoryId, currentIndex) {
  if (currentIndex > 0) {
    window.app.router.navigate(`/category/${categoryId}/${currentIndex - 1}`);
  }
};

// Navigate to next rule in category
window.navigateToNextInCategory = function(categoryId, currentIndex, totalRules) {
  if (currentIndex < totalRules - 1) {
    window.app.router.navigate(`/category/${categoryId}/${currentIndex + 1}`);
  } else {
    // Completed category
    const context = window.currentCategoryContext;
    showToast('Category completed! 🎉', 'success');
    
    setTimeout(() => {
      window.app.router.navigate(`/section/${context.section.id}`);
    }, 1500);
  }
};

// Navigate to specific rule in category
window.navigateToRuleInCategory = function(categoryId, ruleIndex) {
  window.app.router.navigate(`/category/${categoryId}/${ruleIndex}`);
};