// Client export
export { supabase } from './client';

// Type exports
export type { 
  UserRegistrationData, 
  ProfileData, 
  AuthError 
} from './types';

// Auth exports
export { 
  signUp, 
  signIn, 
  signOut, 
  getCurrentUser 
} from './auth';

// Profile exports
export { 
  createProfile, 
  getProfile 
} from './profile';

// Helper object for backward compatibility
export const authHelpers = {
  signUp: async (userData: import('./types').UserRegistrationData) => {
    const { signUp } = await import('./auth');
    return signUp(userData);
  },
  signIn: async (email: string, password: string) => {
    const { signIn } = await import('./auth');
    return signIn(email, password);
  },
  signOut: async () => {
    const { signOut } = await import('./auth');
    return signOut();
  },
  getCurrentUser: async () => {
    const { getCurrentUser } = await import('./auth');
    return getCurrentUser();
  },
  getUserProfile: async (userId: string) => {
    const { getProfile } = await import('./profile');
    return getProfile(userId);
  }
};