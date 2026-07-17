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
  const response = await api.get('/auth/me', { skipGlobalErrorHandler: true });
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const verifyResetOTP = async (data) => {
  const response = await api.post('/auth/verify-reset-otp', data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const requestEmailUpdate = async (data) => {
  const response = await api.post('/auth/request-email-update', data);
  return response.data;
};

export const updateEmail = async (data) => {
  const response = await api.put('/auth/update-email', data);
  return response.data;
};

export const resendVerification = async () => {
  const response = await api.post('/auth/resend-verification');
  return response.data;
};

export const updatePassword = async (data) => {
  const response = await api.put('/auth/update-password', data);
  return response.data;
};
 
export const verifyEmail = async (data) => {
  const response = await api.post('/auth/verify-email', data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await api.post('/auth/forgot-password', data);
  return response.data;
};