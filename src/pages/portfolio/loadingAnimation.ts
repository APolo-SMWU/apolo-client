export type LoadingAnimationDirection = "forward" | "reverse";

export function getNextLoadingAnimationDirection(
  direction: LoadingAnimationDirection,
  currentFrame: number,
): LoadingAnimationDirection | null {
  if (direction === "forward" && currentFrame >= 78) return "reverse";
  if (direction === "reverse" && currentFrame <= 2) return "forward";
  return null;
}
