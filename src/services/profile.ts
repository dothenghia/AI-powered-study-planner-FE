import { UpdateProfileType } from '../pages/profile/Profile';
import { api } from './api';

export const profileService = {
    updateProfile: async (userId: string | null, data: UpdateProfileType) => {
        const response = await api.post(`/user/update`, {
            id: userId,
            email: data.email,
            username: data.username,
            imageUrl: data.imageUrl
        });
        return response.data.data;
    },
};
