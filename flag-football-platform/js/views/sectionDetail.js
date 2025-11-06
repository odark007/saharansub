// Section Detail View
import { showToast, showLoading, hideLoading } from '../utils.js';

export async function renderSectionDetail(sectionId) {
    const container = document.getElementById('view-container');

    showLoading('Loading section...');

    try {
        // Fetch all rulebooks to find this section
        const rulebooksResponse = await fetch('http://localhost:3000/api/admin/rulebooks');
        const rulebooksResult = await rulebooksResponse.json();
        const rulebooks = rulebooksResult.data || [];

        let foundSection = null;
        let foundRulebook = null;

        // Search through all rulebooks to find the section
        for (const rb of rulebooks) {
            const response = await fetch(`http://localhost:3000/api/admin/rulebooks/${rb.id}`);
            const result = await response.json();
            const rulebook = result.data;

            const section = rulebook.sections?.find(s => s.id === sectionId);
            if (section) {
                foundSection = section;
                foundRulebook = rulebook;
                break;
            }
        }

        if (!foundSection) {
            hideLoading();
            container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="empty-state-title">Section Not Found</div>
          <div class="empty-state-description">
            The requested section could not be found.
          </div>
          <a href="/card2" data-route="/card2" class="btn btn-primary" style="margin-top: 16px;">
            <i class="fas fa-arrow-left"></i> Back to Learning Path
          </a>
        </div>
      `;
            return;
        }

        hideLoading();

        // Calculate progress
        const totalRules = foundSection.categories?.reduce((sum, cat) => sum + (cat.rules?.length || 0), 0) || 0;
        const user = window.app.state.getState('user');
        const isAuthenticated = window.app.state.getState('isAuthenticated');

        // TODO: Get actual progress from backend
        const completedRules = 0;
        const progressPercent = totalRules > 0 ? Math.round((completedRules / totalRules) * 100) : 0;

        container.innerHTML = `
      <div>
        <!-- Breadcrumb Navigation -->
        <div style="margin-bottom: 16px; font-size: 14px; color: #666;">
          <a href="/" data-route="/" style="color: #013369; text-decoration: none;">Home</a>
          <i class="fas fa-chevron-right" style="margin: 0 8px; font-size: 12px;"></i>
          <a href="/card2" data-route="/card2" style="color: #013369; text-decoration: none;">Learn How to Play</a>
          <i class="fas fa-chevron-right" style="margin: 0 8px; font-size: 12px;"></i>
          <span>${foundSection.title}</span>
        </div>
        
        <!-- Section Header -->
        <div class="card" style="margin-bottom: 24px; background: linear-gradient(135deg, #013369 0%, #0B2265 100%);">
          <div class="card-body">
            <div style="color: white;">
              <span class="tag" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 12px; display: inline-block;">
                ${foundSection.difficulty_level.toUpperCase()}
              </span>
              <h1 style="font-size: 28px; font-weight: 700; margin: 0 0 8px 0;">
                ${foundSection.title}
              </h1>
              <p style="opacity: 0.9; margin: 0;">
                ${foundRulebook.name} - Version ${foundRulebook.version}
              </p>
              
              ${isAuthenticated ? `
                <div style="margin-top: 24px;">
                  <div class="progress-label" style="color: white;">
                    <span>Your Progress</span>
                    <span>${progressPercent}%</span>
                  </div>
                  <div class="progress-container" style="background: rgba(255,255,255,0.2);">
                    <div class="progress-bar" style="width: ${progressPercent}%; background: #28A745;"></div>
                  </div>
                  <p style="font-size: 14px; margin-top: 8px; opacity: 0.9;">
                    ${completedRules} of ${totalRules} rules completed
                  </p>
                </div>
              ` : `
                <div style="margin-top: 16px; padding: 12px; background: rgba(255,255,255,0.1); border-radius: 8px;">
                  <i class="fas fa-info-circle"></i>
                  <a href="/login" data-route="/login" style="color: white; text-decoration: underline; margin-left: 8px;">
                    Login to track your progress
                  </a>
                </div>
              `}
            </div>
          </div>
        </div>
        
        <!-- Categories List -->
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #013369;">
          Categories in this Section
        </h2>
        
        ${foundSection.categories && foundSection.categories.length > 0 ? `
          <div style="display: grid; gap: 16px;">
            ${foundSection.categories.map((category, catIndex) => `
              <div class="card" style="cursor: pointer;" onclick="expandCategory('${category.id}')">
                <div class="card-body">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: start; gap: 16px;">
                        <div style="flex-shrink: 0; width: 40px; height: 40px; background: linear-gradient(135deg, #013369 0%, #0B2265 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
                          ${catIndex + 1}
                        </div>
                        <div>
                          <h3 style="font-size: 18px; font-weight: 700; color: #013369; margin: 0 0 8px 0;">
                            ${category.title}
                          </h3>
                          <p style="color: #666; font-size: 14px; margin: 0;">
                            ${category.rules?.length || 0} rules
                          </p>

                              <button 
                                class="btn btn-primary btn-sm" 
                                onclick="event.stopPropagation(); window.app.router.navigate('/category/${category.id}/0')"
                                 style="margin-bottom: 8px;"
                                >
                                <i class="fas fa-play"></i> Start Learning Mode
                                </button>
                        </div>
                      </div>
                      
                      <!-- Rules List (Initially Hidden) -->
                      <div id="category-${category.id}" style="display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid #E5E5E5;">
                        ${category.rules && category.rules.length > 0 ? `
                          <div style="display: grid; gap: 8px;">
                            ${category.rules.map((rule, ruleIndex) => `
                              <div 
                                style="padding: 12px; background: #F8F9FA; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.background='#E9ECEF'"
                                onmouseout="this.style.background='#F8F9FA'"
                                onclick="event.stopPropagation(); window.app.router.navigate('/rule/${rule.id}')"
                              >
                                <div style="display: flex; align-items: center; gap: 12px;">
                                  <span style="flex-shrink: 0; width: 28px; height: 28px; background: white; border: 2px solid #013369; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #013369;">
                                    ${ruleIndex + 1}
                                  </span>
                                  <div style="flex: 1;">
                                    <div style="font-weight: 600; color: #013369; margin-bottom: 4px;">
                                      ${rule.title}
                                    </div>
                                    <div style="font-size: 12px; color: #666;">
                                      ${rule.content.substring(0, 100)}${rule.content.length > 100 ? '...' : ''}
                                    </div>
                                  </div>
                                  <i class="fas fa-chevron-right" style="color: #013369;"></i>
                                </div>
                              </div>
                            `).join('')}
                          </div>
                        ` : `
                          <p style="color: #666; text-align: center; padding: 16px;">
                            No rules in this category yet.
                          </p>
                        `}
                      </div>
                    </div>
                    <i class="fas fa-chevron-down" id="chevron-${category.id}" style="color: #013369; margin-top: 8px; transition: transform 0.3s;"></i>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-folder-open"></i>
            </div>
            <div class="empty-state-title">No Categories Yet</div>
            <div class="empty-state-description">
              This section doesn't have any categories yet.
            </div>
          </div>
        `}
        
        <!-- Action Buttons -->
        ${foundSection.categories && foundSection.categories.length > 0 && foundSection.categories[0].rules?.length > 0 ? `
          <div style="margin-top: 32px; text-align: center;">
            <button 
              class="btn btn-primary btn-lg" 
              onclick="window.app.router.navigate('/rule/${foundSection.categories[0].rules[0].id}')"
            >
              <i class="fas fa-play"></i> Start Learning
            </button>
          </div>
        ` : ''}
        
        <!-- Back Button -->
        <div style="text-align: center; margin-top: 24px;">
          <a href="/card2" data-route="/card2" class="btn btn-secondary">
            <i class="fas fa-arrow-left"></i> Back to Learning Path
          </a>
        </div>
      </div>
    `;

        // Store section context
        window.currentSectionContext = {
            section: foundSection,
            rulebook: foundRulebook
        };

    } catch (error) {
        hideLoading();
        console.error('Failed to load section:', error);
        showToast('Failed to load section details', 'error');

        container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="empty-state-title">Error Loading Section</div>
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

// Expand/collapse category
window.expandCategory = function (categoryId) {
    const categoryDiv = document.getElementById(`category-${categoryId}`);
    const chevron = document.getElementById(`chevron-${categoryId}`);

    if (categoryDiv.style.display === 'none') {
        categoryDiv.style.display = 'block';
        chevron.style.transform = 'rotate(180deg)';
    } else {
        categoryDiv.style.display = 'none';
        chevron.style.transform = 'rotate(0deg)';
    }
};