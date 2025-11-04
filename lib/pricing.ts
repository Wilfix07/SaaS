export type PlanId = 'free' | 'starter' | 'professional' | 'enterprise';
export type BillingPeriod = 'monthly' | 'annual';
export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired';

export interface PricingPlan {
  id: PlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    projects?: number;
    exports?: number;
    templates?: number;
  };
}

export const PRICING_PLANS: Record<PlanId, PricingPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our platform',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      '3 project templates',
      'Basic AI prompt generation',
      '1 export per project',
      'Community support',
      'Basic color extraction',
      'Standard preview devices',
    ],
    limits: {
      projects: 3,
      exports: 1,
      templates: 3,
    },
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    description: 'For individual creators and small projects',
    monthlyPrice: 9,
    annualPrice: 90,
    features: [
      '20 project templates',
      'Enhanced AI prompt generation',
      'Unlimited exports',
      'Email support',
      'Advanced color extraction',
      'All preview devices',
      'PDF & JSON exports',
      'Priority processing',
    ],
    limits: {
      projects: 20,
      exports: Infinity,
      templates: 20,
    },
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    description: 'For growing teams and agencies',
    monthlyPrice: 29,
    annualPrice: 290,
    features: [
      'Unlimited project templates',
      'Premium AI prompt generation',
      'All export formats',
      'Priority email support',
      'Advanced color analysis',
      'Custom device previews',
      'Team collaboration',
      'API access',
      'White-label exports',
      'Advanced analytics',
    ],
    limits: {
      projects: Infinity,
      exports: Infinity,
      templates: Infinity,
    },
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: 99,
    annualPrice: 990,
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee (99.9%)',
      'On-premise deployment options',
      'Custom AI model training',
      'Volume discounts',
      'Training & onboarding',
      'Custom contracts',
    ],
    limits: {
      projects: Infinity,
      exports: Infinity,
      templates: Infinity,
    },
  },
};

export const TRIAL_DAYS = 30;

export function getPlan(planId: PlanId): PricingPlan {
  return PRICING_PLANS[planId];
}

export function getPrice(planId: PlanId, billingPeriod: BillingPeriod): number {
  const plan = PRICING_PLANS[planId];
  return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
}

export function calculateTrialEndDate(startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + TRIAL_DAYS);
  return endDate;
}

export function isTrialActive(trialEndDate: Date | string): boolean {
  const endDate = typeof trialEndDate === 'string' ? new Date(trialEndDate) : trialEndDate;
  return endDate > new Date();
}

export function getDaysRemainingInTrial(trialEndDate: Date | string): number {
  const endDate = typeof trialEndDate === 'string' ? new Date(trialEndDate) : trialEndDate;
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateAnnualSavings(planId: PlanId): number {
  if (planId === 'free') return 0;
  const plan = PRICING_PLANS[planId];
  const monthlyTotal = plan.monthlyPrice * 12;
  return monthlyTotal - plan.annualPrice;
}

export function formatPrice(price: number, billingPeriod: BillingPeriod): string {
  if (price === 0) return 'Free';
  return `$${price}/${billingPeriod === 'monthly' ? 'mo' : 'yr'}`;
}
