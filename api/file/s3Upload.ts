import qs from 'qs';
import api from '@/api/api';

export interface PresignedUrlData {
  fileName: string;
  mediaUrl: string;
}

export type DomainType = 'FEED' | 'LEENK' | 'PROFILE';

// 여러장의 이미지 Url를 요청할 경우 getPresignedUrl(['profile_1.jpg', 'profile_2.jpg']); 이렇게 보내주시면 됩니다!
export const getPresignedUrl = async (
  fileNames: string | string[],
  domainType: DomainType,
) => {
  const fileNameParams = Array.isArray(fileNames) ? fileNames : [fileNames];

  try {
    const res = await api.get('/medias', {
      params: { fileName: fileNameParams, domainType },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    console.log('이미지 응답: ', res.data);
    return res.data.data;
  } catch (error) {
    console.error(
      '[getPresignedUrl] 에러 발생:',
      error instanceof Error ? error.message : '알 수 없는 오류',
    );
    throw error;
  }
};

export const uploadImageToS3 = async (uploadUrl: string, localUri: string) => {
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();

    await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
      },
      body: blob,
    });
  } catch (error) {
    console.error('[uploadImageToS3] 업로드 실패:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};
