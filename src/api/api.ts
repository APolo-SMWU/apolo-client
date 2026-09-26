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

async function reissueAccessToken() {
  const response = await fetch(`${BASE_URL}/auth/reissue`, {
    method: "POST",
    credentials: "include",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || typeof data?.accessToken !== "string") return null;
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
}

export async function apiFetch<T>(
  path: string,
  options?:ApiFetchOptions,
): Promise<T> {
  const token = localStorage.getItem("accessToken");
  const shouldUseAuth = options?.auth ?? false;

  const request = (accessToken: string | null) => fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(shouldUseAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options?.headers,
    },
  });

  let response = await request(token);
  if (response.status === 401 && shouldUseAuth && path !== "/auth/reissue") {
    const refreshedToken = await reissueAccessToken().catch(() => null);
    if (refreshedToken) response = await request(refreshedToken);
  }

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
