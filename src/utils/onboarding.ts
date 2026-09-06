const ONBOARDING_STORAGE_PREFIX = "onboardingCompleted";

export function getOnboardingStorageKey(email: string) {
  return `${ONBOARDING_STORAGE_PREFIX}:${email}`;
}

export function hasCompletedOnboarding(email: string) {
  return localStorage.getItem(getOnboardingStorageKey(email)) === "true";
}

export function markOnboardingCompleted(email: string) {
  localStorage.setItem(getOnboardingStorageKey(email), "true");
}
