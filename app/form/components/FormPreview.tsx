'use client';

import { CompleteFormData } from '@/lib/form-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FormPreviewProps {
  formData: Partial<CompleteFormData>;
  isVisible: boolean;
  onToggle: () => void;
}

export function FormPreview({ formData, isVisible, onToggle }: FormPreviewProps) {
  const colors = formData.colorPalette || {
    primaryColor: '#2563eb',
    secondaryColor: '#38bdf8',
    backgroundColor: '#f8fafc',
    textColor: '#111827',
    bannerColor: '#2563eb',
    footerColor: '#1e293b',
  };
  const brand = formData.brandIdentity || { projectName: '', slogan: '' };
  const images = formData.images || {};

  if (!isVisible) {
    return (
      <div className="fixed top-20 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="rounded-full shadow-lg"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="sticky top-4"
    >
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Live Preview</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-6 w-6"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock Page Preview */}
          <div className="border rounded-lg overflow-hidden">
            {/* Header/Banner */}
            <div
              className="h-24 flex items-center justify-center text-white font-bold"
              style={{
                backgroundColor: colors.bannerColor || '#2563eb',
              }}
            >
              {brand.projectName || 'Your Project'}
            </div>

            {/* Content Area */}
            <div
              className="p-4 space-y-4"
              style={{
                backgroundColor: colors.backgroundColor || '#f8fafc',
                color: colors.textColor || '#111827',
              }}
            >
              {/* Hero Image */}
              {images.heroImage && (
                <div className="w-full h-32 rounded overflow-hidden">
                  <img
                    src={images.heroImage}
                    alt="Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Slogan */}
              {brand.slogan && (
                <p className="text-sm italic text-center">{brand.slogan}</p>
              )}

              {/* Primary Button */}
              <button
                className="w-full py-2 px-4 rounded text-white font-medium text-sm"
                style={{
                  backgroundColor: colors.primaryColor || '#2563eb',
                }}
              >
                Call to Action
              </button>

              {/* Secondary Button */}
              <button
                className="w-full py-2 px-4 rounded text-white font-medium text-sm"
                style={{
                  backgroundColor: colors.secondaryColor || '#38bdf8',
                }}
              >
                Learn More
              </button>

              {/* Feature Images */}
              {images.featureImages && images.featureImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.featureImages.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`Feature ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="h-16 flex items-center justify-center text-white text-xs"
              style={{
                backgroundColor: colors.footerColor || '#1e293b',
              }}
            >
              {images.footerLogo ? (
                <img
                  src={images.footerLogo}
                  alt="Footer Logo"
                  className="h-8"
                />
              ) : (
                'Footer Section'
              )}
            </div>
          </div>

          {/* Color Palette Display */}
          {Object.keys(colors).length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2">Color Palette</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(colors).map(([name, color]) => (
                  <div key={name} className="space-y-1">
                    <div
                      className="w-full h-8 rounded border"
                      style={{ backgroundColor: color as string }}
                    />
                    <p className="text-xs truncate">{name.replace('Color', '')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

