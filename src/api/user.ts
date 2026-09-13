import { apiFetch } from "./api";

export type Role = "Professional" | "Professor" | "Student";

export type UserProfile = {
  id: number;
  email: string;
  name: string;
  role: Role | null;
  phone: string | null;
  github: string | null;
  company: string | null;
  jobTitle: string | null;
  tel: string | null;
  university: string | null;
  department: string | null;
  major: string | null;
  onboardingCompleted: boolean;
};

export type UserResponse = {
  message: string;
  user: UserProfile;
};

export type OnboardingRequest = {
  role: Role;
  phone: string;
  github?: string;
  company?: string;
  jobTitle?: string;
  tel?: string;
  university?: string;
  department?: string;
  major?: string;
};

export type UpdateProfileRequest = OnboardingRequest & {
  name: string;
};

export const getUserProfile = () =>
  apiFetch<UserResponse>("/users/me", {
    method: "GET",
    auth: true,
  });

export const completeOnboarding = (body: OnboardingRequest) =>
  apiFetch<UserResponse>("/users/me/onboarding", {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });

export const updateProfile = (body: UpdateProfileRequest) =>
  apiFetch<UserResponse>("/users/me/profile", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  });
