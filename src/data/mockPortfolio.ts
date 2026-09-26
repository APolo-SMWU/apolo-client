import type { PortfolioDocument } from "@/types/portfolio";
import profileAvatar from "@/assets/portfolio/profile-avatar.jpeg";
import projectImage from "@/assets/portfolio/project-hwansung.png";

export const mockPortfolio: PortfolioDocument = {
  id: "mock-portfolio",
  title: "Mock portfolio",
  userType: "professional",
  cardDesignId: "blue",
  siteDesignId: "classic",
  card: {
    name: "DA-IN PARK",
    headline: "Frontend Developer",
    phone: "010-1234-5678",
    email: "test@gmail.com",
    organizationAddress: "00 Company",
  },
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
      { kind: "notion", label: "CV", value: "https://notion.so/canofmato" },
    ],
  },
  blocks: [
    {
      id: "about",
      type: "about",
      visible: true,
      body: "사용자 경험을 세심하게 설계하고, 팀이 오래 유지할 수 있는 인터페이스를 만드는 프론트엔드 개발자입니다. React와 TypeScript를 중심으로 서비스의 문제를 발견하고, 작은 개선을 빠르게 제품에 반영하는 일을 좋아합니다.\n\n새로운 기술을 목적에 맞게 선택하며 디자이너와 백엔드 개발자 사이의 협업 방식을 개선해왔습니다. 안정적인 UI와 명확한 코드로 사용자가 자연스럽게 서비스를 사용할 수 있도록 만드는 것을 중요하게 생각합니다.",
    },
    {
      id: "experience",
      type: "experience",
      visible: true,
      items: [
        {
          id: "experience-1",
          startDate: "Mar. 2026",
          endDate: "Present",
          organization: "COTATO",
          role: "Frontend Team Leader",
          description: "팀의 프론트엔드 개발 방향을 정하고 공통 UI를 설계했습니다.",
        },
        {
          id: "experience-2",
          startDate: "Mar. 2024",
          endDate: "Feb. 2026",
          organization: "DACOS",
          role: "Admin, Head of PR Team",
          description: "서비스 운영과 팀 협업 프로세스를 개선하고, 사용자 피드백을 제품에 반영했습니다.",
        },
        {
          id: "experience-3",
          startDate: "Mar. 2021",
          endDate: "Feb. 2027",
          organization: "Sookmyung Women’s University, South Korea",
          role: "Software Convergence",
          description: "소프트웨어 개발의 기본기를 쌓고 다양한 팀 프로젝트를 진행했습니다.",
        },
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
          description: "지하철역을 새로운 여행지로 연결하는 서비스입니다. 프론트엔드 파트에서 PR 병합과 브랜치 흐름을 관리하고, 팀 단위 UI 리팩터링과 기능 통합을 주도했습니다. GitHub Actions와 Discord 알림을 연동해 협업 효율을 높였습니다.",
          imageUrl: projectImage,
          links: [
            { label: "Link", href: "https://github.com/canofmato" },
            { label: "GitHub", href: "https://github.com/canofmato" },
          ],
        },
        {
          id: "work-2",
          kind: "project",
          title: "환승여행: 매일 지나치던 지하철역이 오늘의 여행지로,",
          role: "Frontend Leader",
          skills: ["React", "TypeScript", "TailwindCSS"],
          description: "팀원들이 쉽게 여행 계획을 세울 수 있도록 검색과 추천 화면을 구현했습니다. 공통 컴포넌트를 정리하고 반응형 레이아웃을 적용해 다양한 화면에서 일관된 경험을 제공했습니다.",
          imageUrl: projectImage,
          links: [
            { label: "Link", href: "https://github.com/canofmato" },
            { label: "GitHub", href: "https://github.com/canofmato" },
          ],
        },
      ],
    },
    {
      id: "skills",
      type: "skills",
      visible: true,
      categories: [
        { category: "Frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "TailwindCSS", "HTML", "CSS", "React Native"] },
        { category: "State / Data", items: ["React Query", "Zustand", "Context API", "Supabase"] },
        { category: "Tools", items: ["GitHub", "Vercel", "Figma", "AWS"] },
      ],
    },
  ],
  sourceLinks: [],
  sourceSnapshots: [],
  schemaVersion: 1,
  status: "draft",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};
