// Onboarding View for Anonymous Users
import { showToast } from '../utils.js';

export function renderOnboarding() {
  const container = document.getElementById('view-container');
  
  container.innerHTML = `
    <div style="max-width: 500px; margin: 40px auto;">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Welcome to Flag Football</h2>
          <p class="card-subtitle">Learn the rules and improve your game</p>
        </div>
        <div class="card-body">
          <div style="text-align: center; margin-bottom: 30px;">
            <i class="fas fa-football-ball" style="font-size: 64px; color: #013369;"></i>
          </div>
          
          <h3 style="margin-bottom: 16px; color: #013369;">Get Started</h3>
          <p style="margin-bottom: 24px; color: #666;">
            Choose your role to personalize your learning experience
          </p>
          
          <form id="onboarding-form">
            <div class="form-group">
              <label class="form-label">I am a *</label>
              <select id="onboarding-role" class="form-select" required>
                <option value="">Select your role</option>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="referee">Referee</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Preferred Rulebook</label>
              <select id="onboarding-rulebook" class="form-select">
                <option value="nfl_flag">NFL Flag</option>
                <option value="ifaf">IFAF</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
              <i class="fas fa-check"></i>
              Continue
            </button>
          </form>
          
          <div style="text-align: center; margin-top: 24px; padding-top: 24px; border-top: 1px solid #ddd;">
            <p style="color: #666; margin-bottom: 12px;">Want to save your progress?</p>
            <a href="/signup" data-route="/signup" class="btn btn-secondary btn-block">
              <i class="fas fa-user-plus"></i>
              Create Free Account
            </a>
            <a href="/login" data-route="/login" style="display: block; margin-top: 12px; color: #013369; text-decoration: none;">
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Handle form submission
  const form = document.getElementById('onboarding-form');
  form.addEventListener('submit', handleOnboarding);
}

function handleOnboarding(e) {
  e.preventDefault();
  
  const role = document.getElementById('onboarding-role').value;
  const rulebook = document.getElementById('onboarding-rulebook').value;
  
  if (!role) {
    showToast('Please select your role', 'warning');
    return;
  }
  
  // Save anonymous user preferences
  localStorage.setItem('userRole', role);
  localStorage.setItem('defaultRulebook', rulebook);
  localStorage.setItem('onboardingComplete', 'true');
  
  // Update state
  window.app.state.setState('userRole', role);
  window.app.state.setState('currentRulebook', rulebook);
  
  showToast('Welcome! Let\'s get started', 'success');
  
  // Navigate to home
  window.app.router.navigate('/');
}