import localServices from '../data/services.json';
import localCategories from '../data/categories.json';

const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('circuitcare_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth API
  async signup({ fullName, email, phone, password }) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    if (data.data?.token) {
      localStorage.setItem('circuitcare_token', data.data.token);
    }
    return data.data;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Invalid email or password');
    if (data.data?.token) {
      localStorage.setItem('circuitcare_token', data.data.token);
    }
    return data.data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        ...getAuthHeader(),
      },
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.user || null;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data.data?.user;
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset request failed');
    return data;
  },

  async resetPassword({ token, password }) {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset failed');
    return data;
  },

  async logout() {
    localStorage.removeItem('circuitcare_token');
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  },

  // Catalogue API (with graceful fallback to shared dataset)
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/services/categories`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (e) {
      // Fallback
    }
    return localCategories;
  },

  async getServices({ category = '', search = '', pricingBasis = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (search) params.append('search', search);
      if (pricingBasis && pricingBasis !== 'all') params.append('pricingBasis', pricingBasis);

      const res = await fetch(`${API_BASE}/services?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // Fallback
    }

    // Client-side fallback filter
    let list = localServices;
    if (category && category !== 'all') {
      const catLower = category.toLowerCase();
      const matchedCat = localCategories.find(
        (c) => c.slug.toLowerCase() === catLower || c.name.toLowerCase() === catLower
      );
      const targetName = matchedCat ? matchedCat.name.toLowerCase() : catLower;
      list = list.filter((s) => s.category.toLowerCase() === targetName);
    }
    if (pricingBasis && pricingBasis !== 'all') {
      const pbLower = pricingBasis.toLowerCase();
      list = list.filter((s) => (s.pricingBasis || '').toLowerCase().includes(pbLower));
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.scope && s.scope.toLowerCase().includes(q))
      );
    }
    return list;
  },

  async getServiceById(id) {
    try {
      const res = await fetch(`${API_BASE}/services/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) return json.data;
      }
    } catch (e) {
      // Fallback
    }
    return localServices.find((s) => s.id.toUpperCase() === id.toUpperCase()) || null;
  },

  async prepareEnquiry(enquiryData) {
    const res = await fetch(`${API_BASE}/enquiry/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      credentials: 'include',
      body: JSON.stringify(enquiryData),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || 'Failed to validate enquiry');
      err.errors = data.errors;
      throw err;
    }
    return data.data;
  }
};

export default api;
