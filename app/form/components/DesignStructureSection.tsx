'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface DesignStructureSectionProps {
  form: UseFormReturn<CompleteFormData>;
}

const availableSections = [
  'Hero',
  'About',
  'Features',
  'Pricing',
  'Testimonials',
  'Contact',
  'FAQ',
  'Team',
  'Gallery',
  'Blog',
];

export function DesignStructureSection({ form }: DesignStructureSectionProps) {
  const { watch, setValue } = form;

  const selectedSections = watch('designStructure.sectionsToInclude') || [];

  const toggleSection = (section: string) => {
    const current = selectedSections;
    if (current.includes(section)) {
      setValue(
        'designStructure.sectionsToInclude',
        current.filter((s) => s !== section)
      );
    } else {
      setValue('designStructure.sectionsToInclude', [...current, section]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>App Design & Structure</CardTitle>
        <CardDescription>
          Define the overall structure and style of your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type *</Label>
          <Select
            value={watch('designStructure.projectType')}
            onValueChange={(value: any) => setValue('designStructure.projectType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Landing Page">Landing Page</SelectItem>
              <SelectItem value="Web App">Web App</SelectItem>
              <SelectItem value="Dashboard">Dashboard</SelectItem>
              <SelectItem value="Portfolio">Portfolio</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.designStructure?.projectType && (
            <p className="text-sm text-red-500">
              {form.formState.errors.designStructure.projectType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Sections to Include *</Label>
          <div className="grid grid-cols-2 gap-4">
            {availableSections.map((section) => (
              <div key={section} className="flex items-center space-x-2">
                <Checkbox
                  id={`section-${section}`}
                  checked={selectedSections.includes(section)}
                  onCheckedChange={() => toggleSection(section)}
                />
                <label
                  htmlFor={`section-${section}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {section}
                </label>
              </div>
            ))}
          </div>
          {form.formState.errors.designStructure?.sectionsToInclude && (
            <p className="text-sm text-red-500">
              {form.formState.errors.designStructure.sectionsToInclude.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="visualStyle">Visual Style *</Label>
          <Select
            value={watch('designStructure.visualStyle')}
            onValueChange={(value: any) => setValue('designStructure.visualStyle', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visual style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Modern">Modern</SelectItem>
              <SelectItem value="Minimalist">Minimalist</SelectItem>
              <SelectItem value="Corporate">Corporate</SelectItem>
              <SelectItem value="Playful">Playful</SelectItem>
              <SelectItem value="Luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.designStructure?.visualStyle && (
            <p className="text-sm text-red-500">
              {form.formState.errors.designStructure.visualStyle.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredLayout">Preferred Layout *</Label>
          <Select
            value={watch('designStructure.preferredLayout')}
            onValueChange={(value: any) => setValue('designStructure.preferredLayout', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single Page">Single Page</SelectItem>
              <SelectItem value="Multi-section">Multi-section</SelectItem>
              <SelectItem value="Dashboard">Dashboard</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.designStructure?.preferredLayout && (
            <p className="text-sm text-red-500">
              {form.formState.errors.designStructure.preferredLayout.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontTypography">Font / Typography</Label>
          <Input
            id="fontTypography"
            placeholder='e.g., "Inter", "Poppins", "Montserrat"'
            {...form.register('designStructure.fontTypography')}
          />
          <p className="text-xs text-muted-foreground">
            Specify the font family for your project
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeImageVideo"
            checked={watch('designStructure.includeImageVideo')}
            onCheckedChange={(checked) => setValue('designStructure.includeImageVideo', checked)}
          />
          <Label htmlFor="includeImageVideo">Include Image / Video Elements</Label>
        </div>
      </CardContent>
    </Card>
  );
}

