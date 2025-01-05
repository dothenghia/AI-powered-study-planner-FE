import { toast } from 'react-toastify';
import { UpdateProfileType } from '../pages/profile/Profile';
import { profileService } from '../services/profile';
import { useAuthStore } from '../stores';

export const useProfile = () => {
    const { email, imageUrl, username, setEmail, setUsername, setImageUrl } = useAuthStore()
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
            console.log("🚀 ~ useProfile ~ email:", email)
            toast.dismiss();
            toast.success('Profile updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
            return false;
        }
    };


    return {
        updateProfile
    };
}; 