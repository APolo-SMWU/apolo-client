import { apiFetch } from "./api";

export type SignupRequest = {
  email: string,
  nickname: string,
  password: string,
  passwordCheck: string;
};

export type LoginRequest = {
  email: string,
  password: string,
};

export type LoginResponse = {
  accessToken: string;
};

export type MeResponse = {
  email: string,
  nickname: string;
};

// 회원가입
export const signup = (body: SignupRequest) =>
  apiFetch<void>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(body),
  });

// 로그인
export const login = (body: LoginRequest) =>
  apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });

// 내 정보 조회
export const getMe = () =>
  apiFetch<MeResponse>("/auth/me", {
    method: "GET",
    auth: true,
  });