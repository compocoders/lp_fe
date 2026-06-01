import api from './axios';

export const getProfile = async () => {
  const response = await api.get('/profile/me');
  return response.data;
};

export const createProfile = async (profileData) => {
  const isFormData = profileData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': undefined } } : {};
  const response = await api.post('/profile', profileData, config);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const isFormData = profileData instanceof FormData;
  const config = isFormData ? { headers: { 'Content-Type': undefined } } : {};
  const response = await api.put('/profile', profileData, config);
  return response.data;
};
export const profilepage = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/s3/profile-picture', formData);
  return response.data;
};