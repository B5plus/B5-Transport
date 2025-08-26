export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001/api',
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    CREATE_REQUEST: '/vehicles/request',
    MY_REQUESTS: '/vehicles/my-requests',
    GET_REQUEST: '/vehicles/request',
    ALL_REQUESTS: '/admin/requests',
    MARK_RETURNED: '/admin/request',
    DASHBOARD_STATS: '/admin/dashboard'
  }
};

export const APP_CONFIG = {
  TOKEN_KEY: 'b5_transport_token',
  USER_KEY: 'b5_transport_user',
  PAGINATION: {
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 50
  },
  DEPARTMENTS: [
    'IT', 'HR', 'Finance', 'Operations', 
    'Marketing', 'Sales', 'Management', 
    'Logistics', 'Security', 'Maintenance'
  ],
  VEHICLE_TYPES: [
    'Car', 'Van', 'Truck', 'Bus', 'Motorcycle'
  ]
};
