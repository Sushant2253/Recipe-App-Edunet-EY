const API_URL = 'http://localhost:5000/api/auth';

export const auth = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return response.json();
    } catch (error) {
      throw new Error('Network error - Please check your connection');
    }
  },

  login: async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      if (data.success && data.token) {
        const userData = {
          ...data.user,
          token: data.token
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      return data;
    } catch (error) {
      throw new Error('Network error - Please check your connection');
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    return true;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default auth;