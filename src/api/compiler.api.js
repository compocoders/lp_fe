import api from './axios';

export const getSupportedLanguages = async () => {
    const response = await api.get(`/compiler/languages`);
    return response.data;
};

export const runCode = async (executionData) => {
    const response = await api.post(`/compiler/run`, executionData);
    return response.data;
};
