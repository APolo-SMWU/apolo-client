import { afterEach, describe, expect, it, vi } from "vitest";
import { generatePortfolioCv, getPortfolioCvStatus } from "./portfolio";

describe("portfolio CV API", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("gets CV status from the portfolio CV endpoint", async () => {
    localStorage.setItem("accessToken", "token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        message: "CV 상태 조회 성공",
        cv: { exists: false, stale: false, generatedAt: null },
      }), { status: 200 }),
    );

    await expect(getPortfolioCvStatus("portfolio-1")).resolves.toEqual({
      exists: false,
      stale: false,
      generatedAt: null,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/portfolios/portfolio-1/cv"),
      expect.objectContaining({ method: "GET", auth: true }),
    );
  });

  it("generates the CV and returns its signed URL", async () => {
    localStorage.setItem("accessToken", "token");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({
        message: "CV 생성 성공",
        cv: { url: "https://signed.example/cv.pdf", generatedAt: "2026-10-01T06:48:44.000Z", regenerated: true },
      }), { status: 200 }),
    );

    await expect(generatePortfolioCv("portfolio-1")).resolves.toEqual({
      url: "https://signed.example/cv.pdf",
      generatedAt: "2026-10-01T06:48:44.000Z",
      regenerated: true,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/portfolios/portfolio-1/cv"),
      expect.objectContaining({ method: "POST", auth: true, body: "{}" }),
    );
  });
});
