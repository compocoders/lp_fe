import api from './axios';

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const updateEmail = async (data) => {
  const response = await api.put('/auth/update-email', data);
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put('/auth/update-password', data);
  return response.data;
};
 