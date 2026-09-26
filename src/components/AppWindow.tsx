import type { ReactNode } from 'react'

type AppWindowProps = {
  className?: string,
  title?: string,
  children: ReactNode,
}
export default function AppWindow({
  className = '',
  title = '',
  children,
}: AppWindowProps) {
  return (
    <section className={`flex flex-col overflow-hidden rounded-lg bg-white border border-focus ${className}`}>
      <div className='flex h-[30px] items-center gap-4 px-4 bg-surface border-b border-focus'>
        <div className='flex gap-[6px] items-center justify-center'>
          <div className='w-3 h-3 rounded-full bg-danger'/>
          <div className='w-3 h-3 rounded-full bg-warn'/>
          <div className='w-3 h-3 rounded-full bg-success'/>
        </div>

        {title && (
          <div className='flex px-4 items-center justify-center border-l border-focus'>
            <span className='text-body-02 font-semibold text-placeholder leading-none'>
              {title}
            </span>
          </div>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-6 p-8 items-start justify-start'>
        {children}
      </div>
    </section>
  )
}