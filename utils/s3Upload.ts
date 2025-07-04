import qs from 'qs';
import api from '@/api/api';

export interface PresignedUrlData {
  fileName: string;
  mediaUrl: string;
}

// 여러장의 이미지 Url를 요청할 경우 getPresignedUrl(['profile_1.jpg', 'profile_2.jpg']); 이렇게 보내주시면 됩니다!
export const getPresignedUrl = async (fileNames: string | string[]) => {
  const fileNameParams = Array.isArray(fileNames) ? fileNames : [fileNames];

  console.log('[getPresignedUrl] 요청 fileNames:', fileNameParams);

  try {
    const res = await api.get('/medias', {
      params: { fileName: fileNameParams },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    console.log('[getPresignedUrl] 응답 데이터:', res.data.data);
    return res.data.data;
  } catch (error: any) {
    console.error('[getPresignedUrl] 에러 발생:', error.message);
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
