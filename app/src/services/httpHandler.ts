/**
 * @file request.ts
 * @description Universal entry point for every API call in the application.
 * All requests — from services, hooks, anywhere — go through this one function.
 *
 * Usage:
 *   request({ url: '/users' })
 *   request({ url: '/users/123', method: 'PATCH', body: { name: 'John' } })
 *   request({ url: '/upload', method: 'POST', file: formData })
 */

import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
  type Method,
} from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ResponseType = "json" | "blob" | "text";

export interface RequestConfig {
  /** Endpoint path — e.g. '/users' or '/users/123' */
  url: string;

  /** HTTP method — defaults to 'GET' */
  method?: Method;

  /** Request body for POST / PUT / PATCH */
  body?: unknown;

  /** Query params — appended to the URL automatically */
  params?: Record<string, unknown>;

  /** Merge or override default headers */
  headers?: Record<string, string>;

  /** File upload — switches Content-Type to multipart/form-data */
  file?: FormData;

  /** Expected response format — defaults to 'json' */
  responseType?: ResponseType;

  /** Override base URL for this request only — e.g. third-party APIs */
  baseURL?: string;

  /** Override timeout for this request only (ms) */
  timeout?: number;

  /** Skip attaching the Authorization header for this request */
  skipAuth?: boolean;

  /** Abort signal for cancellable requests */
  signal?: AbortSignal;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>; // field-level validation errors from server
}

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// Request interceptor
// Runs before EVERY outgoing request
// ─────────────────────────────────────────────────────────────────────────────

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─────────────────────────────────────────────────────────────────────────────
// Response interceptor
// Runs after EVERY response — success and error
// ─────────────────────────────────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    return Promise.reject(error);
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// buildHeaders
// Merges default headers + optional overrides for every request
// ─────────────────────────────────────────────────────────────────────────────

const buildHeaders = (cfg: RequestConfig): Record<string, string> => {
  const defaults: Record<string, string> = {
    "Content-Type": cfg.file ? "multipart/form-data" : "application/json",
    Accept: "application/json",
  };

  // Strip Content-Type for blob responses
  if (cfg.responseType === "blob") {
    delete defaults["Content-Type"];
  }

  // Auth header — skip if explicitly opted out (e.g. login, public endpoints)
  if (!cfg.skipAuth) {
    const token = localStorage.getItem("token");
    if (token) defaults["Authorization"] = `Bearer ${token}`;
  }

  // Caller overrides — always win over defaults
  return { ...defaults, ...cfg.headers };
};

export async function apiHandler<T = unknown>(
  cfg: RequestConfig,
): Promise<ApiResponse<T>> {
  const {
    url,
    method = "GET",
    body,
    params,
    file,
    responseType = "json",
    baseURL,
    timeout,
    signal,
  } = cfg;

  const axiosConfig: AxiosRequestConfig = {
    url,
    method,
    params,
    data: file ?? body,
    headers: buildHeaders(cfg),
    responseType,
    signal,
    ...(baseURL && { baseURL }),
    ...(timeout && { timeout }),
  };

  try {
    const response = await apiClient.request<T>(axiosConfig);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  } catch (err) {
    const error = err as AxiosError<ApiError>;

    // Normalize error shape so callers always get a consistent object
    throw {
      message:
        error.response?.data?.message ?? error.message ?? "Request failed",
      statusCode: error.response?.status ?? 0,
      errors: error.response?.data?.errors ?? {},
    } satisfies ApiError;
  }
}
