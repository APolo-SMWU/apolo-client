import ShareIcon from '@/assets/portfolio/Share.svg?react';

type ShareButtonProps = {
  onClick?: () => void;
};

export default function ShareButton({ onClick }: ShareButtonProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      aria-label="온라인 명함 공유"
      className="flex w-10 h-10 items-center justify-center justify-center rounded-full border-2 border-primary bg-focus"
    >
      <ShareIcon className="size-6" />
    </button>
  )
}
