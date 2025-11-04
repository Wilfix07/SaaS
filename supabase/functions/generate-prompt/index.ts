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
    const prompt = generatePromptFromFormData(formData);

    // Optional: Use OpenAI to enhance the prompt
    // Uncomment and configure if you want AI enhancement
    /*
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiApiKey) {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4-turbo-preview',
          messages: [
            {
              role: 'system',
              content: 'You are a technical specification writer. Enhance and expand the following project specification while maintaining all the provided details and requirements.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      const enhancedPrompt = data.choices[0].message.content;
      
      return new Response(
        JSON.stringify({ prompt: enhancedPrompt }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    */

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

