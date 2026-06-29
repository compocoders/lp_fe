import { create } from 'zustand';

const useErrorStore = create((set) => ({
  hasError: false,
  errorType: null, // 'timeout' | 'unauthorized' | 'ratelimit' | 'server'
  errorMessage: '',

  setError: (type, message) => set({
    hasError: true,
    errorType: type,
    errorMessage: message,
  }),

  clearError: () => set({
    hasError: false,
    errorType: null,
    errorMessage: '',
  }),
}));

export default useErrorStore;
