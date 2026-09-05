import type { ProfileFormField } from "./ProfileFormCard";

export const roles = ["Professional", "Professor", "Student"] as const;
export type Role = (typeof roles)[number];

export const roleFields: Record<Role, ProfileFormField[]> = {
  Professional: [
    { name: "company", label: "Company", placeholder: "회사명을 입력해주세요.", required: true, halfWidth: true },
    { name: "jobTitle", label: "Job Title", placeholder: "직함을 입력해주세요.", required: true, halfWidth: true },
    { name: "tel", label: "Tel", type: "tel", placeholder: "회사 전화번호를 입력해주세요.", required: true },
  ],
  Professor: [
    { name: "university", label: "University", placeholder: "학교명을 입력해주세요.", required: true, halfWidth: true },
    { name: "department", label: "Department", placeholder: "소속 학과를 입력해주세요.", required: true, halfWidth: true },
    { name: "tel", label: "Tel", type: "tel", placeholder: "학교 또는 연구실 전화번호를 입력해주세요.", required: true },
  ],
  Student: [
    { name: "university", label: "University", placeholder: "학교명을 입력해주세요.", required: true, halfWidth: true },
    { name: "major", label: "Major", placeholder: "전공을 입력해주세요.", required: true, halfWidth: true },
  ],
};

