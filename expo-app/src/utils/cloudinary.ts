const CLOUD = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';

export async function uploadToCloudinary(
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<{ secure_url: string; public_id: string }> {
  if (!CLOUD || !PRESET) {
    throw new Error('Cloudinary not configured: set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET');
  }
  const url = `https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`;
  const form = new FormData();
  // @ts-expect-error RN FormData file shape
  form.append('file', { uri: fileUri, name: fileName, type: mimeType });
  form.append('upload_preset', PRESET);
  const res = await fetch(url, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  return res.json();
}
