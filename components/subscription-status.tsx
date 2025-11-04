'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { getUserSubscription, hasActiveTrial, getTrialDaysRemaining, hasAccess } from '@/lib/subscription';
import { SubscriptionBadge } from './subscription-badge';
import type { PlanId, SubscriptionStatus } from '@/lib/pricing';

export function SubscriptionStatus() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userSubscription = await getUserSubscription();
        setSubscription(userSubscription);
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user]);

  if (loading || !subscription) {
    return null;
  }

  return (
    <SubscriptionBadge
      planId={subscription.plan_id as PlanId}
      status={subscription.status as SubscriptionStatus}
      trialEndDate={subscription.trial_end_date}
    />
  );
}
