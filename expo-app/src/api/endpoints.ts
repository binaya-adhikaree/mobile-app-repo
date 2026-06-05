import { api } from './client';
import type { AuthTokens, Document, FormItem, FormSubmission, SubscriptionPlan, Subscription, User } from '@/types';

export const AuthAPI = {
  async login(email: string, password: string) {
    const { data } = await api.post<AuthTokens>('token/', { email, password });
    return data;
  },
  async register(payload: { email: string; password: string; first_name?: string; last_name?: string }) {
    const { data } = await api.post('register/', payload);
    return data;
  },
  async me() {
    const { data } = await api.get<User>('me/');
    return data;
  },
  async requestPasswordReset(email: string) {
    return api.post('password-reset/', { email });
  },
  async confirmPasswordReset(payload: { uid: string; token: string; new_password: string }) {
    return api.post('password-reset/confirm/', payload);
  },
};

export const DocumentsAPI = {
  async list(params?: { section?: string; search?: string }) {
    const { data } = await api.get<Document[] | { results: Document[] }>('documents/', { params });
    return Array.isArray(data) ? data : data.results;
  },
  async retrieve(id: number) {
    const { data } = await api.get<Document>(`documents/${id}/`);
    return data;
  },
  async create(payload: { title: string; section?: string; file_url: string }) {
    const { data } = await api.post<Document>('documents/', payload);
    return data;
  },
  async remove(id: number) {
    await api.delete(`documents/${id}/`);
  },
};

export const FormsAPI = {
  async list() {
    const { data } = await api.get<FormItem[] | { results: FormItem[] }>('forms/');
    return Array.isArray(data) ? data : data.results;
  },
  async retrieve(id: number) {
    const { data } = await api.get<FormItem>(`forms/${id}/`);
    return data;
  },
  async submit(formId: number, payload: Record<string, unknown>) {
    const { data } = await api.post<FormSubmission>(`forms/${formId}/submit/`, { data: payload });
    return data;
  },
  async submissions(formId: number) {
    const { data } = await api.get<FormSubmission[] | { results: FormSubmission[] }>(`forms/${formId}/submissions/`);
    return Array.isArray(data) ? data : data.results;
  },
};

export const SubscriptionsAPI = {
  async plans() {
    const { data } = await api.get<SubscriptionPlan[] | { results: SubscriptionPlan[] }>('plans/');
    return Array.isArray(data) ? data : data.results;
  },
  async mine() {
    const { data } = await api.get<Subscription | null>('subscription/');
    return data;
  },
  async createCheckoutSession(plan_id: number, success_url: string, cancel_url: string) {
    const { data } = await api.post<{ url: string }>('checkout/', { plan_id, success_url, cancel_url });
    return data;
  },
  async cancel() {
    return api.post('subscription/cancel/');
  },
};
