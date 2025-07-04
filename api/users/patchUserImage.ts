import api from '@/api/api';

export const updateUserProfileImage = async ({
  profileImage,
}: {
  profileImage: string;
}) => {
  try {
    const response = await api.patch('/users/me/profileImage', profileImage);
    console.log('updateUserProfileImage: ', response.data);
  } catch (error: any) {
    console.error('updateUserProfileImage 오류:', error.message);
    throw error;
  }
  return;
};
