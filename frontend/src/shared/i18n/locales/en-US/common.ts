/**
 * Common translations - English
 *
 * Using nested structure, grouped by functionality for better maintainability
 */
export default {
  // Actions
  actions: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    submit: 'Submit',
    reset: 'Reset',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    finish: 'Finish',
    close: 'Close',
    open: 'Open',
    create: 'Create',
    update: 'Update',
    createUser: 'Create User',
    editUser: 'Edit User',
    activate: 'Activate',
    deactivate: 'Deactivate',
    activateSuccess: 'Activated successfully',
    deactivateSuccess: 'Deactivated successfully',
    createSuccess: 'Created successfully',
    updateSuccess: 'Updated successfully',
    deleteSuccess: 'Deleted successfully',
    operationFailed: 'Operation failed',
    confirmDelete: 'Are you sure you want to delete {{name}}?',
    label: 'Actions',
  },

  // Status
  status: {
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    noData: 'No data',
    active: 'Active',
  },

  // Common fields
  username: 'Username',
  password: 'Password',
  name: 'Name',
  avatar: 'Avatar',
  avatarOptional: 'Avatar (Optional)',
  avatarPlaceholder: 'https://example.com/avatar.jpg',
  total: 'Total',
  loading: 'Loading...',
  errorOccurred: 'An error occurred',
  inactive: 'Inactive',
  userManagement: 'User Management',
  optional: 'Optional',
  statusLabel: 'Status',
  createdAt: 'Created At',

  // Messages
  messages: {
    operationSuccess: 'Operation successful',
    operationFailed: 'Operation failed',
    confirmDelete: 'Are you sure you want to delete?',
  },

  // Time
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
  },

  // Form validation
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
  },

  // Pagination
  pagination: {
    total: 'Total {{total}} items',
    page: 'Page {{current}} / {{total}}',
  },
} as const
