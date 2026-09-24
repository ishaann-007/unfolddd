import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vmwdqhnoguotjrarrkwq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtd2RxaG5vZ3VvdGpyYXJya3dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxOTI5MjksImV4cCI6MjA5OTc2ODkyOX0.0QMZEEyqSbM16F-z-pu5Un9_j8WFKfG3aB7ONWcgzeI';

// Local demo accounts are intentionally limited to development use only.
// They are deterministic and stored in the browser's localStorage so they survive refresh.
export const LOCAL_DEMO_ACCOUNTS = {
  'demo@unfold.local': {
    id: 'demo-user-a',
    email: 'demo@unfold.local',
    password: 'demo1234',
    name: 'Demo User A',
    role: 'demo'
  },
  'demo-b@unfold.local': {
    id: 'demo-user-b',
    email: 'demo-b@unfold.local',
    password: 'demo5678',
    name: 'Demo User B',
    role: 'demo'
  }
};

const DEMO_SESSION_KEY = 'mindroot_demo_session';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export function isDemoSessionActive() {
  return !!getDemoSession();
}

export function getDemoSession() {
  try {
    const raw = localStorage.getItem(DEMO_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.warn('Demo session unavailable:', err);
    return null;
  }
}

export function setDemoSession(user) {
  try {
    localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
  } catch (err) {
    console.warn('Unable to persist demo session:', err);
  }
}

export function clearDemoSession() {
  try {
    localStorage.removeItem(DEMO_SESSION_KEY);
  } catch (err) {
    console.warn('Unable to clear demo session:', err);
  }
}

export function signInDemo(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const candidate = Object.values(LOCAL_DEMO_ACCOUNTS).find((account) => {
    return account.email.toLowerCase() === normalizedEmail && account.password === String(password || '');
  });

  if (!candidate) return null;

  const user = {
    id: candidate.id,
    email: candidate.email,
    name: candidate.name,
    role: candidate.role,
    isDemo: true,
    sessionType: 'demo',
    app_metadata: { provider: 'demo' },
    user_metadata: { full_name: candidate.name }
  };

  setDemoSession(user);
  return user;
}

export async function signOutDemo() {
  clearDemoSession();
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase sign-out is unavailable during local demo logout:', err);
  }
}

/**
 * Get the currently authenticated user.
 * Demo sessions are checked first so local development can work without Supabase.
 * This preserves the existing Supabase integration for later use.
 */
export async function getCurrentUser() {
  const demoSession = getDemoSession();
  if (demoSession) {
    return demoSession;
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
}