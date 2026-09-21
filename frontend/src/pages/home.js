import { isAuthenticated } from '../auth.js';
import { navigate } from '../router.js';

export function renderHome() {
  if (isAuthenticated()) {
    navigate('/dashboard');
  } else {
    navigate('/login');
  }
}
