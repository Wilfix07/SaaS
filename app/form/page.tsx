'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompleteFormData, completeFormSchema } from '@/lib/form-schema';
import { AuthGuard } from '@/components/auth-guard';
import { BrandIdentitySection } from './components/BrandIdentitySection';
import { ColorPaletteSection } from './components/ColorPaletteSection';
import { ImagesSection } from './components/ImagesSection';
import { DesignStructureSection } from './components/DesignStructureSection';
import { TechnologySection } from './components/TechnologySection';
import { ProjectDetailsSection } from './components/ProjectDetailsSection';
import { AIProviderSection } from './components/AIProviderSection';
import { FormNavigation } from './components/FormNavigation';
import { FormPreview } from './components/FormPreview';
import { useFormPreview } from '@/hooks/useFormPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Copy, Check, FileDown, Maximize2, Minimize2, Square } from 'lucide-react';
import { LoadTemplateDialog } from './components/LoadTemplateDialog';
import { exportToPDF } from '@/lib/export-pdf';

function FormPageContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [formWidth, setFormWidth] = useState(40); // Default: 40% form, 60% preview (preview is larger)
  const [cardMaxWidth, setCardMaxWidth] = useState(800); // Default max width for form section cards
  const { formData, updateFormData, isPreviewVisible, togglePreview } = useFormPreview();
  const router = useRouter();

  const form = useForm<CompleteFormData>({
    resolver: zodResolver(completeFormSchema) as any,
    defaultValues: {
      brandIdentity: {
        projectName: '',
        slogan: '',
        logo: '',
        logoSize: 100,
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
      projectDetails: {
        additionalDetails: '',
      },
      aiProvider: {
        provider: 'none',
        model: undefined,
        temperature: 0.7,
        enhancePrompt: false,
      },
    },
  });

  const { watch } = form;

  // Update preview data when form changes
  useEffect(() => {
    const subscription = watch((value) => {
      updateFormData('brandIdentity', value.brandIdentity);
      updateFormData('colorPalette', value.colorPalette);
      updateFormData('images', value.images);
      updateFormData('designStructure', value.designStructure);
      updateFormData('technology', value.technology);
      updateFormData('projectDetails', value.projectDetails);
      updateFormData('aiProvider', value.aiProvider);
    });
    return () => subscription.unsubscribe();
  }, [watch, updateFormData]);

  // Keyboard shortcuts for card width adjustment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is not typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Shift + Arrow Right to increase card width
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowRight') {
        e.preventDefault();
        setCardMaxWidth((prev) => Math.min(prev + 50, 1200));
      }
      // Ctrl/Cmd + Shift + Arrow Left to decrease card width
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        setCardMaxWidth((prev) => Math.max(prev - 50, 600));
      }
      // Ctrl/Cmd + Shift + C to reset card width
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'c') {
        e.preventDefault();
        setCardMaxWidth(800);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const steps = [
    { title: 'Brand & Identity', component: <BrandIdentitySection form={form} onColorsExtracted={setSuggestedColors} /> },
    { title: 'Color Palette', component: <ColorPaletteSection form={form} suggestedColors={suggestedColors} /> },
    { title: 'Images & Placement', component: <ImagesSection form={form} /> },
    { title: 'Design Structure', component: <DesignStructureSection form={form} /> },
    { title: 'Technology', component: <TechnologySection form={form} /> },
    { title: 'Project Details', component: <ProjectDetailsSection form={form} /> },
    { title: 'AI Provider', component: <AIProviderSection form={form} /> },
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please sign in to save templates');
        return;
      }

      const { data, error } = await supabase
        .from('project_templates')
        .insert({
          name: values.brandIdentity.projectName || 'Untitled Project',
          form_data: values,
          user_id: user.id,
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

      // Show warning if AI enhancement failed
      if (data.warning) {
        console.warn(data.warning);
      }

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

  // Form width controls (percentage of available width)
  const handleFormWidthIncrease = () => {
    setFormWidth((prev) => Math.min(prev + 5, 85)); // Max 85%
  };

  const handleFormWidthDecrease = () => {
    setFormWidth((prev) => Math.max(prev - 5, 40)); // Min 40%
  };

  const handleFormWidthReset = () => {
    setFormWidth(40); // Reset to default 40% (60% preview)
  };

  const handleFormWidthChange = (value: number[]) => {
    setFormWidth(value[0]);
  };

  // Calculate preview width based on form width
  const previewWidth = 100 - formWidth;

  // Card max width controls
  const handleCardMaxWidthIncrease = () => {
    setCardMaxWidth((prev) => Math.min(prev + 50, 1200)); // Max 1200px
  };

  const handleCardMaxWidthDecrease = () => {
    setCardMaxWidth((prev) => Math.max(prev - 50, 600)); // Min 600px
  };

  const handleCardMaxWidthReset = () => {
    setCardMaxWidth(800); // Reset to default
  };

  const handleCardMaxWidthChange = (value: number[]) => {
    setCardMaxWidth(value[0]);
  };

  // Preset card widths
  const cardWidthPresets = [
    { label: 'Compact', value: 600 },
    { label: 'Normal', value: 800 },
    { label: 'Wide', value: 1000 },
    { label: 'Full', value: 1200 },
  ];

  if (generatedPrompt) {
    return (
      <div className="container mx-auto py-6 sm:py-8 max-w-4xl px-4 sm:px-6 page-transition">
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Your AI Prompt is Ready!</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Copy this prompt and use it with your favorite AI tool or IDE
            </p>
          </div>

          <div className="bg-muted p-4 sm:p-6 rounded-lg relative">
            <pre className="whitespace-pre-wrap text-xs sm:text-sm overflow-x-auto">{generatedPrompt}</pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button onClick={handleCopyPrompt} className="flex-1 active:scale-95">
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
            <Button variant="outline" onClick={handleExportJSON} className="active:scale-95">
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button variant="outline" onClick={handleExportPDF} className="active:scale-95">
              <FileDown className="mr-2 h-4 w-4" />
              PDF
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs sm:text-sm text-muted-foreground">Open in your favorite IDE:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button variant="secondary" onClick={handleOpenInCursor} className="active:scale-95">
                Cursor
              </Button>
              <Button variant="secondary" onClick={handleOpenInReplit} className="active:scale-95">
                Replit
              </Button>
              <Button variant="secondary" onClick={handleOpenInVSCode} className="active:scale-95">
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
            className="w-full active:scale-95"
          >
            Create Another Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 page-transition">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">AI Prompt Generator</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Create a detailed prompt for your next project
          </p>
        </div>
        <LoadTemplateDialog onLoad={handleLoadTemplate} />
      </div>

      <div className="mb-4 sm:mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex flex-col gap-3 sm:gap-2 mt-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          </p>
          {/* Layout Controls */}
          <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
            {/* Form Width Controls */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-dashed flex-wrap">
              <Label className="text-xs font-semibold whitespace-nowrap">Form: {Math.round(formWidth)}%</Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleFormWidthDecrease}
                  disabled={formWidth <= 40}
                  title="Decrease Form Width"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleFormWidthReset}
                                      title="Reset Form Width (40%)"
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleFormWidthIncrease}
                  disabled={formWidth >= 85}
                  title="Increase Form Width"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="w-20 sm:w-24">
                <Slider
                  value={[formWidth]}
                  onValueChange={handleFormWidthChange}
                  min={40}
                  max={85}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Card Max Width Controls */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border border-dashed flex-wrap">
              <Label className="text-xs font-semibold whitespace-nowrap">Cards: <span className="text-primary font-bold">{cardMaxWidth}px</span></Label>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleCardMaxWidthDecrease}
                  disabled={cardMaxWidth <= 600}
                  title="Decrease Card Width (-50px) [Ctrl/Cmd + Shift + ←]"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleCardMaxWidthReset}
                  title="Reset Card Width (800px) [Ctrl/Cmd + Shift + C]"
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={handleCardMaxWidthIncrease}
                  disabled={cardMaxWidth >= 1200}
                  title="Increase Card Width (+50px) [Ctrl/Cmd + Shift + →]"
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="w-20 sm:w-24">
                <Slider
                  value={[cardMaxWidth]}
                  onValueChange={handleCardMaxWidthChange}
                  min={600}
                  max={1200}
                  step={25}
                  className="w-full"
                />
              </div>
              {/* Preset Buttons */}
              <div className="flex items-center gap-1 flex-wrap">
                {cardWidthPresets.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={cardMaxWidth === preset.value ? 'default' : 'ghost'}
                    size="sm"
                    className="h-5 px-2 text-[10px]"
                    onClick={() => setCardMaxWidth(preset.value)}
                    title={`Set to ${preset.label} (${preset.value}px)`}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6 transition-all duration-300 w-full lg:flex-shrink-0" style={{ width: '100%', maxWidth: '100%' }}>
                            <Tabs value={currentStep.toString()} className="w-full">
                    <TabsList className="grid grid-cols-7 w-full overflow-x-auto">
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

        <div className="transition-all duration-300 w-full lg:w-auto lg:flex-1">
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

export default function FormPage() {
  return (
    <AuthGuard>
      <FormPageContent />
    </AuthGuard>
  );
}

