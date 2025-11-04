// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FormData {
  brandIdentity: {
    projectName: string;
    slogan?: string;
    logo?: string;
    mission: string;
    objectives: string;
  };
  colorPalette: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    bannerColor: string;
    footerColor: string;
  };
  images: {
    heroImage?: string;
    bannerImage?: string;
    featureImages?: string[];
    aboutImage?: string;
    ctaBackground?: string;
    footerLogo?: string;
  };
  designStructure: {
    projectType: string;
    sectionsToInclude: string[];
    visualStyle: string;
    preferredLayout: string;
    fontTypography?: string;
    includeImageVideo: boolean;
  };
  technology: {
    preferredTechnology: string[];
    includeLoginSignup: boolean;
    includeDashboard: boolean;
    includeDatabase: boolean;
    mobileOptimization: boolean;
  };
  aiProvider: {
    provider: 'none' | 'openai' | 'anthropic' | 'gemini' | 'groq';
    model?: string;
    temperature?: number;
    enhancePrompt?: boolean;
  };
}

function generatePromptFromFormData(formData: FormData): string {
  const { brandIdentity, colorPalette, images, designStructure, technology } = formData;

  let prompt = `# Project Specification: ${brandIdentity.projectName}\n\n`;

  // Brand & Identity
  prompt += `## Brand Identity\n\n`;
  prompt += `**Project Name:** ${brandIdentity.projectName}\n`;
  if (brandIdentity.slogan) {
    prompt += `**Slogan:** "${brandIdentity.slogan}"\n`;
  }
  if (brandIdentity.logo) {
    prompt += `**Logo:** ${brandIdentity.logo}\n`;
  }
  prompt += `\n**Mission:**\n${brandIdentity.mission}\n\n`;
  prompt += `**Objectives:**\n${brandIdentity.objectives}\n\n`;

  // Color Palette
  prompt += `## Color Palette\n\n`;
  prompt += `The application should use the following color scheme:\n\n`;
  prompt += `- **Primary Color:** ${colorPalette.primaryColor} (for buttons, links, and primary accents)\n`;
  prompt += `- **Secondary Color:** ${colorPalette.secondaryColor} (for secondary elements and hover states)\n`;
  prompt += `- **Background Color:** ${colorPalette.backgroundColor} (general page background)\n`;
  prompt += `- **Text Color:** ${colorPalette.textColor} (primary text throughout the app)\n`;
  prompt += `- **Banner/Header Color:** ${colorPalette.bannerColor} (hero section background)\n`;
  prompt += `- **Footer Color:** ${colorPalette.footerColor} (footer section background)\n\n`;

  // Images & Assets
  if (Object.values(images).some(img => img && (Array.isArray(img) ? img.length > 0 : true))) {
    prompt += `## Images & Assets\n\n`;
    if (images.heroImage) {
      prompt += `- **Hero Section Image:** ${images.heroImage}\n`;
    }
    if (images.bannerImage) {
      prompt += `- **Banner Image:** ${images.bannerImage}\n`;
    }
    if (images.featureImages && images.featureImages.length > 0) {
      prompt += `- **Feature Section Images:** ${images.featureImages.length} images\n`;
      images.featureImages.forEach((img, i) => {
        prompt += `  - Feature ${i + 1}: ${img}\n`;
      });
    }
    if (images.aboutImage) {
      prompt += `- **About Section Image:** ${images.aboutImage}\n`;
    }
    if (images.ctaBackground) {
      prompt += `- **CTA Background Image:** ${images.ctaBackground}\n`;
    }
    if (images.footerLogo) {
      prompt += `- **Footer Logo:** ${images.footerLogo}\n`;
    }
    prompt += `\n`;
  }

  // Design Structure
  prompt += `## Design & Structure\n\n`;
  prompt += `**Project Type:** ${designStructure.projectType}\n`;
  prompt += `**Visual Style:** ${designStructure.visualStyle}\n`;
  prompt += `**Layout:** ${designStructure.preferredLayout}\n`;
  if (designStructure.fontTypography) {
    prompt += `**Typography:** ${designStructure.fontTypography}\n`;
  }
  prompt += `**Include Image/Video Elements:** ${designStructure.includeImageVideo ? 'Yes' : 'No'}\n\n`;
  
  prompt += `**Sections to Include:**\n`;
  designStructure.sectionsToInclude.forEach(section => {
    prompt += `- ${section}\n`;
  });
  prompt += `\n`;

  // Technology Stack
  prompt += `## Technology Stack\n\n`;
  prompt += `**Preferred Technologies:**\n`;
  technology.preferredTechnology.forEach(tech => {
    prompt += `- ${tech}\n`;
  });
  prompt += `\n`;

  // Features & Functionality
  prompt += `## Features & Functionality\n\n`;
  const features = [];
  if (technology.includeLoginSignup) features.push('User Authentication (Login/Signup)');
  if (technology.includeDashboard) features.push('User Dashboard with Data Visualization');
  if (technology.includeDatabase) features.push('Database Integration for Data Persistence');
  if (technology.mobileOptimization) features.push('Mobile-Responsive Design');

  if (features.length > 0) {
    features.forEach(feature => {
      prompt += `- ${feature}\n`;
    });
  } else {
    prompt += `- Basic static website functionality\n`;
  }
  prompt += `\n`;

  // Implementation Guidelines
  prompt += `## Implementation Guidelines\n\n`;
  prompt += `Create a ${designStructure.visualStyle.toLowerCase()} ${designStructure.projectType.toLowerCase()} `;
  prompt += `using ${technology.preferredTechnology.join(', ')}. `;
  prompt += `The design should follow a ${designStructure.preferredLayout.toLowerCase()} layout structure.\n\n`;
  
  prompt += `### Key Requirements:\n`;
  prompt += `1. Implement all specified sections: ${designStructure.sectionsToInclude.join(', ')}\n`;
  prompt += `2. Use the exact color palette provided throughout the application\n`;
  prompt += `3. Ensure the design is ${technology.mobileOptimization ? 'fully responsive and mobile-optimized' : 'desktop-focused'}\n`;
  prompt += `4. Follow ${designStructure.visualStyle.toLowerCase()} design principles\n`;
  if (designStructure.fontTypography) {
    prompt += `5. Use ${designStructure.fontTypography} as the primary font family\n`;
  }
  
  prompt += `\n### Technical Implementation:\n`;
  prompt += `- Set up the project with ${technology.preferredTechnology[0] || 'Next.js'}\n`;
  prompt += `- Implement proper component structure and code organization\n`;
  prompt += `- Use TypeScript for type safety\n`;
  if (technology.includeDatabase) {
    prompt += `- Set up database schema and connections\n`;
  }
  if (technology.includeLoginSignup) {
    prompt += `- Implement secure authentication flow\n`;
  }
  if (technology.includeDashboard) {
    prompt += `- Create interactive dashboard with data visualization components\n`;
  }
  
  prompt += `\n### Design Implementation:\n`;
  prompt += `- Apply the color palette consistently across all components\n`;
  prompt += `- Implement smooth transitions and animations for better UX\n`;
  prompt += `- Ensure accessibility standards (WCAG 2.1) are met\n`;
  prompt += `- Optimize images and assets for web performance\n`;
  
  prompt += `\n---\n\n`;
  prompt += `This specification provides a complete blueprint for building "${brandIdentity.projectName}". `;
  prompt += `Follow these guidelines to create a cohesive, professional application that meets all stated objectives.`;

  return prompt;
}

async function enhancePromptWithAI(
  prompt: string,
  provider: string,
  model?: string,
  temperature: number = 0.7
): Promise<string> {
  const systemPrompt = 'You are a technical specification writer. Enhance and expand the following project specification while maintaining all the provided details and requirements. Add technical insights, best practices, and implementation recommendations.';

  switch (provider) {
    case 'openai': {
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'gpt-4-turbo-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    case 'anthropic': {
      const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
      if (!apiKey) {
        throw new Error('Anthropic API key not configured');
      }

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          temperature,
          system: systemPrompt,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.content[0].text;
    }

    case 'gemini': {
      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const modelName = model || 'gemini-pro';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\n${prompt}`
              }]
            }],
            generationConfig: {
              temperature,
              maxOutputTokens: 4000,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }

    case 'groq': {
      const apiKey = Deno.env.get('GROQ_API_KEY');
      if (!apiKey) {
        throw new Error('Groq API key not configured');
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model || 'llama-3.1-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    default:
      return prompt;
  }
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json();

    if (!formData) {
      throw new Error('Form data is required');
    }

    // Generate the structured prompt
    let prompt = generatePromptFromFormData(formData);

    // Enhance prompt with AI if provider is selected and enhancement is enabled
    const aiProvider = formData.aiProvider || { provider: 'none', enhancePrompt: false };
    
    if (
      aiProvider.provider !== 'none' && 
      aiProvider.enhancePrompt !== false
    ) {
      try {
        prompt = await enhancePromptWithAI(
          prompt,
          aiProvider.provider,
          aiProvider.model,
          aiProvider.temperature || 0.7
        );
      } catch (error: any) {
        console.error('AI enhancement error:', error);
        // Return the basic prompt if AI enhancement fails
        // Don't fail the entire request, just log the error
        return new Response(
          JSON.stringify({ 
            prompt,
            warning: `AI enhancement failed: ${error.message}. Returning basic prompt.`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ prompt }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

