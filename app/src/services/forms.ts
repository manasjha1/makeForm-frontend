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

export function mapFrontendTypeToBackend(type: string): any {
  switch (type?.toLowerCase()) {
    case "textarea": return "TEXTAREA";
    case "email": return "EMAIL";
    case "number": return "NUMBER";
    case "tel": return "PHONE";
    case "date": return "DATE";
    case "select": return "SELECT";
    case "radio": return "RADIO";
    case "checkbox": return "CHECKBOX";
    default: return "TEXT";
  }
}

export interface PublicFormDetail {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: string;
  publishedAt: string | null;
  fields: Array<{
    id: string;
    type: string;
    label: string;
    description: string | null;
    placeholder: string | null;
    required: boolean;
    position: number;
    config: any;
  }>;
}

export const fetchPublicForm = async (slug: string): Promise<PublicFormDetail> => {
  const response = await apiHandler<{ success: boolean; data: PublicFormDetail }>({
    url: API_URLS.PUBLIC.FORM(slug),
    method: "GET",
    skipAuth: true,
  });
  return (response.data as any)?.data || response.data;
};

export const submitPublicFormResponse = async (
  slug: string,
  answers: Array<{ fieldId: string; value: any }>
) => {
  const response = await apiHandler({
    url: API_URLS.PUBLIC.SUBMIT(slug),
    method: "POST",
    skipAuth: true,
    body: { answers },
  });
  return response.data;
};

export const saveAndPublishForm = async (form: {
  id?: string;
  title: string;
  description?: string;
  slug?: string;
  fields: any[];
}) => {
  const backendFields = form.fields.map((f, i) => ({
    type: mapFrontendTypeToBackend(f.type),
    label: f.label || "Untitled Question",
    description: f.description || f.helpText || null,
    placeholder: f.placeholder || null,
    required: Boolean(f.required),
    position: i,
    config: {
      options: f.options || [],
      min: f.min,
      max: f.max,
      minLength: f.minLength,
      maxLength: f.maxLength,
    },
  }));

  const payload = {
    title: form.title || "Untitled Form",
    description: form.description || undefined,
    slug: form.slug || undefined,
    publish: true,
    fields: backendFields,
  };

  if (form.id && !form.id.startsWith("template-") && !form.id.startsWith("blank")) {
    try {
      const response = await apiHandler({
        url: API_URLS.FORMS.DETAIL(form.id),
        method: "PATCH",
        body: payload,
      });
      return (response.data as any)?.data || response.data;
    } catch {
      // If form doesn't exist on server, fallback to creating it
    }
  }

  const response = await apiHandler({
    url: API_URLS.FORMS.BASE,
    method: "POST",
    body: payload,
  });
  return (response.data as any)?.data || response.data;
};

