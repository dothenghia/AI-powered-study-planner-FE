import { toast } from 'react-toastify';
import { UpdateProfileType } from '../pages/profile/Profile';
import { profileService } from '../services/profile';
import { useAuthStore } from '../stores';
import { AxiosError } from 'axios';

export const useProfile = () => {
    const { setEmail, setUsername, setImageUrl } = useAuthStore()
    const updateProfile = async (userId: string | null, data: UpdateProfileType): Promise<boolean> => {
        try {
            toast.info('Updating profile...');

            const updateBody = {
                email: data.email,
                imageUrl: data.imageUrl,
                username: data.username
            };

            await profileService.updateProfile(userId, updateBody);
            setUsername(updateBody.username);
            setEmail(updateBody.email);
            setImageUrl(updateBody.imageUrl);
            toast.dismiss();
            toast.success('Profile updated successfully');
            return true;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error?.response?.data?.message);
            } else { 
                toast.error('Failed to update profile');
            }
            return false;
        }
    };


    return {
        updateProfile
    };
}; 