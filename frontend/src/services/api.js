const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.token) {
        return null;
    }
    return {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
    };
};

export const api = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  // Recipe endpoints
  getRecipes: async (page = 1, search = '', type = '') => {
    try {
        const headers = getAuthHeader();
        const response = await fetch(
            `${API_URL}/recipes?page=${page}&search=${search}&type=${type}`,
            { headers }
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching recipes');
    }
  },

  getRecipe: async (id) => {
    try {
        const headers = getAuthHeader();
        const response = await fetch(`${API_URL}/recipes/${id}`, { headers });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch recipe');
        }
        return data;
    } catch (error) {
        throw new Error('Error fetching recipe');
    }
  },

  createRecipe: async (recipeData) => {
    const headers = getAuthHeader();
    if (!headers) {
        throw new Error('Not authenticated - Please log in again');
    }

    const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(recipeData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create recipe');
    }
    return data;
  },

  updateRecipe: async (id, recipeData) => {
    const headers = getAuthHeader();
    if (!headers) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(recipeData)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to update recipe');
    }
    return data;
  },

  deleteRecipe: async (id) => {
    const headers = getAuthHeader();
    if (!headers) {
        throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_URL}/recipes/${id}`, {
        method: 'DELETE',
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to delete recipe');
    }
    return response.json();
  }
};