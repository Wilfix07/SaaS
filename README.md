# AI Prompt Generator

Transform your ideas into detailed project specifications with our interactive form and AI-powered prompt generation.

## Features

✨ **Interactive Multi-Step Form**
- 5 comprehensive sections for complete project specification
- Real-time form validation with Zod schemas
- Auto-save drafts to localStorage

🎨 **Brand Identity Management**
- Upload logos with automatic color extraction
- Define mission and objectives
- Suggested color palettes from your brand assets

🖼️ **Image Upload & Management**
- Supabase Storage integration
- Support for multiple image types (Hero, Banner, Features, etc.)
- Real-time image previews

🎨 **Advanced Color Picker**
- Interactive color picker with hex input
- Preview colors in real-time
- Apply suggested colors from logo

👁️ **Live Preview**
- Real-time preview of your design
- See how colors and images work together
- Mock page layout preview

💾 **Save & Load Templates**
- Save project templates to Supabase
- Load and continue previous projects
- Delete unwanted templates

📤 **Export Options**
- Export to JSON format
- Generate PDF specifications
- Copy to clipboard

🚀 **IDE Integration**
- One-click integration with Cursor
- Open in Replit
- Launch in VS Code

🤖 **AI-Powered Prompt Generation**
- Supabase Edge Function with OpenAI integration
- Generates comprehensive project specifications
- Ready-to-use prompts for development

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **Styling:** TailwindCSS 4
- **UI Components:** Shadcn UI
- **Form Management:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Edge Functions:** Supabase Edge Functions (Deno)
- **Animations:** Framer Motion
- **Color Picker:** react-colorful
- **PDF Export:** jsPDF

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-prompt-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app
  /(main)
    /form
      page.tsx                    # Main form page
      /components
        BrandIdentitySection.tsx  # Section 1: Brand identity
        ColorPaletteSection.tsx   # Section 2: Color palette
        ImagesSection.tsx         # Section 3: Images
        DesignStructureSection.tsx # Section 4: Design structure
        TechnologySection.tsx     # Section 5: Technology
        FormPreview.tsx           # Live preview component
        FormNavigation.tsx        # Navigation controls
        LoadTemplateDialog.tsx    # Load saved templates
    /api
      /templates
        route.ts                  # Templates API endpoints
  /components
    /ui                           # Shadcn components
  /lib
    supabase.ts                   # Supabase client
    form-schema.ts                # Zod validation schemas
    storage.ts                    # File upload utilities
    export-pdf.ts                 # PDF export functionality
  /hooks
    useFormPreview.ts             # Preview state management
    useColorExtraction.ts         # Logo color extraction
/supabase
  /functions
    /generate-prompt
      index.ts                    # Edge function for OpenAI
```

## Database Schema

### project_templates
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)
- `user_id` (UUID, nullable)
- `form_data` (JSONB)

### project_submissions
- `id` (UUID, Primary Key)
- `submitted_at` (TIMESTAMPTZ)
- `prompt_generated` (TEXT)
- `prompt_text` (TEXT)
- `form_data` (JSONB)

## Storage Buckets

- `project-images` - General project images (10MB limit)
- `project-logos` - Logo files (5MB limit)

## Edge Functions

### generate-prompt

Generates AI prompts from form data. Can be enhanced with OpenAI integration.

**Endpoint:** `https://your-project.supabase.co/functions/v1/generate-prompt`

**Request:**
```json
{
  "formData": {
    "brandIdentity": {...},
    "colorPalette": {...},
    "images": {...},
    "designStructure": {...},
    "technology": {...}
  }
}
```

**Response:**
```json
{
  "prompt": "# Project Specification: Your Project..."
}
```

## Features in Detail

### 1. Brand & Identity
- Project name and slogan
- Logo upload with color extraction
- Mission and objectives definition

### 2. Color Palette
- Six customizable colors (Primary, Secondary, Background, Text, Banner, Footer)
- Interactive color picker
- Suggested colors from uploaded logo
- Real-time color preview

### 3. Images & Placement
- Hero section image
- Banner image
- Multiple feature images
- About section image
- CTA background
- Footer logo

### 4. Design Structure
- Project type selection
- Multiple section selection
- Visual style options
- Layout preferences
- Typography settings

### 5. Technology Stack
- Multi-select technology choices
- Feature toggles (Auth, Dashboard, Database)
- Mobile optimization option

## Usage

1. **Start a New Project:** Navigate to the form page
2. **Fill in Details:** Complete all 5 sections with your project information
3. **Upload Assets:** Add your logo and images
4. **Preview Design:** Watch your design come together in real-time
5. **Save Template:** Save your progress for later
6. **Generate Prompt:** Click to generate your AI prompt
7. **Export:** Download as JSON or PDF, or open in your favorite IDE

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Deployment

### Deploy to Vercel

This project is optimized for deployment on Vercel. For detailed deployment instructions, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).

**Quick Deploy:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository on [Vercel](https://vercel.com/new)
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

The project includes:
- ✅ `vercel.json` configuration file
- ✅ Optimized `next.config.ts` for Vercel
- ✅ Environment variable templates (`.env.example`)

## Support

For issues and questions, please open an issue on GitHub.
