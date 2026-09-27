export type PortfolioThemeId = "blue" | "mono" | "orange" | "purple" | "green";

type PortfolioThemeColors = {
  background: string;
  text: string;
};

const portfolioThemeColors: Record<PortfolioThemeId, PortfolioThemeColors> = {
  blue: { background: "#DCEBFF", text: "#245BFF" },
  mono: { background: "#ECEEEF", text: "#222222" },
  orange: { background: "#FFF0CC", text: "#FFAD20" },
  purple: { background: "#F1DCFF", text: "#A020F0" },
  green: { background: "#F0FFDD", text: "#65B82B" },
};

export function getPortfolioThemeColors(themeId: string): PortfolioThemeColors {
  return portfolioThemeColors[themeId as PortfolioThemeId];
}
