import qs from 'qs';
import api from '@/api/api';

export interface PresignedUrlData {
  fileName: string;
  mediaUrl: string;
}

// 여러장의 이미지 Url를 요청할 경우 getPresignedUrl(['profile_1.jpg', 'profile_2.jpg']); 이렇게 보내주시면 됩니다!
export const getPresignedUrl = async (
  fileNames: string | string[],
): Promise<PresignedUrlData[]> => {
  const fileNameParams = Array.isArray(fileNames) ? fileNames : [fileNames];

  console.log('[getPresignedUrl] 요청 fileNames:', fileNameParams);

  try {
    const res = await api.get('/medias', {
      params: { fileName: fileNameParams },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });

    console.log('[getPresignedUrl] 응답 데이터:', res.data.data);
    const responseData = res.data.data;
    if (!Array.isArray(responseData)) {
      throw new Error('서버 응답 형식이 올바르지 않습니다.');
    }
    return responseData;
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
    if (!response.ok) {
      throw new Error(`로컬 파일 읽기 실패: ${response.status}`);
    }
    const blob = await response.blob();

    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
      },
      body: blob,
    });

    if (!uploadResponse.ok) {
      throw new Error(
        `S3 업로드 실패: ${uploadResponse.status} ${uploadResponse.statusText}`,
      );
    }
  } catch (error) {
    console.error('[uploadImageToS3] 업로드 실패:', error);
    if (error instanceof Error) {
      throw new Error(`이미지 업로드 실패: ${error.message}`);
    }
    throw new Error('이미지 업로드에 실패했습니다.');
  }
};
