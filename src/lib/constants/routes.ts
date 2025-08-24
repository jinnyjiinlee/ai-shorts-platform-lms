export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/auth/register',
  RESET_PASSWORD: '/auth/reset-password',

  // Admin routes
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/student',
  ADMIN_MISSIONS: '/admin/missionNotice',
  ADMIN_TRACKING: '/admin/missionTracking',
  ADMIN_PROGRESS: '/admin/progressManagement',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_COMMUNITY: '/admin/community',

  // Student routes
  STUDENT: '/student',
  STUDENT_DASHBOARD: '/student',
  STUDENT_MISSIONS: '/student/missions',
  STUDENT_RESOURCES: '/student/resources',
  STUDENT_PROFILE: '/student/profile',
} as const;

export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    SIGNOUT: '/auth/signout',
    PROFILE: '/auth/profile',
  },
  MISSIONS: {
    LIST: '/api/missions',
    CREATE: '/api/missions',
    UPDATE: '/api/missions',
    DELETE: '/api/missions',
    SUBMISSIONS: '/api/submissions',
  },
  USERS: {
    LIST: '/api/users',
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users',
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    ANALYTICS: '/api/dashboard/analytics',
  },
} as const;
