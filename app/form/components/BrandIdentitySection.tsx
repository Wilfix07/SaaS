'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '@/lib/storage';
import { useColorExtraction } from '@/hooks/useColorExtraction';

interface BrandIdentitySectionProps {
  form: UseFormReturn<CompleteFormData>;
  onLogoUpload?: (url: string) => void;
  onColorsExtracted?: (colors: string[]) => void;
}

export function BrandIdentitySection({ form, onLogoUpload, onColorsExtracted }: BrandIdentitySectionProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { extractColors, isExtracting } = useColorExtraction();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase
      const result = await uploadImage(file, 'project-logos', 'logos');
      form.setValue('brandIdentity.logo', result.url);
      onLogoUpload?.(result.url);

      // Extract colors from logo
      try {
        const colors = await extractColors(file);
        onColorsExtracted?.(colors.palette);
      } catch (error) {
        console.error('Failed to extract colors:', error);
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload logo. Please try again.';
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand & Identity</CardTitle>
        <CardDescription>
          Define your project's visual elements and mission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project / Business Name *</Label>
          <Input
            id="projectName"
            placeholder="e.g., DebCargo Shipping"
            {...form.register('brandIdentity.projectName')}
          />
          {form.formState.errors.brandIdentity?.projectName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.brandIdentity.projectName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            id="slogan"
            placeholder="e.g., Fast. Reliable. Everywhere."
            {...form.register('brandIdentity.slogan')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Logo</Label>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={isUploading || isExtracting}
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : isExtracting ? 'Extracting Colors...' : 'Upload Logo'}
            </Button>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
            {logoPreview && (
              <div className="relative w-16 h-16 border rounded overflow-hidden">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Upload your logo to automatically extract color palette suggestions
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mission">Mission *</Label>
          <Textarea
            id="mission"
            placeholder="The main goal or vision of the project..."
            rows={4}
            {...form.register('brandIdentity.mission')}
          />
          {form.formState.errors.brandIdentity?.mission && (
            <p className="text-sm text-red-500">
              {form.formState.errors.brandIdentity.mission.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="objectives">Objectives *</Label>
          <Textarea
            id="objectives"
            placeholder="What you want to achieve with this app..."
            rows={4}
            {...form.register('brandIdentity.objectives')}
          />
          {form.formState.errors.brandIdentity?.objectives && (
            <p className="text-sm text-red-500">
              {form.formState.errors.brandIdentity.objectives.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

