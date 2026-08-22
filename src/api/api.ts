const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ApiErrorItem = {
  field: string,
  message: string,
};

export type ApiErrorResponse = {
  message: string,
  code: string,
  errors: ApiErrorItem[];
  status?: number;
};

export type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options?:ApiFetchOptions,
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const shouldUseAuth = options?.auth ?? false;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(shouldUseAuth && token ? {Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw {
      message: data?.message ?? "요청에 실패했습니다.",
      code: data?.errorCode ?? data?.code ?? "UNKNOWN_ERROR",
      errors: data?.errors ?? [],
      status: response.status,
    } satisfies ApiErrorResponse;
  }

  return data as T;
}

// 서버 에러 매핑 팁
export function mapServerErrors(errors: ApiErrorItem[]) {
  const result: Record<string, string> = {};
  
  for (const error of errors) {
    result[error.field] = error.message;
  }
  return result;
}
