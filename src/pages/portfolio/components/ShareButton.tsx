import ShareIcon from '@/assets/portfolio/Share.svg?react';

export default function ShareButton() {
  return (
    <button 
      type="button"
      className="flex w-10 h-10 items-center justify-center justify-center rounded-full border-2 border-primary bg-focus"
    >
      <ShareIcon className="size-6" />
    </button>
  )
}