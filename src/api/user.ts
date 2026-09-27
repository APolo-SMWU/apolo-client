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

function addField(payload: Record<string, string>, key: string, value?: string) {
  payload[key] = value ?? "";
}

export function toUpdateProfilePayload(body: UpdateProfileRequest): UpdateProfileRequest {
  const payload: Record<string, string> = {
    name: body.name,
    role: body.role,
    phone: body.phone,
  };

  addField(payload, "github", body.github);

  if (body.role === "Student") {
    addField(payload, "university", body.university);
    addField(payload, "major", body.major);
  } else if (body.role === "Professor") {
    addField(payload, "university", body.university);
    addField(payload, "department", body.department);
    addField(payload, "tel", body.tel);
  } else {
    addField(payload, "company", body.company);
    addField(payload, "jobTitle", body.jobTitle);
    addField(payload, "tel", body.tel);
  }

  return payload as UpdateProfileRequest;
}

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
    body: JSON.stringify(toUpdateProfilePayload(body)),
  });
