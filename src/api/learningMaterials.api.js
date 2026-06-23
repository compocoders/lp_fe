import api from './axios';

const multipartConfig = { headers: { 'Content-Type': undefined } };

export const getLearningMaterials = async (classroomId) => {
    const response = await api.get(`/learning-materials/${classroomId}`);
    return response.data;
};

export const createLearningMaterial = async (classroomId, formData) => {
    const response = await api.post(`/learning-materials/${classroomId}`, formData, multipartConfig);
    return response.data;
};

export const updateLearningMaterial = async (classroomId, materialId, formData) => {
    const response = await api.put(`/learning-materials/${classroomId}/${materialId}`, formData, multipartConfig);
    return response.data;
};

export const deleteLearningMaterial = async (classroomId, materialId) => {
    const response = await api.delete(`/learning-materials/${classroomId}/${materialId}`);
    return response.data;
};
