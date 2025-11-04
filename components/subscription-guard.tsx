'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getUserSubscription, hasAccess } from '@/lib/subscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SubscriptionGuard({ children, fallback }: SubscriptionGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccessStatus, setHasAccessStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userSubscription = await getUserSubscription();
        setSubscription(userSubscription);
        
        if (userSubscription) {
          const access = hasAccess(userSubscription);
          setHasAccessStatus(access);
          
          // If trial expired, show message but don't block immediately
          // Give them a chance to upgrade
          if (!access && userSubscription.status === 'trial') {
            // Trial expired - will show upgrade message
          }
        } else {
          // No subscription found - should not happen if signup worked correctly
          // But we'll allow access for now
          setHasAccessStatus(true);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        // On error, allow access (fail open)
        setHasAccessStatus(true);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading && user) {
      checkSubscription();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // If no user, don't render (AuthGuard should handle this)
  if (!user) {
    return null;
  }

  // If subscription expired, show upgrade prompt
  if (subscription && !hasAccessStatus && subscription.status === 'trial') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-12">
        <Card className="w-full max-w-md">
          <div className="p-6 space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Your 30-Day Trial Has Ended</h2>
              <p className="text-muted-foreground">
                Thank you for trying our service! To continue using all features, please choose a plan.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full bg-black text-white hover:bg-black/90">
                <Link href="/pricing">Choose a Plan</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // User has access (active trial or subscription)
  return <>{children}</>;
}
