import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolio,
  getPortfolios,
  sharePortfolio,
  updatePortfolio,
  updatePortfolioContent,
} from "./portfolio";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("portfolio API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("creates a portfolio with the backend generation fields", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse({ portfolio: { id: "portfolio-1" } }, 201),
    );

    await createPortfolio({
      title: "개발자 포트폴리오",
      cardDesignId: "blue",
      siteDesignId: "classic",
      externalLinks: ["https://github.com/example"],
      requirements: "React 프로젝트 중심으로 구성해주세요.",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/portfolios/generate"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          title: "개발자 포트폴리오",
          cardDesignId: "blue",
          siteDesignId: "classic",
          externalLinks: ["https://github.com/example"],
          requirements: "React 프로젝트 중심으로 구성해주세요.",
        }),
      }),
    );
  });

  it("uses the portfolio API for list, detail, update, refresh, share, and delete", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (init?.method === "DELETE") return new Response(null, { status: 204 });
      if (url.endsWith("/share")) return jsonResponse({ shareId: "share-1", shareUrl: "https://example.com/share-1" }, 201);
      return jsonResponse({ portfolio: { id: "portfolio-1", blocks: [] }, portfolios: [] });
    });

    await getPortfolios();
    await getPortfolio("portfolio-1");
    await updatePortfolio("portfolio-1", { blocks: [] });
    await updatePortfolioContent("portfolio-1");
    await sharePortfolio("portfolio-1");
    await deletePortfolio("portfolio-1");

    const calls = fetchMock.mock.calls.map(([input, init]) => `${init?.method ?? "GET"} ${String(input)}`);
    expect(calls).toEqual([
      expect.stringContaining("GET "),
      expect.stringContaining("GET "),
      expect.stringContaining("PATCH "),
      expect.stringContaining("POST "),
      expect.stringContaining("POST "),
      expect.stringContaining("DELETE "),
    ]);
    expect(calls[2]).toContain("/portfolios/portfolio-1");
    expect(calls[3]).toContain("/update-content");
    expect(calls[4]).toContain("/share");
    expect(fetchMock.mock.calls[3][1]).not.toHaveProperty("body");
  });
});
