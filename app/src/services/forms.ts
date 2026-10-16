import API_URLS from "../config/apiBook";
import { apiHandler } from "./httpHandler";

export interface FormStatsSummary {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
  fieldsCount: number;
  submissionsCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface DashboardSubmissionAnswer {
  fieldId: string;
  label: string;
  type: string;
  value: any;
}

export interface RecentSubmission {
  id: string;
  formId: string;
  formTitle: string;
  formSlug: string;
  submittedAt: string;
  answers: DashboardSubmissionAnswer[];
}

export interface DashboardStatsResponse {
  totalForms: number;
  totalSubmissions: number;
  formsByStatus: {
    published: number;
    draft: number;
    closed: number;
  };
  forms: FormStatsSummary[];
  recentSubmissions: RecentSubmission[];
}

export interface FormResponseItem {
  id: string;
  formId: string;
  submittedAt: string;
  answers: Array<{
    id: string;
    fieldId: string;
    value: any;
    field: {
      id: string;
      label: string;
      type: string;
    };
  }>;
}

export const fetchDashboardStats = async (): Promise<DashboardStatsResponse> => {
  const response = await apiHandler<{ success: boolean; data: DashboardStatsResponse }>({
    url: API_URLS.FORMS.STATS,
    method: "GET",
  });
  return (response.data as any)?.data || response.data;
};

export const fetchFormResponses = async (
  formId: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  responses: FormResponseItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const response = await apiHandler<{
    success: boolean;
    data: FormResponseItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>({
    url: API_URLS.FORMS.RESPONSES(formId),
    method: "GET",
    params: { page, limit },
  });
  const data = response.data as any;
  return {
    responses: data.data || [],
    pagination: data.pagination || { page, limit, total: (data.data || []).length, totalPages: 1 },
  };
};

export const deleteFormResponse = async (formId: string, responseId: string) => {
  const response = await apiHandler({
    url: API_URLS.FORMS.DELETE_RESPONSE(formId, responseId),
    method: "DELETE",
  });
  return response.data;
};

export const publishForm = async (formId: string) => {
  const response = await apiHandler({
    url: API_URLS.FORMS.PUBLISH(formId),
    method: "POST",
  });
  return response.data;
};

export const closeForm = async (formId: string) => {
  const response = await apiHandler({
    url: API_URLS.FORMS.CLOSE(formId),
    method: "POST",
  });
  return response.data;
};
