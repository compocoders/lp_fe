import api from './axios';

export const createActivity = async (classroomId, activityData) => {
    const response = await api.post(`/classrooms/${classroomId}/activities`, activityData);
    return response.data;
};

export const listActivities = async (classroomId) => {
    const response = await api.get(`/classrooms/${classroomId}/activities`);
    return response.data;
};

export const getActivity = async (activityId) => {
    const response = await api.get(`/activities/${activityId}`);
    return response.data;
};

export const updateActivity = async (activityId, activityData) => {
    const response = await api.patch(`/activities/${activityId}`, activityData);
    return response.data;
};

export const publishActivity = async (activityId) => {
    const response = await api.patch(`/activities/${activityId}/publish`);
    return response.data;
};

export const closeActivity = async (activityId) => {
    const response = await api.patch(`/activities/${activityId}/close`);
    return response.data;
};

export const deleteActivity = async (activityId) => {
    const response = await api.delete(`/activities/${activityId}`);
    return response.data;
};
