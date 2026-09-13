import FrontIcon from '@/assets/portfolio/Front.svg?react';
import FrontBlockIcon from '@/assets/portfolio/Front-w.svg?react';
import BackIcon from '@/assets/portfolio/Back.svg?react';
import BackBlockIcon from '@/assets/portfolio/Back-w.svg?react';
import type { Dispatch, SetStateAction } from 'react';

type CardSide = 'front' | 'back';

type CardSideNavigationProps = {
  side: CardSide;
  onSideChange: Dispatch<SetStateAction<CardSide>>;
};

export default function CardSideNavigation({ side, onSideChange }: CardSideNavigationProps) {
  const isFront = side === 'front';

  return (
    <div className="flex h-10 w-20 gap-5 rounded-full border-2 border-primary bg-focus p-4 items-center justify-center">
      <button
        type="button"
        disabled={isFront}
        onClick={() => onSideChange('front')}
        aria-label="명함 앞면 보기"
        className="disabled:cursor-default focus-visible:outline-2 focus-visible:outline-primary"
      >
        {isFront ? <FrontBlockIcon className="size-6" /> : <FrontIcon className="size-6" />}
      </button>
      <button
        type="button"
        disabled={!isFront}
        onClick={() => onSideChange('back')}
        aria-label="웹사이트 뒷면 보기"
        className="disabled:cursor-default focus-visible:outline-2 focus-visible:outline-primary"
      >
        {isFront ? <BackIcon className="size-6" /> : <BackBlockIcon className="size-6" />}
      </button>
    </div>
  )
}
