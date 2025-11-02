// Signup View
import { showToast, showLoading, hideLoading } from '../utils.js';

export function renderSignup() {
    const container = document.getElementById('view-container');

    container.innerHTML = `
    <div style="max-width: 500px; margin: 40px auto;">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Create Account</h2>
          <p class="card-subtitle">Join Flag Football Platform</p>
        </div>
        <div class="card-body">
          <form id="signup-form">
            <div class="form-group">
              <label class="form-label">Email *</label>
              <input 
                type="email" 
                id="signup-email" 
                class="form-input" 
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Password *</label>
              <input 
                type="password" 
                id="signup-password" 
                class="form-input" 
                placeholder="Minimum 6 characters"
                minlength="6"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">I am a *</label>
              <select id="signup-role" class="form-select" required>
                <option value="">Select your role</option>
                <option value="player">Player</option>
                <option value="coach">Coach</option>
                <option value="referee">Referee</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Experience Level</label>
              <select id="signup-experience" class="form-select">
                <option value="">Select experience (optional)</option>
                <option value="never_played">Never Played</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Age Range</label>
              <select id="signup-age" class="form-select">
                <option value="">Select age range (optional)</option>
                <option value="under_18">Under 18</option>
                <option value="18_25">18-25</option>
                <option value="26_35">26-35</option>
                <option value="36_45">36-45</option>
                <option value="46_plus">46+</option>
              </select>
            </div>

            <div class="form-group">
            <label class="form-label">Gender</label>
            <select id="signup-gender" class="form-select">
                <option value="">Select gender (optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">Location</label>
              <input 
                type="text" 
                id="signup-location" 
                class="form-input" 
                placeholder="City, Country (optional)"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Default Rulebook</label>
              <select id="signup-rulebook" class="form-select">
                <option value="nfl_flag">NFL Flag</option>
                <option value="ifaf">IFAF</option>
              </select>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
              <i class="fas fa-user-plus"></i>
              Create Account
            </button>
          </form>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666;">Already have an account?</p>
            <a href="/login" data-route="/login" class="btn btn-secondary" style="margin-top: 8px;">
              Login
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 16px;">
            <a href="/" data-route="/" style="color: #013369; text-decoration: none;">
              <i class="fas fa-arrow-left"></i> Continue as Guest
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

    // Handle form submission
    const form = document.getElementById('signup-form');
    form.addEventListener('submit', handleSignup);
}

async function handleSignup(e) {
    e.preventDefault();

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const role = document.getElementById('signup-role').value;
    const experience = document.getElementById('signup-experience').value;
    const ageRange = document.getElementById('signup-age').value;
    const gender = document.getElementById('signup-gender').value;
    const location = document.getElementById('signup-location').value;
    const defaultRulebook = document.getElementById('signup-rulebook').value;

    if (!role) {
        showToast('Please select your role', 'warning');
        return;
    }

    showLoading('Creating account...');

    try {
        const auth = window.app.auth;
        const result = await auth.signUp(email, password, {
            role,
            experienceLevel: experience || null,
            ageRange: ageRange || null,
            gender: gender || null,
            location: location || null,
            defaultRulebook
        });

        if (result.success) {
            hideLoading();
            showToast('Account created! Please check your email to verify.', 'success');

            // Clear form
            document.getElementById('signup-form').reset();

            // Navigate to login immediately
            setTimeout(() => {
                window.app.router.navigate('/login');
            }, 2000);
        } else {
            hideLoading();
            showToast(result.error || 'Signup failed', 'error');
        }
    } catch (error) {
        hideLoading();
        showToast('Signup failed: ' + error.message, 'error');
    }
}