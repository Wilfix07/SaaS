import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { AuthNav } from '@/components/auth-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Prompt Generator',
  description: 'Transform your ideas into detailed project specifications with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg md:text-xl">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="hidden xs:inline">AI Prompt Generator</span>
                <span className="xs:hidden">AI Prompt</span>
              </Link>
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
                <Link href="/" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden sm:inline">
                  Home
                </Link>
                <Link href="/pricing" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors">
                  Pricing
                </Link>
                <Link href="/form" className="text-xs sm:text-sm font-medium hover:text-primary transition-colors hidden md:inline">
                  Create Project
                </Link>
                <ThemeToggle />
                <AuthNav />
              </div>
            </div>
          </nav>
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <footer className="border-t bg-muted/50">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p>&copy; 2025 AI Prompt Generator. Built with Next.js, Supabase, and AI.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
