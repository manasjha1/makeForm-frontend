const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const API_URLS = {
  AUTH: {
    REGISTER_EMAIL: `${BASE_URL}/auth/register`,
    VERIFY_OTP: `${BASE_URL}/auth/verify-email`,
    RESEND_OTP: `${BASE_URL}/auth/resend-verification`,
    LOGIN: `${BASE_URL}/auth/login`,
    ME: `${BASE_URL}/auth/me`,
  },
  FORMS: {
    BASE: `${BASE_URL}/forms`,
    STATS: `${BASE_URL}/forms/dashboard/stats`,
    DETAIL: (id: string) => `${BASE_URL}/forms/${id}`,
    PUBLISH: (id: string) => `${BASE_URL}/forms/${id}/publish`,
    CLOSE: (id: string) => `${BASE_URL}/forms/${id}/close`,
    RESPONSES: (id: string) => `${BASE_URL}/forms/${id}/responses`,
    DELETE_RESPONSE: (formId: string, responseId: string) => `${BASE_URL}/forms/${formId}/responses/${responseId}`,
  },
  PUBLIC: {
    FORM: (slug: string) => `${BASE_URL}/public/forms/${slug}`,
    SUBMIT: (slug: string) => `${BASE_URL}/public/forms/${slug}/responses`,
  },
};

export default API_URLS;

