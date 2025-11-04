'use client';

import { UseFormReturn } from 'react-hook-form';
import { CompleteFormData } from '@/lib/form-schema';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, FileText, Sparkles } from 'lucide-react';

interface ProjectDetailsSectionProps {
  form: UseFormReturn<CompleteFormData>;
}

const exampleDetails = [
  "The app should focus on user onboarding and have a simple, intuitive interface for first-time users.",
  "I need specific integrations with payment gateways (Stripe, PayPal) and email services (SendGrid).",
  "The dashboard should have real-time analytics and data visualization with charts and graphs.",
  "The design should be accessible and follow WCAG 2.1 AA standards for compliance.",
  "I want to implement a specific workflow where users can create projects, invite team members, and track progress in real-time.",
];

export function ProjectDetailsSection({ form }: ProjectDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Additional Project Details
        </CardTitle>
        <CardDescription>
          Provide any additional context, specific requirements, or details that will help the AI generate a more accurate and tailored project specification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="additionalDetails" className="text-base">
            Project Details & Context
          </Label>
          <Textarea
            id="additionalDetails"
            placeholder="Describe any specific requirements, integrations, workflows, user flows, technical constraints, accessibility needs, or other details that weren't covered in the previous sections. This information will help the AI create a more comprehensive and accurate project specification.

Examples:
• Specific integrations you need (payment gateways, APIs, third-party services)
• Unique user flows or workflows
• Technical constraints or requirements
• Accessibility or compliance needs
• Performance requirements
• Security considerations
• Any specific features or functionality not covered above"
            rows={12}
            className="resize-none"
            {...form.register('projectDetails.additionalDetails')}
          />
          <p className="text-xs text-muted-foreground">
            This field is optional but highly recommended. The more details you provide, the better the AI can tailor your project specification.
          </p>
        </div>

        {/* Examples Section */}
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg border border-dashed">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <Label className="text-sm font-semibold">Example Details:</Label>
          </div>
          <div className="space-y-2">
            {exampleDetails.map((example, index) => (
              <div
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <FileText className="h-3 w-3 mt-1 flex-shrink-0" />
                <p className="flex-1">{example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                💡 Tips for Better Results
              </p>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                <li>Be specific about integrations, APIs, or third-party services you need</li>
                <li>Describe your target users and their primary use cases</li>
                <li>Mention any compliance or accessibility requirements</li>
                <li>Include performance expectations or technical constraints</li>
                <li>Specify any unique features or workflows not covered in the form</li>
                <li>Detail security requirements or authentication needs</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
