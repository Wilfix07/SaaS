import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Palette, Image, Code, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Content */}
      <div>
        <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              AI-Powered Project Generator
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Build Your Perfect SaaS
              <br />
              <span className="text-primary">In Minutes</span>
          </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your ideas into detailed project specifications with our interactive form. Get AI-generated prompts ready for development.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 min-w-[160px]">
                Start Creating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="gap-2 border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 min-w-[160px]">
                View Pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            <div className="p-6 rounded-lg border bg-card/95 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 space-y-3 group hover:border-primary/50">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Palette className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Brand Identity</h3>
              <p className="text-sm text-muted-foreground">
                Define your brand with colors, logos, and mission
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
          <div className="mt-20 space-y-8">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3 p-6 rounded-lg bg-card/50 backdrop-blur-sm border hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl shadow-lg">
                  1
                </div>
                <h3 className="font-semibold text-lg">Fill the Form</h3>
                <p className="text-sm text-muted-foreground">
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
            <div className="flex justify-center pt-8">
              <Link href="/auth/signup">
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-black text-white hover:bg-black/90 min-w-[200px]">
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
