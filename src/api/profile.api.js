import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const createProfile = async (profileData) => {
  
  const response = await api.post('/profile', profileData);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};