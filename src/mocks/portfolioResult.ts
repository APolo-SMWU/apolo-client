export type PreviewSection = {
  id: string;
  label: string;
  className: string;
};

export const mockPortfolioResult = {
  title: "프론트엔드 개발자 포트폴리오",
  blocks: ["Hero", "Profile", "Skills", "Projects", "Troubleshooting", "Contact"],
  previewSections: [
    { id: "hero", label: "Hero", className: "col-span-2 row-span-1 bg-primary/12" },
    { id: "profile", label: "Profile", className: "row-span-2 bg-ink/6" },
    { id: "skills", label: "Skills", className: "bg-white" },
    { id: "projects", label: "Projects", className: "col-span-2 bg-white" },
    { id: "troubleshooting", label: "Troubleshooting", className: "bg-white" },
    { id: "contact", label: "Contact", className: "col-span-2 bg-primary/8" },
  ] satisfies PreviewSection[],
};
