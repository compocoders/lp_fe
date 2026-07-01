import api from './axios';

export const createClassroom = async (classroomData) => {
    try {
        const response = await api.post('/classrooms', classroomData);
        return response.data;
    } catch (error) {
        console.error('Error creating classroom:', error);
        throw error;
    }
};

export const getClassroomByCode = async (code) => {
    try {
        const response = await api.get(`/classrooms/${code}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching classroom:', error);
        throw error;
    }
};

export const getMyClassrooms = async () => {
    try {
        const response = await api.get('/classrooms/my-rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching my classrooms:', error);
        throw error;
    }
};

export const getJoinedClassrooms = async () => {
    try {
        const response = await api.get('/classrooms/joined-rooms');
        return response.data;
    } catch (error) {
        console.error('Error fetching joined classrooms:', error);
        throw error;
    }
};

export const updateClassroom = async (id, data) => {
    try {
        const response = await api.put(`/classrooms/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating classroom:', error);
        throw error;
    }
};

export const deleteClassroom = async (id) => {
    try {
        const response = await api.delete(`/classrooms/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting classroom:', error);
        throw error;
    }
};

export const generateInviteLink = async (id) => {
    try {
        const response = await api.post(`/classrooms/${id}/invite`);
        return response.data;
    } catch (error) {
        console.error('Error generating invite link:', error);
        throw error;
    }
};

export const joinClassroom = async (token, roompassword) => {
    try {
        const response = await api.post(`/classrooms/join/${token}`, { roompassword });
        return response.data;
    } catch (error) {
        console.error('Error joining classroom:', error);
        throw error;
    }
};

export const leaveClassroom = async (id) => {
    try {
        const response = await api.delete(`/classrooms/${id}/leave`);
        return response.data;
    } catch (error) {
        console.error('Error leaving classroom:', error);
        throw error;
    }
};
export const removeMember = async (classroomId, userId) => {
    try {
        const response = await api.delete(`/classrooms/${classroomId}/members/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing member:', error);
        throw error;
    }
};
