export const MAX_WORK_IMAGE_SIZE = 10 * 1024 * 1024;
export const WORK_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
const WORK_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateWorkImage(file: File) {
  if (!WORK_IMAGE_TYPES.has(file.type)) {
    return "JPG, PNG, WebP 이미지만 업로드할 수 있어요.";
  }

  if (file.size > MAX_WORK_IMAGE_SIZE) {
    return "이미지는 10MB 이하만 업로드할 수 있어요.";
  }

  return null;
}
