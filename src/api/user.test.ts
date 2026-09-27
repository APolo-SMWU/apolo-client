import { afterEach, describe, expect, it, vi } from "vitest";
import { updateProfile, type UpdateProfileRequest } from "./user";

describe("updateProfile", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends phone instead of mobile and excludes user-only fields", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "ok", user: {} }), { status: 200 }),
    );

    const formState = {
      id: 1,
      email: "dain@example.com",
      name: "박다인",
      onboardingCompleted: true,
      role: "Student",
      phone: "010-1234-5678",
      github: "https://github.com/canofmato",
      university: "숙명여자대학교",
      major: "소프트웨어융합전공",
      company: "",
      jobTitle: "",
      tel: "",
      department: "",
    } as UpdateProfileRequest;

    await updateProfile(formState);

    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).toEqual({
      name: "박다인",
      role: "Student",
      phone: "010-1234-5678",
      university: "숙명여자대학교",
      major: "소프트웨어융합전공",
      github: "https://github.com/canofmato",
    });
    expect(JSON.parse(fetchMock.mock.calls[0][1]?.body as string)).not.toHaveProperty("mobile");
  });
});
