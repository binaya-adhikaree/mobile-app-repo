export type Role = 'admin' | 'staff' | 'client' | string;

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: Role;
  is_staff?: boolean;
  is_active?: boolean;
}

export interface AuthTokens { access: string; refresh: string }

export interface Document {
  id: number;
  title: string;
  section?: string;
  file_url?: string;
  uploaded_at?: string;
  uploaded_by?: number;
}

export interface FormItem {
  id: number;
  title: string;
  description?: string;
  fields?: Array<{ name: string; label: string; type: string; required?: boolean; options?: string[] }>;
}

export interface FormSubmission {
  id: number;
  form: number;
  data: Record<string, unknown>;
  submitted_at?: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  interval?: string;
  stripe_price_id?: string;
  features?: string[];
}

export interface Subscription {
  id: number;
  plan: number | SubscriptionPlan;
  status: string;
  current_period_end?: string;
}
