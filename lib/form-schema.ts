import { z } from 'zod';

// Brand & Identity Schema
export const brandIdentitySchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  slogan: z.string().optional(),
  logo: z.string().optional(), // URL or path to uploaded logo
  mission: z.string().min(10, 'Mission must be at least 10 characters'),
  objectives: z.string().min(10, 'Objectives must be at least 10 characters'),
});

// Color Palette Schema
export const colorPaletteSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  backgroundColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  textColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  bannerColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  footerColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
});

// Images & Placement Schema
export const imagesSchema = z.object({
  heroImage: z.string().optional(),
  bannerImage: z.string().optional(),
  featureImages: z.array(z.string()).optional(),
  aboutImage: z.string().optional(),
  ctaBackground: z.string().optional(),
  footerLogo: z.string().optional(),
});

// App Design & Structure Schema
export const designStructureSchema = z.object({
  projectType: z.enum(['Landing Page', 'Web App', 'SaaS Dashboard', 'Portfolio']),
  sectionsToInclude: z.array(z.string()).min(1, 'Select at least one section'),
  visualStyle: z.enum(['Modern', 'Minimalist', 'Corporate', 'Playful', 'Luxury']),
  preferredLayout: z.enum(['Single Page', 'Multi-section', 'Dashboard']),
  fontTypography: z.string().optional(),
  includeImageVideo: z.boolean().default(false),
});

// Technology & Functionality Schema
export const technologySchema = z.object({
  preferredTechnology: z.array(z.string()).min(1, 'Select at least one technology'),
  includeLoginSignup: z.boolean().default(false),
  includeDashboard: z.boolean().default(false),
  includeDatabase: z.boolean().default(false),
  mobileOptimization: z.boolean().default(true),
});

// Complete Form Schema
export const completeFormSchema = z.object({
  brandIdentity: brandIdentitySchema,
  colorPalette: colorPaletteSchema,
  images: imagesSchema,
  designStructure: designStructureSchema,
  technology: technologySchema,
});

export type BrandIdentityData = z.infer<typeof brandIdentitySchema>;
export type ColorPaletteData = z.infer<typeof colorPaletteSchema>;
export type ImagesData = z.infer<typeof imagesSchema>;
export type DesignStructureData = z.infer<typeof designStructureSchema>;
export type TechnologyData = z.infer<typeof technologySchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;

