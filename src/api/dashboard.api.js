import api from './axios';

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard/me');
   return response.data;  
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};