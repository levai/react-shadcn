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
  },

  // Status
  status: {
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    noData: 'No data',
  },

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
