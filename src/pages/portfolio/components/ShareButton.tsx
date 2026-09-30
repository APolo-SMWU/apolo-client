import { Download } from "lucide-react";
import Button from '@/components/common/Button';

type ShareButtonProps = {
  onClick?: () => void;
};

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="명함 이미지 추출"
      className="group h-10! w-10! px-0"
    >
      <Download className="size-6 opacity-60 transition group-hover:opacity-100" aria-hidden="true" />
    </Button>
  )
}
