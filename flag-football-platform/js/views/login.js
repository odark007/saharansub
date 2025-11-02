// Login View
import { showToast, showLoading, hideLoading } from '../utils.js';

export function renderLogin() {
  const container = document.getElementById('view-container');
  
  container.innerHTML = `
    <div style="max-width: 400px; margin: 40px auto;">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Login</h2>
          <p class="card-subtitle">Welcome back to Flag Football</p>
        </div>
        <div class="card-body">
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input 
                type="email" 
                id="login-email" 
                class="form-input" 
                placeholder="your@email.com"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input 
                type="password" 
                id="login-password" 
                class="form-input" 
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">
              <i class="fas fa-sign-in-alt"></i>
              Login
            </button>
          </form>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666;">Don't have an account?</p>
            <a href="/signup" data-route="/signup" class="btn btn-secondary" style="margin-top: 8px;">
              Create Account
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
  const form = document.getElementById('login-form');
  form.addEventListener('submit', handleLogin);
}

async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  
  showLoading('Logging in...');
  
  try {
    const auth = window.app.auth;
    const result = await auth.signIn(email, password);
    
    if (result.success) {
      hideLoading();
      showToast('Login successful!', 'success');
      
      // Load user data
      const userData = await auth.getUserData(result.user.id);
      window.app.state.setState('user', userData);
      window.app.state.setState('isAuthenticated', true);
      
      // Navigate to home
      window.app.router.navigate('/');
    } else {
      hideLoading();
      showToast(result.error || 'Login failed', 'error');
    }
  } catch (error) {
    hideLoading();
    showToast('Login failed: ' + error.message, 'error');
  }
}