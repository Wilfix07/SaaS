'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

interface TechnologySectionProps {
  form: UseFormReturn<CompleteFormData>;
}

const availableTechnologies = [
  'Next.js',
  'React',
  'Vue.js',
  'TailwindCSS',
  'Supabase',
  'Firebase',
  'PostgreSQL',
  'MongoDB',
  'Express',
  'Node.js',
  'TypeScript',
  'Prisma',
  'tRPC',
  'GraphQL',
];

export function TechnologySection({ form }: TechnologySectionProps) {
  const { watch, setValue } = form;

  const selectedTechnologies = watch('technology.preferredTechnology') || [];

  const toggleTechnology = (tech: string) => {
    const current = selectedTechnologies;
    if (current.includes(tech)) {
      setValue(
        'technology.preferredTechnology',
        current.filter((t) => t !== tech)
      );
    } else {
      setValue('technology.preferredTechnology', [...current, tech]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technology & Functionality</CardTitle>
        <CardDescription>
          Select the technologies and features for your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Preferred Technology *</Label>
          <div className="grid grid-cols-2 gap-4">
            {availableTechnologies.map((tech) => (
              <div key={tech} className="flex items-center space-x-2">
                <Checkbox
                  id={`tech-${tech}`}
                  checked={selectedTechnologies.includes(tech)}
                  onCheckedChange={() => toggleTechnology(tech)}
                />
                <label
                  htmlFor={`tech-${tech}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tech}
                </label>
              </div>
            ))}
          </div>
          {form.formState.errors.technology?.preferredTechnology && (
            <p className="text-sm text-red-500">
              {form.formState.errors.technology.preferredTechnology.message}
            </p>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeLoginSignup">Include Login/Signup</Label>
              <p className="text-xs text-muted-foreground">
                Add authentication functionality to your app
              </p>
            </div>
            <Switch
              id="includeLoginSignup"
              checked={watch('technology.includeLoginSignup')}
              onCheckedChange={(checked) =>
                setValue('technology.includeLoginSignup', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeDashboard">Include Dashboard</Label>
              <p className="text-xs text-muted-foreground">
                Add a user dashboard with data visualization
              </p>
            </div>
            <Switch
              id="includeDashboard"
              checked={watch('technology.includeDashboard')}
              onCheckedChange={(checked) =>
                setValue('technology.includeDashboard', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="includeDatabase">Include Database</Label>
              <p className="text-xs text-muted-foreground">
                Set up database integration for data persistence
              </p>
            </div>
            <Switch
              id="includeDatabase"
              checked={watch('technology.includeDatabase')}
              onCheckedChange={(checked) =>
                setValue('technology.includeDatabase', checked)
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mobileOptimization">Mobile Optimization</Label>
              <p className="text-xs text-muted-foreground">
                Ensure the app is responsive and mobile-friendly
              </p>
            </div>
            <Switch
              id="mobileOptimization"
              checked={watch('technology.mobileOptimization')}
              onCheckedChange={(checked) =>
                setValue('technology.mobileOptimization', checked)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

