'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface ColorPickerFieldProps {
  label: string;
  description: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

function ColorPickerField({ label, description, value, onChange, error }: ColorPickerFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-[100px] p-0 h-10"
              style={{ backgroundColor: value }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3">
            <HexColorPicker color={value} onChange={onChange} />
          </PopoverContent>
        </Popover>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface ColorPaletteSectionProps {
  form: UseFormReturn<CompleteFormData>;
  suggestedColors?: string[];
}

export function ColorPaletteSection({ form, suggestedColors }: ColorPaletteSectionProps) {
  const { watch, setValue } = form;

  const applySuggestedColors = () => {
    if (!suggestedColors || suggestedColors.length === 0) return;

    setValue('colorPalette.primaryColor', suggestedColors[0] || '#2563eb');
    setValue('colorPalette.secondaryColor', suggestedColors[1] || '#38bdf8');
    setValue('colorPalette.backgroundColor', suggestedColors[2] || '#f8fafc');
    setValue('colorPalette.textColor', suggestedColors[3] || '#111827');
    setValue('colorPalette.bannerColor', suggestedColors[0] || '#2563eb');
    setValue('colorPalette.footerColor', suggestedColors[4] || '#1e293b');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Color Palette</CardTitle>
        <CardDescription>
          Define colors for each area of your application
        </CardDescription>
        {suggestedColors && suggestedColors.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Suggested colors from your logo:
            </p>
            <div className="flex gap-2 mb-2">
              {suggestedColors.map((color, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={applySuggestedColors}
            >
              Apply Suggested Colors
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <ColorPickerField
          label="Primary Color *"
          description="Used for buttons, links, and primary accents"
          value={watch('colorPalette.primaryColor') || '#2563eb'}
          onChange={(color) => setValue('colorPalette.primaryColor', color)}
          error={form.formState.errors.colorPalette?.primaryColor?.message}
        />

        <ColorPickerField
          label="Secondary Color *"
          description="Used for secondary elements and hover states"
          value={watch('colorPalette.secondaryColor') || '#38bdf8'}
          onChange={(color) => setValue('colorPalette.secondaryColor', color)}
          error={form.formState.errors.colorPalette?.secondaryColor?.message}
        />

        <ColorPickerField
          label="Background Color *"
          description="General page background color"
          value={watch('colorPalette.backgroundColor') || '#f8fafc'}
          onChange={(color) => setValue('colorPalette.backgroundColor', color)}
          error={form.formState.errors.colorPalette?.backgroundColor?.message}
        />

        <ColorPickerField
          label="Text Color *"
          description="Primary text color throughout the app"
          value={watch('colorPalette.textColor') || '#111827'}
          onChange={(color) => setValue('colorPalette.textColor', color)}
          error={form.formState.errors.colorPalette?.textColor?.message}
        />

        <ColorPickerField
          label="Banner Color *"
          description="Header/hero section background color"
          value={watch('colorPalette.bannerColor') || '#2563eb'}
          onChange={(color) => setValue('colorPalette.bannerColor', color)}
          error={form.formState.errors.colorPalette?.bannerColor?.message}
        />

        <ColorPickerField
          label="Footer Color *"
          description="Footer section background color"
          value={watch('colorPalette.footerColor') || '#1e293b'}
          onChange={(color) => setValue('colorPalette.footerColor', color)}
          error={form.formState.errors.colorPalette?.footerColor?.message}
        />
      </CardContent>
    </Card>
  );
}

