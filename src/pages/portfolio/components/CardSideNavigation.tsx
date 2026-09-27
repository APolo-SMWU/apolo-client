import FrontIcon from '@/assets/portfolio/Front.svg?react';
import BackIcon from '@/assets/portfolio/Back.svg?react';
import type { Dispatch, SetStateAction } from 'react';

type CardSide = 'front' | 'back';

type CardSideNavigationProps = {
  side: CardSide;
  onSideChange: Dispatch<SetStateAction<CardSide>>;
};

export default function CardSideNavigation({ side, onSideChange }: CardSideNavigationProps) {
  const isFront = side === 'front';

  return (
    <div className="flex h-10 w-20 items-center justify-center overflow-hidden rounded-ml border border-placeholder bg-white">
      <button
        type="button"
        disabled={isFront}
        onClick={() => onSideChange('front')}
        aria-label="명함 앞면 보기"
        className="flex h-full flex-1 items-center justify-center text-placeholder hover:bg-primary hover:text-white disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-placeholder focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <FrontIcon className="size-6" />
      </button>
      <button
        type="button"
        disabled={!isFront}
        onClick={() => onSideChange('back')}
        aria-label="웹사이트 뒷면 보기"
        className="flex h-full flex-1 items-center justify-center text-placeholder hover:bg-primary hover:text-white disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-placeholder focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <BackIcon className="size-6" />
      </button>
    </div>
  )
}
