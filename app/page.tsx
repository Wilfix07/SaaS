import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Palette, Image, Code, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen page-transition">
      {/* Content */}
      <div>
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="space-y-3 sm:space-y-4 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              AI-Powered Project Generator
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight px-4 sm:px-0">
              Build Your Perfect Project
              <br />
              <span className="text-primary">In Minutes</span>
          </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Transform your ideas into detailed project specifications with our interactive form. Get AI-generated prompts ready for development.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0 animate-slide-up">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 w-full sm:min-w-[160px] active:scale-95">
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 w-full sm:min-w-[160px] active:scale-95">
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0">
            <div className="p-4 sm:p-6 rounded-lg border bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 space-y-3 group hover:border-primary/50 animate-scale-in">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Brand Identity</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Define your brand with colors, logos, and mission
              </p>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-black text-white hover:bg-black/90 border-black transition-colors active:scale-95">
                  Get Started
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-lg border bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 space-y-3 group hover:border-primary/50">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Image Management</h3>
              <p className="text-sm text-muted-foreground">
                Upload and organize all your project assets
              </p>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-black text-white hover:bg-black/90 border-black transition-colors">
                  Get Started
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-lg border bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 space-y-3 group hover:border-primary/50">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Tech Stack</h3>
              <p className="text-sm text-muted-foreground">
                Choose your preferred technologies and frameworks
              </p>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-black text-white hover:bg-black/90 border-black transition-colors">
                  Get Started
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="p-6 rounded-lg border bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 space-y-3 group hover:border-primary/50">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">AI Generation</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed prompts powered by GPT-4
              </p>
              <Link href="/auth/signup">
                <Button variant="outline" size="sm" className="w-full mt-4 bg-black text-white hover:bg-black/90 border-black transition-colors">
                  Get Started
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 sm:mt-16 md:mt-20 space-y-6 sm:space-y-8 px-4 sm:px-0">
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="space-y-3 p-4 sm:p-6 rounded-lg bg-card/50 backdrop-blur-sm border hover:shadow-md transition-all animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="font-semibold text-base sm:text-lg">Fill the Form</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Complete our interactive form with your project details, branding, and requirements
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl shadow-lg">
                  2
                </div>
                <h3 className="font-semibold text-lg">Preview & Refine</h3>
                <p className="text-sm text-muted-foreground">
                  See a live preview of your design and make adjustments in real-time
                </p>
              </div>

              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl shadow-lg">
                  3
                </div>
                <h3 className="font-semibold text-lg">Generate & Export</h3>
                <p className="text-sm text-muted-foreground">
                  Get your AI-generated prompt and export to JSON, PDF, or your favorite IDE
          </p>
        </div>
            </div>
            <div className="flex justify-center pt-6 sm:pt-8 px-4 sm:px-0">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 w-full sm:min-w-[200px] active:scale-95">
                  Start Your Project Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
