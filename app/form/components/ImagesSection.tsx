'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '@/lib/storage';

interface ImageUploadFieldProps {
  label: string;
  description: string;
  value?: string;
  onChange: (url: string) => void;
  onClear: () => void;
  multiple?: boolean;
  values?: string[];
  onMultipleChange?: (urls: string[]) => void;
}

function ImageUploadField({
  label,
  description,
  value,
  onChange,
  onClear,
  multiple = false,
  values = [],
  onMultipleChange,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      if (multiple && onMultipleChange) {
        const uploadPromises = Array.from(files).map((file) =>
          uploadImage(file, 'project-images', 'features')
        );
        const results = await Promise.all(uploadPromises);
        const urls = results.map((r) => r.url);
        onMultipleChange([...values, ...urls]);
      } else {
        const result = await uploadImage(files[0], 'project-images');
        onChange(result.url);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearMultiple = (index: number) => {
    if (onMultipleChange) {
      const newValues = values.filter((_, i) => i !== index);
      onMultipleChange(newValues);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById(`upload-${label}`)?.click()}
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          <input
            id={`upload-${label}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            multiple={multiple}
          />
        </div>

        {!multiple && value && (
          <div className="relative w-32 h-32 border rounded overflow-hidden group">
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {multiple && values.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {values.map((url, index) => (
              <div
                key={index}
                className="relative w-full aspect-square border rounded overflow-hidden group"
              >
                <img
                  src={url}
                  alt={`${label} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleClearMultiple(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

interface ImagesSectionProps {
  form: UseFormReturn<CompleteFormData>;
}

export function ImagesSection({ form }: ImagesSectionProps) {
  const { watch, setValue } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images & Placement</CardTitle>
        <CardDescription>
          Upload images for different sections of your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageUploadField
          label="Hero Section Image"
          description="Main background or presentation image for the hero section"
          value={watch('images.heroImage')}
          onChange={(url) => setValue('images.heroImage', url)}
          onClear={() => setValue('images.heroImage', undefined)}
        />

        <ImageUploadField
          label="Banner Image"
          description="Decorative image at the top of the page"
          value={watch('images.bannerImage')}
          onChange={(url) => setValue('images.bannerImage', url)}
          onClear={() => setValue('images.bannerImage', undefined)}
        />

        <ImageUploadField
          label="Feature Section Images"
          description="Images for feature cards (multiple images allowed)"
          multiple
          values={watch('images.featureImages') || []}
          onMultipleChange={(urls) => setValue('images.featureImages', urls)}
          onChange={() => {}}
          onClear={() => {}}
        />

        <ImageUploadField
          label="About Section Image"
          description="Team or product photo for the about section"
          value={watch('images.aboutImage')}
          onChange={(url) => setValue('images.aboutImage', url)}
          onClear={() => setValue('images.aboutImage', undefined)}
        />

        <ImageUploadField
          label="CTA Section Background"
          description="Background image for the call-to-action area"
          value={watch('images.ctaBackground')}
          onChange={(url) => setValue('images.ctaBackground', url)}
          onClear={() => setValue('images.ctaBackground', undefined)}
        />

        <ImageUploadField
          label="Footer Logo/Image"
          description="Logo or image used in the footer section"
          value={watch('images.footerLogo')}
          onChange={(url) => setValue('images.footerLogo', url)}
          onClear={() => setValue('images.footerLogo', undefined)}
        />
      </CardContent>
    </Card>
  );
}

