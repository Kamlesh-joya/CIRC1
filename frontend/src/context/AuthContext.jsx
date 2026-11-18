import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draftEnquiry, setDraftEnquiry] = useState(() => {
    try {
      const saved = sessionStorage.getItem('circuitcare_draft_enquiry');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await api.getMe();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    setUser(data.user);
    return data.user;
  };

  const signup = async ({ fullName, email, phone, password }) => {
    const data = await api.signup({ fullName, email, phone, password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    clearDraftEnquiry();
  };

  const updateProfile = async (profileData) => {
    const updated = await api.updateProfile(profileData);
    setUser(updated);
    return updated;
  };

  const saveDraftEnquiry = (enquiryData) => {
    setDraftEnquiry(enquiryData);
    try {
      sessionStorage.setItem('circuitcare_draft_enquiry', JSON.stringify(enquiryData));
    } catch (e) {}
  };

  const clearDraftEnquiry = () => {
    setDraftEnquiry(null);
    try {
      sessionStorage.removeItem('circuitcare_draft_enquiry');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        draftEnquiry,
        saveDraftEnquiry,
        clearDraftEnquiry
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
