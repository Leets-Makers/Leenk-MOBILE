import axios from 'axios';

export const getPresignedUrl = async (fileName: string) => {
  const token = process.env.EXPO_PUBLIC_TOKEN;

  const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/medias`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      fileName,
    },
  });

  return res.data.data.mediaUrl;
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
