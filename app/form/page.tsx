'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompleteFormData, completeFormSchema } from '@/lib/form-schema';
import { BrandIdentitySection } from './components/BrandIdentitySection';
import { ColorPaletteSection } from './components/ColorPaletteSection';
import { ImagesSection } from './components/ImagesSection';
import { DesignStructureSection } from './components/DesignStructureSection';
import { TechnologySection } from './components/TechnologySection';
import { FormNavigation } from './components/FormNavigation';
import { FormPreview } from './components/FormPreview';
import { useFormPreview } from '@/hooks/useFormPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check, FileDown } from 'lucide-react';
import { LoadTemplateDialog } from './components/LoadTemplateDialog';
import { exportToPDF } from '@/lib/export-pdf';

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const { formData, updateFormData, isPreviewVisible, togglePreview } = useFormPreview();
  const router = useRouter();

  const form = useForm<CompleteFormData>({
    resolver: zodResolver(completeFormSchema) as any,
    defaultValues: {
      brandIdentity: {
        projectName: '',
        slogan: '',
        logo: '',
        mission: '',
        objectives: '',
      },
      colorPalette: {
        primaryColor: '#2563eb',
        secondaryColor: '#38bdf8',
        backgroundColor: '#f8fafc',
        textColor: '#111827',
        bannerColor: '#2563eb',
        footerColor: '#1e293b',
      },
      images: {
        heroImage: '',
        bannerImage: '',
        featureImages: [],
        aboutImage: '',
        ctaBackground: '',
        footerLogo: '',
      },
      designStructure: {
        projectType: 'Landing Page',
        sectionsToInclude: ['Hero'],
        visualStyle: 'Modern',
        preferredLayout: 'Single Page',
        fontTypography: 'Inter',
        includeImageVideo: false,
      },
      technology: {
        preferredTechnology: ['Next.js', 'TailwindCSS'],
        includeLoginSignup: false,
        includeDashboard: false,
        includeDatabase: false,
        mobileOptimization: true,
      },
    },
  });

  const { watch } = form;

  // Update preview data when form changes
  useState(() => {
    const subscription = watch((value) => {
      updateFormData('brandIdentity', value.brandIdentity);
      updateFormData('colorPalette', value.colorPalette);
      updateFormData('images', value.images);
      updateFormData('designStructure', value.designStructure);
      updateFormData('technology', value.technology);
    });
    return () => subscription.unsubscribe();
  });

  const steps = [
    { title: 'Brand & Identity', component: <BrandIdentitySection form={form} onColorsExtracted={setSuggestedColors} /> },
    { title: 'Color Palette', component: <ColorPaletteSection form={form} suggestedColors={suggestedColors} /> },
    { title: 'Images & Placement', component: <ImagesSection form={form} /> },
    { title: 'Design Structure', component: <DesignStructureSection form={form} /> },
    { title: 'Technology', component: <TechnologySection form={form} /> },
  ];

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      // Generate prompt
      await handleGeneratePrompt();
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSave = async () => {
    try {
      const values = form.getValues();
      const { data, error } = await supabase
        .from('project_templates')
        .insert({
          name: values.brandIdentity.projectName || 'Untitled Project',
          form_data: values,
        })
        .select()
        .single();

      if (error) throw error;

      alert('Template saved successfully!');
    } catch (error) {
      console.error('Failed to save template:', error);
      alert('Failed to save template. Please try again.');
    }
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const values = form.getValues();
      
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-prompt', {
        body: { formData: values },
      });

      if (error) throw error;

      setGeneratedPrompt(data.prompt);

      // Save submission
      await supabase.from('project_submissions').insert({
        prompt_generated: data.prompt,
        prompt_text: data.prompt,
        form_data: values,
      });
    } catch (error) {
      console.error('Failed to generate prompt:', error);
      alert('Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleExportJSON = () => {
    const values = form.getValues();
    const dataStr = JSON.stringify(values, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${values.brandIdentity.projectName || 'project'}-config.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportPDF = () => {
    if (generatedPrompt) {
      const values = form.getValues();
      exportToPDF(values, generatedPrompt);
    }
  };

  const handleLoadTemplate = (data: CompleteFormData) => {
    form.reset(data);
    setSuggestedColors([]);
  };

  const handleOpenInCursor = () => {
    if (generatedPrompt) {
      // Copy to clipboard first
      navigator.clipboard.writeText(generatedPrompt);
      // Open Cursor protocol (if available)
      window.open(`cursor://file?prompt=${encodeURIComponent(generatedPrompt)}`, '_blank');
      alert('Prompt copied to clipboard! Open Cursor and paste the prompt.');
    }
  };

  const handleOpenInReplit = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      window.open('https://replit.com/new', '_blank');
      alert('Prompt copied to clipboard! Paste it in your new Repl.');
    }
  };

  const handleOpenInVSCode = () => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
      window.open('vscode://file', '_blank');
      alert('Prompt copied to clipboard! Open VS Code and paste the prompt.');
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (generatedPrompt) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Your AI Prompt is Ready!</h1>
            <p className="text-muted-foreground mt-2">
              Copy this prompt and use it with your favorite AI tool or IDE
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg relative">
            <pre className="whitespace-pre-wrap text-sm">{generatedPrompt}</pre>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleCopyPrompt} className="flex-1">
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleExportJSON}>
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Open in your favorite IDE:</p>
            <div className="grid grid-cols-3 gap-3">
              <Button variant="secondary" onClick={handleOpenInCursor}>
                Cursor
              </Button>
              <Button variant="secondary" onClick={handleOpenInReplit}>
                Replit
              </Button>
              <Button variant="secondary" onClick={handleOpenInVSCode}>
                VS Code
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setGeneratedPrompt(null);
              setCurrentStep(0);
            }}
            className="w-full"
          >
            Create Another Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">SaaS AI Prompt Generator</h1>
          <p className="text-muted-foreground">
            Create a detailed prompt for your next project
          </p>
        </div>
        <LoadTemplateDialog onLoad={handleLoadTemplate} />
      </div>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={currentStep.toString()} className="w-full">
            <TabsList className="grid grid-cols-5 w-full">
              {steps.map((step, index) => (
                <TabsTrigger
                  key={index}
                  value={index.toString()}
                  onClick={() => setCurrentStep(index)}
                  disabled={index > currentStep + 1}
                >
                  {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>

            {steps.map((step, index) => (
              <TabsContent key={index} value={index.toString()}>
                {step.component}
              </TabsContent>
            ))}
          </Tabs>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={steps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
            isSaving={false}
          />
        </div>

        <div className="lg:col-span-1">
          <FormPreview
            formData={formData}
            isVisible={isPreviewVisible}
            onToggle={togglePreview}
          />
        </div>
      </div>
    </div>
  );
}

