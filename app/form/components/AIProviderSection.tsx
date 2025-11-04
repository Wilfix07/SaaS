'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Bot, Sparkles } from 'lucide-react';

interface AIProviderSectionProps {
  form: UseFormReturn<CompleteFormData>;
}

const aiProviders = [
  { 
    value: 'none', 
    label: 'None (Basic Template)', 
    description: 'Generate a basic structured prompt without AI enhancement',
    icon: '📝'
  },
  { 
    value: 'openai', 
    label: 'OpenAI GPT-4', 
    description: 'Enhanced prompts using OpenAI GPT-4 Turbo',
    icon: '🤖',
    models: ['gpt-4-turbo-preview', 'gpt-4', 'gpt-3.5-turbo']
  },
  { 
    value: 'anthropic', 
    label: 'Anthropic Claude', 
    description: 'Enhanced prompts using Claude 3.5 Sonnet',
    icon: '🧠',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229']
  },
  { 
    value: 'gemini', 
    label: 'Google Gemini', 
    description: 'Enhanced prompts using Google Gemini Pro',
    icon: '💎',
    models: ['gemini-pro', 'gemini-pro-vision']
  },
  { 
    value: 'groq', 
    label: 'Groq (Fast)', 
    description: 'Ultra-fast AI enhancement using Groq',
    icon: '⚡',
    models: ['llama-3.1-70b-versatile', 'mixtral-8x7b-32768']
  },
];

export function AIProviderSection({ form }: AIProviderSectionProps) {
  const { watch, setValue } = form;
  const selectedProvider = watch('aiProvider.provider') || 'none';
  const enhancePrompt = watch('aiProvider.enhancePrompt') ?? false;
  const selectedModel = watch('aiProvider.model');
  const temperature = watch('aiProvider.temperature') ?? 0.7;

  const currentProvider = aiProviders.find(p => p.value === selectedProvider);
  const availableModels = currentProvider?.models || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Prompt Generation
        </CardTitle>
        <CardDescription>
          Choose an AI provider to enhance your project specification prompt
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="aiProvider">AI Provider *</Label>
          <Select
            value={selectedProvider}
            onValueChange={(value: any) => {
              setValue('aiProvider.provider', value);
              setValue('aiProvider.enhancePrompt', value !== 'none');
              // Set default model for the provider
              const provider = aiProviders.find(p => p.value === value);
              if (provider?.models?.[0]) {
                setValue('aiProvider.model', provider.models[0]);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              {aiProviders.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  <div className="flex items-center gap-2">
                    <span>{provider.icon}</span>
                    <div>
                      <div className="font-medium">{provider.label}</div>
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.aiProvider?.provider && (
            <p className="text-sm text-red-500">
              {form.formState.errors.aiProvider.provider.message}
            </p>
          )}
        </div>

        {selectedProvider !== 'none' && (
          <>
            {availableModels.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="aiModel">Model</Label>
                <Select
                  value={selectedModel || availableModels[0]}
                  onValueChange={(value) => setValue('aiProvider.model', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="temperature">
                Temperature: {temperature.toFixed(1)}
              </Label>
              <Input
                id="temperature"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setValue('aiProvider.temperature', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Controls randomness. Lower values make output more focused and deterministic.
              </p>
            </div>

            <div className="flex items-center space-x-2 p-4 bg-muted rounded-lg">
              <Switch
                id="enhancePrompt"
                checked={enhancePrompt}
                onCheckedChange={(checked) => setValue('aiProvider.enhancePrompt', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="enhancePrompt" className="cursor-pointer">
                  Enhance Prompt with AI
                </Label>
                <p className="text-xs text-muted-foreground">
                  Use AI to expand and refine your project specification for better results
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    AI Enhancement
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    The AI will analyze your project requirements and generate an enhanced, 
                    detailed specification that includes additional technical insights, 
                    best practices, and implementation recommendations.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedProvider === 'none' && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              A basic structured prompt will be generated from your form data without AI enhancement. 
              Select an AI provider above to get enhanced, AI-powered specifications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
