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
      <div class="auth-card">
        <div class="auth-card-brand">
          <img src="/logo.png" alt="CivicKalki" style="height:44px; width:auto; object-fit:contain;" />
        </div>

        <h2>Sign in to Civic OS</h2>
        <p class="subtitle">Enter your credentials to access your operational dashboard</p>
        
        <div id="login-error-alert" class="alert alert-danger hidden mt-3 mb-3" role="alert" aria-live="assertive"></div>

        <form id="login-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              class="form-control" 
              placeholder="name@city.gov" 
              required 
              autofocus
              aria-required="true"
              autocomplete="email"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div style="position:relative;">
              <input 
                type="password" 
                id="password" 
                class="form-control" 
                placeholder="Enter password" 
                required
                aria-required="true"
                autocomplete="current-password"
                style="padding-right:40px;"
              >
              <button 
                type="button" 
                id="toggle-password-btn"
                aria-label="Show password"
                style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text-muted); padding:4px; display:flex; align-items:center;"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              </button>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary btn-full mt-4" id="login-btn">
            Sign In
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-secondary">
          Don't have an account? <a href="/signup" class="text-link">Sign up</a>
        </div>

        <div class="mt-4 text-center">
          <a href="/" style="font-size:0.8rem; color:var(--text-muted); text-decoration:none;">← Back to Public Home</a>
        </div>
      </div>
    </div>
  `;

  const passwordInput = document.getElementById('password');
  const toggleBtn = document.getElementById('toggle-password-btn');
  const eyeSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>`;
  const eyeOffSvg = `<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>`;

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.setAttribute('aria-label', type === 'password' ? 'Show password' : 'Hide password');
      toggleBtn.innerHTML = type === 'password' ? eyeSvg : eyeOffSvg;
    });
  }

  const errorAlert = document.getElementById('login-error-alert');

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (errorAlert) {
      errorAlert.classList.add('hidden');
      errorAlert.textContent = '';
    }

    const btn = document.getElementById('login-btn');
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      if (errorAlert) {
        errorAlert.textContent = 'Please enter both email address and password.';
        errorAlert.classList.remove('hidden');
      }
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px;margin-right:8px;"></div> Signing in...';

    try {
      const res = await auth.login(email, password);
      setAuth({ token: res.data.token, user: res.data.user });
      navigate('/dashboard');
    } catch (err) {
      const msg = err.message || 'Invalid email or password. Please check your credentials.';
      if (errorAlert) {
        errorAlert.textContent = msg;
        errorAlert.classList.remove('hidden');
      }
      toastError(msg);
      btn.disabled = false;
      btn.innerHTML = 'Sign In';
    }
  });
}
