'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { getDaysRemainingInTrial, isTrialActive, type PlanId, type SubscriptionStatus } from '@/lib/pricing';
import { useEffect, useState } from 'react';

interface SubscriptionBadgeProps {
  planId: PlanId;
  status: SubscriptionStatus;
  trialEndDate?: string | Date;
  className?: string;
}

export function SubscriptionBadge({
  planId,
  status,
  trialEndDate,
  className = '',
}: SubscriptionBadgeProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (trialEndDate && status === 'trial') {
      const days = getDaysRemainingInTrial(trialEndDate);
      setDaysRemaining(days);
      
      // Update every hour
      const interval = setInterval(() => {
        const updatedDays = getDaysRemainingInTrial(trialEndDate);
        setDaysRemaining(updatedDays);
      }, 3600000); // 1 hour

      return () => clearInterval(interval);
    }
  }, [trialEndDate, status]);

  if (status === 'trial' && trialEndDate) {
    const active = isTrialActive(trialEndDate);
    
    if (!active) {
      return (
        <Card className={`p-3 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 ${className}`}>
          <div className="flex items-center gap-2 text-orange-900 dark:text-orange-100">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Trial expired</span>
          </div>
        </Card>
      );
    }

    return (
      <Card className={`p-3 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Sparkles className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">Free Trial Active</p>
              {daysRemaining !== null && (
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300">
            {planId.charAt(0).toUpperCase() + planId.slice(1)} Plan
          </Badge>
        </div>
      </Card>
    );
  }

  if (status === 'active') {
    return (
      <Card className={`p-3 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 ${className}`}>
        <div className="flex items-center gap-2 text-green-900 dark:text-green-100">
          <CheckCircle2 className="h-4 w-4" />
          <div>
            <p className="text-sm font-medium">Subscription Active</p>
            <Badge variant="outline" className="mt-1 border-green-300 text-green-700 dark:border-green-700 dark:text-green-300">
              {planId.charAt(0).toUpperCase() + planId.slice(1)} Plan
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
