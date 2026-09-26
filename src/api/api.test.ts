import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api";

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

describe("apiFetch authentication", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reissues an expired access token and retries the authenticated request", async () => {
    localStorage.setItem("accessToken", "expired-token");
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(jsonResponse({ message: "인증이 필요합니다." }, 401))
      .mockResolvedValueOnce(jsonResponse({ accessToken: "fresh-token" }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }));

    await expect(apiFetch<{ ok: boolean }>("/portfolios/1/profile/avatar", { method: "POST", auth: true, body: new FormData() })).resolves.toEqual({ ok: true });

    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({ Authorization: "Bearer expired-token" });
    expect(fetchMock.mock.calls[1][0]).toContain("/auth/reissue");
    expect(fetchMock.mock.calls[2][1]?.headers).toMatchObject({ Authorization: "Bearer fresh-token" });
  });
});
