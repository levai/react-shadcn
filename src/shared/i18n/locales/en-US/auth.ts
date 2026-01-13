/**
 * Authentication translations - English
 *
 * Using nested structure, grouped by functionality for better maintainability
 */
export default {
  // Actions
  login: 'Login',
  logout: 'Logout',
  register: 'Register',

  // Form fields
  form: {
    username: 'Username',
    password: 'Password',
    email: 'Email',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
  },

  // Login page
  loginPage: {
    title: 'Welcome back',
    subtitle: 'Please enter your account information',
  },

  // Messages
  messages: {
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed',
    logoutSuccess: 'Logged out successfully',
    invalidCredentials: 'Invalid username or password',
    tokenExpired: 'Session expired, please login again',
    unauthorized: 'Unauthorized, please login first',
  },
} as const
