import api from './axios';

export const submitActivity = async (activityId, answers) => {
    const response = await api.post(`/activities/${activityId}/submit`, { answers });
    return response.data;
};

export const getMySubmission = async (activityId) => {
    const response = await api.get(`/activities/${activityId}/my-submission`);
    return response.data;
};

export const getAllSubmissions = async (activityId, page = 1, limit = 50) => {
    const response = await api.get(`/activities/${activityId}/submissions?page=${page}&limit=${limit}`);
    return response.data;
};

export const gradeSubmission = async (submissionId, gradingData) => {
    const response = await api.patch(`/submissions/${submissionId}/grade`, gradingData);
    return response.data;
};

export const getClassroomGradebook = async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/gradebook`);
    return response.data;
};

export const getMyGrades = async () => {
    const response = await api.get(`/grades/me`);
    return response.data;
};
