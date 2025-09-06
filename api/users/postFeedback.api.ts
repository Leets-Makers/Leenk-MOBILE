import api from '@/api/api';

export const postUserFeedback = async ({ feedback }: { feedback: string }) => {
  try {
    await api.post('/user-setting/feedback', {
      feedback,
    });
  } catch (error: any) {
    console.error('postUserFeedback 오류:', error.message);
    throw error;
  }
};
