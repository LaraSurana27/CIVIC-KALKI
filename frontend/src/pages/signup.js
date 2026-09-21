import { auth } from '../api.js';
import { setAuth, isAuthenticated } from '../auth.js';
import { navigate } from '../router.js';
import { toastError } from '../components/toast.js';

export function renderSignup() {
  if (isAuthenticated()) {
    navigate('/dashboard');
    return;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="auth-layout">
      <div class="auth-panel-left">
        <div class="auth-brand">
          <div class="brand-icon">CK</div>
          <div class="brand-name">CIVIC KALKI</div>
        </div>
        <h1>Civic Operations Platform</h1>
        <p>Register as a citizen to submit issues and track their progress through the civic pipeline.</p>
        
        <div class="auth-feature-list">
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Explain your problem once</div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Track status in real-time</div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Transparent workflow routing</div>
          </div>
        </div>
      </div>
      
      <div class="auth-panel-right">
        <div class="auth-form-container">
          <h2>Create an account</h2>
          <p class="subtitle">Join as a citizen to get started</p>
          
          <form id="signup-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" id="name" class="form-control" placeholder="Enter your full name" required autofocus>
            </div>
            
            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" id="email" class="form-control" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="password" class="form-control" placeholder="Create a password (min 8 chars)" minlength="8" required>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full mt-4" id="signup-btn">
              Create Account
            </button>
          </form>
          
          <div class="mt-6 text-center text-sm text-secondary">
            Already have an account? <a href="/login" class="text-link">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('signup-btn');
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!name || !email || !password) return;

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Creating account...';

    try {
      const res = await auth.signup(name, email, password);
      setAuth({ token: res.data.token, user: res.data.user });
      navigate('/dashboard');
    } catch (err) {
      toastError(err.message || 'Signup failed');
      btn.disabled = false;
      btn.innerHTML = 'Create Account';
    }
  });
}
