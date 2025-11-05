import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ResponsiveNav } from '@/components/responsive-nav';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Prompt Generator',
  description: 'Transform your ideas into detailed project specifications with AI',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Prompt Generator',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Prompt" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
<<<<<<< HEAD
          <ResponsiveNav />
          <main className="min-h-[calc(100vh-4rem)] pb-16 md:pb-0 pt-14 md:pt-0">
=======
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
>>>>>>> 0a840a2f8d0c5ebf230be2621532c7995a953914
            {children}
          </main>
          <footer className="border-t bg-muted/50 mt-auto">
            <div className="container mx-auto px-4 py-6 md:py-8">
              <div className="text-center text-sm text-muted-foreground">
                <p>&copy; 2025 AI Prompt Generator. Built with Next.js, Supabase, and AI.</p>
              </div>
            </div>
          </footer>
        </ThemeProvider>
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('SW registered: ', registration);
                  })
                  .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
