import { supabase } from './supabase';

export type ImageUploadResult = {
  url: string;
  path: string;
};

/**
 * Upload an image file to Supabase Storage
 * @param file - The file to upload
 * @param bucket - The bucket name ('project-images' or 'project-logos')
 * @param folder - Optional folder within the bucket
 * @returns Upload result with public URL and path
 */
export async function uploadImage(
  file: File,
  bucket: 'project-images' | 'project-logos',
  folder?: string
): Promise<ImageUploadResult> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

/**
 * Delete an image from Supabase Storage
 * @param path - The file path in storage
 * @param bucket - The bucket name
 */
export async function deleteImage(
  path: string,
  bucket: 'project-images' | 'project-logos'
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Get public URL for an image
 * @param path - The file path in storage
 * @param bucket - The bucket name
 * @returns Public URL
 */
export function getImageUrl(
  path: string,
  bucket: 'project-images' | 'project-logos'
): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

