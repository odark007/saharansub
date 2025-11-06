// Rule Detail View
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderRuleDetail(ruleId) {
  const container = document.getElementById('view-container');
  
  showLoading('Loading rule...');
  
  try {
    // Fetch rule details from backend
    // We need to get the full rulebook structure to find this rule
    const rulebooksResponse = await fetch('http://localhost:3000/api/admin/rulebooks');
    const rulebooksResult = await rulebooksResponse.json();
    const rulebooks = rulebooksResult.data || [];
    
    let foundRule = null;
    let foundCategory = null;
    let foundSection = null;
    let foundRulebook = null;
    
    // Search through all rulebooks to find the rule
    for (const rb of rulebooks) {
      const response = await fetch(`http://localhost:3000/api/admin/rulebooks/${rb.id}`);
      const result = await response.json();
      const rulebook = result.data;
      
      // Search through sections
      for (const section of rulebook.sections || []) {
        for (const category of section.categories || []) {
          const rule = category.rules?.find(r => r.id === ruleId);
          if (rule) {
            foundRule = rule;
            foundCategory = category;
            foundSection = section;
            foundRulebook = rulebook;
            break;
          }
        }
        if (foundRule) break;
      }
      if (foundRule) break;
    }
    
    if (!foundRule) {
      hideLoading();
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="empty-state-title">Rule Not Found</div>
          <div class="empty-state-description">
            The requested rule could not be found.
          </div>
          <a href="/card1" data-route="/card1" class="btn btn-primary" style="margin-top: 16px;">
            <i class="fas fa-arrow-left"></i> Back to Rules
          </a>
        </div>
      `;
      return;
    }
    
    hideLoading();
    
    // Check if user is authenticated
    const user = window.app.state.getState('user');
    const isAuthenticated = window.app.state.getState('isAuthenticated');
    
    // Check if bookmarked
    let isBookmarked = false;
    if (isAuthenticated && user) {
      // TODO: Check if rule is bookmarked
    }
    
    container.innerHTML = `
      <div>
        <!-- Breadcrumb Navigation -->
        <div style="margin-bottom: 16px; font-size: 14px; color: #666;">
          <a href="/" data-route="/" style="color: #013369; text-decoration: none;">Home</a>
          <i class="fas fa-chevron-right" style="margin: 0 8px; font-size: 12px;"></i>
          <a href="/card1" data-route="/card1" style="color: #013369; text-decoration: none;">Quick Reference</a>
          <i class="fas fa-chevron-right" style="margin: 0 8px; font-size: 12px;"></i>
          <span>${foundRule.title}</span>
        </div>
        
        <!-- Rule Content Card -->
        <div class="rule-content">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <h1 class="rule-title">${foundRule.title}</h1>
            <span class="tag tag-primary">${foundSection.difficulty_level}</span>
          </div>
          
          <div style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 2px solid #E5E5E5;">
            <p style="color: #666; margin: 0;">
              <i class="fas fa-book"></i> ${foundRulebook.name} v${foundRulebook.version}
            </p>
            <p style="color: #666; margin: 4px 0 0 0;">
              <i class="fas fa-folder"></i> ${foundSection.title} → ${foundCategory.title}
            </p>
          </div>
          
          <div class="rule-body">
            ${formatRuleContent(foundRule.content)}
          </div>
          
          ${foundRule.tags && foundRule.tags.length > 0 ? `
            <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #E5E5E5;">
              <h3 style="font-size: 16px; font-weight: 700; margin-bottom: 12px; color: #666;">
                <i class="fas fa-tags"></i> Tags
              </h3>
              <div class="rule-tags">
                ${foundRule.tags.map(tag => `<span class="tag tag-secondary">${tag}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
        
        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="action-btn ${isBookmarked ? 'active' : ''}" onclick="toggleBookmark('${ruleId}')" id="bookmark-btn">
            <i class="fas fa-bookmark"></i>
            <span>${isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
          <button class="action-btn" onclick="shareRule()">
            <i class="fas fa-share-alt"></i>
            <span>Share</span>
          </button>
          <button class="action-btn" onclick="reportIssue('${ruleId}')">
            <i class="fas fa-flag"></i>
            <span>Report Issue</span>
          </button>
        </div>
        
        <!-- Pagination / Navigation -->
        <div class="pagination">
          <button class="pagination-btn" onclick="navigateToPreviousRule('${ruleId}')" id="prev-rule-btn">
            <i class="fas fa-chevron-left"></i> Previous Rule
          </button>
          <div class="pagination-info">
            Rule ${foundRule.order} of ${foundCategory.rules.length} in this category
          </div>
          <button class="pagination-btn" onclick="navigateToNextRule('${ruleId}')" id="next-rule-btn">
            Next Rule <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        
        <!-- Back Button -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="/card1" data-route="/card1" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to All Rules
          </a>
        </div>
      </div>
    `;
    
    // Store rule context for navigation
    window.currentRuleContext = {
      rule: foundRule,
      category: foundCategory,
      section: foundSection,
      rulebook: foundRulebook
    };
    
  } catch (error) {
    hideLoading();
    console.error('Failed to load rule:', error);
    showToast('Failed to load rule details', 'error');
    
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Error Loading Rule</div>
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

// Format rule content (convert newlines to paragraphs, handle lists, etc.)
function formatRuleContent(content) {
  if (!content) return '';
  
  // Split by double newlines for paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  return paragraphs.map(para => {
    para = para.trim();
    
    // Check if it's a list item (starts with number or bullet)
    if (/^\d+\./.test(para)) {
      // Numbered list
      const items = para.split(/\n(?=\d+\.)/);
      return '<ol>' + items.map(item => {
        const text = item.replace(/^\d+\.\s*/, '');
        return `<li>${text}</li>`;
      }).join('') + '</ol>';
    } else if (/^[-•*]/.test(para)) {
      // Bullet list
      const items = para.split(/\n(?=[-•*])/);
      return '<ul>' + items.map(item => {
        const text = item.replace(/^[-•*]\s*/, '');
        return `<li>${text}</li>`;
      }).join('') + '</ul>';
    } else if (para.length > 0) {
      // Regular paragraph
      return `<p>${para.replace(/\n/g, '<br>')}</p>`;
    }
    return '';
  }).join('');
}

// Toggle bookmark
window.toggleBookmark = async function(ruleId) {
  const isAuthenticated = window.app.state.getState('isAuthenticated');
  
  if (!isAuthenticated) {
    showToast('Please login to bookmark rules', 'warning');
    setTimeout(() => {
      window.app.router.navigate('/login');
    }, 1500);
    return;
  }
  
  // TODO: Implement bookmark toggle with backend
  showToast('Bookmark feature coming soon!', 'info');
};

// Share rule
window.shareRule = function() {
  const url = window.location.href;
  
  if (navigator.share) {
    navigator.share({
      title: document.querySelector('.rule-title').textContent,
      text: 'Check out this flag football rule',
      url: url
    }).catch(err => console.log('Share failed:', err));
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link copied to clipboard!', 'success');
    });
  }
};

// Report issue
window.reportIssue = function(ruleId) {
  const description = prompt('Please describe the issue with this rule:');
  
  if (description && description.trim()) {
    // TODO: Send to backend
    showToast('Thank you for reporting! We will review it.', 'success');
  }
};

// Navigate to previous rule
window.navigateToPreviousRule = function(currentRuleId) {
  const context = window.currentRuleContext;
  if (!context) return;
  
  const currentIndex = context.category.rules.findIndex(r => r.id === currentRuleId);
  if (currentIndex > 0) {
    const prevRule = context.category.rules[currentIndex - 1];
    window.app.router.navigate(`/rule/${prevRule.id}`);
  } else {
    showToast('This is the first rule in this category', 'info');
  }
};

// Navigate to next rule
window.navigateToNextRule = function(currentRuleId) {
  const context = window.currentRuleContext;
  if (!context) return;
  
  const currentIndex = context.category.rules.findIndex(r => r.id === currentRuleId);
  if (currentIndex < context.category.rules.length - 1) {
    const nextRule = context.category.rules[currentIndex + 1];
    window.app.router.navigate(`/rule/${nextRule.id}`);
  } else {
    showToast('This is the last rule in this category', 'info');
  }
};