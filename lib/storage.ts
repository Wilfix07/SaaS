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
  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (bucket === 'project-logos') {
    validImageTypes.push('image/svg+xml');
  }
  
  if (!validImageTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed types: ${validImageTypes.join(', ')}`);
  }

  // Validate file size (5MB for logos, 10MB for images)
  const maxSize = bucket === 'project-logos' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    const maxSizeMB = bucket === 'project-logos' ? 5 : 10;
    throw new Error(`File size exceeds limit. Maximum size: ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

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
    console.error('Supabase storage error:', error);
    // Provide more specific error messages
    if (error.message?.includes('new row violates row-level security policy')) {
      throw new Error('Upload failed: Storage permissions not configured. Please contact support.');
    } else if (error.message?.includes('duplicate')) {
      throw new Error('A file with this name already exists. Please try again.');
    } else if (error.message?.includes('size')) {
      throw new Error('File size is too large. Please use a smaller image.');
    } else {
      throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
    }
  }

  if (!data) {
    throw new Error('Upload failed: No data returned from storage.');
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

