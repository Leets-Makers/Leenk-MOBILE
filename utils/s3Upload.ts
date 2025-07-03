import axios from 'axios';
import { getAccessToken } from '@/utils/tokenStorage';

export const getPresignedUrl = async (fileName: string) => {
  const token = process.env.EXPO_PUBLIC_TOKEN;
  const url = `${process.env.EXPO_PUBLIC_API_URL}/medias`;

  console.log('[getPresignedUrl] 요청 URL:', url);
  console.log('[getPresignedUrl] 요청 fileName:', fileName);

  try {
    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      params: { fileName },
    });

    console.log('[getPresignedUrl] 응답 데이터:', res.data.data);
    return res.data.data[0].mediaUrl; // data 가 배열이면 이렇게
  } catch (error: any) {
    console.error('❌ [getPresignedUrl] 에러 발생:', error.message);
    if (axios.isAxiosError(error)) {
      console.log('상태 코드:', error.response?.status);
      console.log('에러 응답:', JSON.stringify(error.response?.data, null, 2));
    }
    throw error;
  }
};

export const uploadImageToS3 = async (uploadUrl: string, localUri: string) => {
  const response = await fetch(localUri);
  const blob = await response.blob();

  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': blob.type || 'image/jpeg',
    },
    body: blob,
  });
  console.log(
    'Presigned URL 요청:',
    `${process.env.EXPO_PUBLIC_API_URL}/medias`,
  );
  console.log('로컬 파일 경로:', localUri);
};
