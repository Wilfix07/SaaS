import { supabase } from './supabase';
import { calculateTrialEndDate, isTrialActive, type PlanId } from './pricing';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: PlanId;
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  billing_period: 'monthly' | 'annual';
  trial_start_date: string | null;
  trial_end_date: string | null;
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get the current user's subscription
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserSubscription;
}

/**
 * Create a default 30-day trial subscription for a new user
 * This ensures every customer gets 30 days before choosing a plan
 */
export async function createDefaultTrialSubscription(userId: string, preferredPlanId?: PlanId): Promise<UserSubscription | null> {
  const trialEndDate = calculateTrialEndDate();
  
  // All new users start with a trial, using 'free' as the default plan
  // They can upgrade to any plan after the trial
  const planId = preferredPlanId || 'free';

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_id: planId,
      status: 'trial',
      billing_period: 'monthly',
      trial_start_date: new Date().toISOString(),
      trial_end_date: trialEndDate.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create trial subscription:', error);
    return null;
  }

  return data as UserSubscription;
}

/**
 * Check if the user has an active trial
 */
export function hasActiveTrial(subscription: UserSubscription | null): boolean {
  if (!subscription || subscription.status !== 'trial') {
    return false;
  }

  if (!subscription.trial_end_date) {
    return false;
  }

  return isTrialActive(subscription.trial_end_date);
}

/**
 * Check if the user has access (either active trial or active subscription)
 */
export function hasAccess(subscription: UserSubscription | null): boolean {
  if (!subscription) {
    return false;
  }

  // Active subscription
  if (subscription.status === 'active') {
    // Check if subscription hasn't expired
    if (subscription.subscription_end_date) {
      return new Date(subscription.subscription_end_date) > new Date();
    }
    return true;
  }

  // Active trial
  return hasActiveTrial(subscription);
}

/**
 * Get the days remaining in the trial
 */
export function getTrialDaysRemaining(subscription: UserSubscription | null): number {
  if (!subscription || !subscription.trial_end_date) {
    return 0;
  }

  const endDate = new Date(subscription.trial_end_date);
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}
