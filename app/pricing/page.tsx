'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Sparkles, Zap, Crown, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type BillingPeriod = 'monthly' | 'annual';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
  cta: string;
  limit?: string;
}

const plans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out our platform',
    icon: <Sparkles className="h-6 w-6" />,
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
    cta: 'Get Started',
    limit: '3 projects',
  },
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individual creators and small projects',
    icon: <Zap className="h-6 w-6" />,
    monthlyPrice: 5,
    annualPrice: 50,
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
    popular: true,
    cta: 'Get Started',
    limit: '20 projects/month',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing teams and agencies',
    icon: <Crown className="h-6 w-6" />,
    monthlyPrice: 10,
    annualPrice: 100,
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
    cta: 'Get Started',
    limit: 'Unlimited',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    icon: <Rocket className="h-6 w-6" />,
    monthlyPrice: 20,
    annualPrice: 200,
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
    cta: 'Contact Sales',
    limit: 'Custom',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const getPrice = (plan: PricingPlan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
  };

  const getAnnualSavings = (plan: PricingPlan) => {
    if (plan.monthlyPrice === 0) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    return monthlyTotal - plan.annualPrice;
  };

  const handleSelectPlan = (planId: string) => {
    // Save selected plan to localStorage
    localStorage.setItem('selectedPlan', planId);
    // Redirect to signup page
    window.location.href = '/auth/signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted py-8 sm:py-12 md:py-16 page-transition">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            Choose Your Plan
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight px-4 sm:px-0">
            Pricing Plans
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
            Select the perfect plan for your needs. Cancel anytime.
          </p>

          {/* Billing Period Toggle */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <span className={`text-xs sm:text-sm font-medium ${billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
              aria-label="Toggle billing period"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs sm:text-sm font-medium ${billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            {billingPeriod === 'annual' && (
              <span className="px-2 py-1 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded">
                Save up to 17%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const savings = getAnnualSavings(plan);
            const isFree = plan.id === 'free';

            return (
              <Card
                key={plan.id}
                className={`relative transition-all duration-300 animate-scale-in ${
                  plan.popular
                    ? 'border-primary shadow-lg md:scale-105 lg:scale-105'
                    : 'hover:shadow-lg'
                } ${hoveredPlan === plan.id ? 'shadow-xl scale-105' : ''}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary">
                      {plan.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                      {plan.limit && (
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{plan.limit}</p>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs sm:text-sm">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold">
                        ${price}
                      </span>
                      {!isFree && (
                        <span className="text-sm sm:text-base text-muted-foreground">
                          /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    {billingPeriod === 'annual' && savings > 0 && (
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">
                        Save ${savings}/year
                      </p>
                    )}
                    {!isFree && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                        Billed {billingPeriod === 'annual' ? 'annually' : 'monthly'}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="p-4 sm:p-6 pt-0">
                  {plan.cta === 'Contact Sales' ? (
                    <Button
                      className="w-full bg-black text-white hover:bg-black/90 active:scale-95"
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                      asChild
                    >
                      <Link href="/contact">{plan.cta}</Link>
                    </Button>
                  ) : (
                    <Button
                      className="w-full active:scale-95"
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSelectPlan(plan.id)}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  )}
                </CardFooter>


              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I change plans later?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges or credits.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We offer a 30-day money-back guarantee on all paid plans. If you're not satisfied, contact us within 30 days for a full refund.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16 px-4 sm:px-0">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            Need help choosing a plan? Contact our sales team.
          </p>
          <Button variant="outline" size="lg" className="bg-black text-white hover:bg-black/90 border-black active:scale-95 w-full sm:w-auto" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
