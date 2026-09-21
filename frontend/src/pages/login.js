import { auth } from '../api.js';
import { setAuth, isAuthenticated } from '../auth.js';
import { navigate } from '../router.js';
import { toastError } from '../components/toast.js';

export function renderLogin() {
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
        <p>A unified system to organize civic information, connect stakeholders, and move cases through structured workflows.</p>
        
        <div class="auth-feature-list">
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Dynamic case structuring and forms</div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Role-based operational workflows</div>
          </div>
          <div class="auth-feature">
            <div class="auth-feature-icon">✓</div>
            <div class="auth-feature-text">Automated entity relationship mapping</div>
          </div>
        </div>
      </div>
      
      <div class="auth-panel-right">
        <div class="auth-form-container">
          <h2>Welcome back</h2>
          <p class="subtitle">Sign in to your account to continue</p>
          
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Email address</label>
              <input type="email" id="email" class="form-control" placeholder="Enter your email" required autofocus>
            </div>
            
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" id="password" class="form-control" placeholder="Enter your password" required>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full mt-4" id="login-btn">
              Sign In
            </button>
          </form>
          
          <div class="mt-6 text-center text-sm text-secondary">
            Don't have an account? <a href="/signup" class="text-link">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('login-btn');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) return;

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';

    try {
      const res = await auth.login(email, password);
      setAuth({ token: res.data.token, user: res.data.user });
      navigate('/dashboard');
    } catch (err) {
      toastError(err.message || 'Login failed');
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    }
  });
}
