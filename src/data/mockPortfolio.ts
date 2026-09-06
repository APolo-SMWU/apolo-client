import type { PortfolioDocument } from "@/types/portfolio";
import profileAvatar from "@/assets/portfolio/profile-avatar.jpeg";
import projectImage from "@/assets/portfolio/project-hwansung.png";

export const mockPortfolio: PortfolioDocument = {
  id: "mock-portfolio",
  designId: "classic",
  profile: {
    name: "DA-IN PARK",
    title: "Frontend Developer",
    avatarUrl: profileAvatar,
    fields: [
      { kind: "github", label: "GitHub", value: "https://github.com/canofmato" },
      { kind: "scholar", label: "Scholar", value: "Google Scholar" },
      { kind: "company", label: "Company", value: "00 Company" },
      { kind: "email", label: "Email", value: "test@gmail.com" },
      { kind: "phone", label: "Phone", value: "010-1234-5678" },
    ],
  },
  blocks: [
    {
      id: "about",
      type: "about",
      visible: true,
      body: "프론트엔드 개발과 사용자 경험에 관심이 많은 개발자입니다.",
      interests: ["React", "TypeScript", "AI"],
    },
    {
      id: "experience",
      type: "experience",
      visible: true,
      items: [
        { id: "experience-1", startDate: "2024.03", endDate: "Present", organization: "00 Company", role: "Frontend Developer" },
      ],
    },
    {
      id: "works",
      type: "works",
      visible: true,
      items: [
        {
          id: "work-1",
          kind: "project",
          title: "환승여행: 매일 지나치던 지하철역이 오늘의 여행지로,",
          role: "Frontend Leader",
          skills: ["React", "TypeScript", "TailwindCSS"],
          description: "프론트엔드 파트에서 PR 병합과 브랜치 흐름을 관리하고, 팀 단위 UI 리팩터링 및 기능 통합을 주도했습니다.",
          imageUrl: projectImage,
          links: [{ label: "GitHub", href: "https://github.com/canofmato" }],
        },
        {
          id: "work-2",
          kind: "project",
          title: "환승여행: 매일 지나치던 지하철역이 오늘의 여행지로,",
          role: "Frontend Leader",
          skills: ["React", "TypeScript", "TailwindCSS"],
          description: "프론트엔드 파트에서 PR 병합과 브랜치 흐름을 관리하고, 팀 단위 UI 리팩터링 및 기능 통합을 주도했습니다.",
          imageUrl: projectImage,
          links: [{ label: "GitHub", href: "https://github.com/canofmato" }],
        },
      ],
    },
    {
      id: "skills",
      type: "skills",
      visible: true,
      categories: [
        { category: "Languages", items: ["TypeScript", "JavaScript"] },
        { category: "Frameworks", items: ["React", "Next.js"] },
        { category: "Tools", items: ["Git", "Figma"] },
      ],
    },
  ],
};
