const _ACCESS_CODE = 'cast123';
const _PASSWORD    = 'cast2026';
const _SESSION_KEY = 'sg_cast_authed';

function isAuthed() {
  return sessionStorage.getItem(_SESSION_KEY) === '1';
}

function requireAuth() {
  if (!isAuthed()) {
    const redirect = encodeURIComponent(location.href);
    location.replace('login.html?redirect=' + redirect);
  }
}

function login(code, password) {
  if (code === _ACCESS_CODE && password === _PASSWORD) {
    sessionStorage.setItem(_SESSION_KEY, '1');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(_SESSION_KEY);
  location.replace('login.html');
}
