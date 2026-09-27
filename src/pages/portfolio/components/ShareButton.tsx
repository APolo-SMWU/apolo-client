import ShareIcon from '@/assets/portfolio/Share.svg?react';
import Button from '@/components/common/Button';

type ShareButtonProps = {
  onClick?: () => void;
};

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <Button
      onClick={onClick}
      aria-label="온라인 명함 공유"
      className="group h-10! w-10! px-0"
    >
      <ShareIcon className="size-6 opacity-60 grayscale transition group-hover:brightness-0 group-hover:opacity-100 group-hover:grayscale-0 group-hover:invert" />
    </Button>
  )
}
