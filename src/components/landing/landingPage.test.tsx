import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import App from '../../App'
import { LandingPage } from './LandingPage'
import { WindowCard } from './WindowCard'

describe('LandingPage', () => {
  it('renders the desktop composition labels', () => {
    const html = renderToStaticMarkup(<LandingPage />)

    expect(html).toContain('AI가 포트폴리오 초안을 설계하고,')
    expect(html).toContain('무엇을 만들까요?')
    expect(html).toContain('Generated Layout')
    expect(html).toContain('편집 모드')
    expect(html).toContain('GENERATE PORTFOLIO')
    expect(html).toContain('START')
  })

  it('renders layered background text behind positioned cards', () => {
    const html = renderToStaticMarkup(<LandingPage />)

    expect(html).toContain('AI PORTFOLIO')
    expect(html).toContain('GENERATOR')
    expect(html).toContain('BLOCK EDITOR')
  })

  it('uses figma-sized card widths for the desktop composition', () => {
    const html = renderToStaticMarkup(<LandingPage />)

    expect(html).toContain('w-[400px]')
    expect(html).toContain('w-[320px]')
    expect(html).toContain('w-[314px]')
    expect(html).toContain('w-[470px]')
    expect(html).toContain('w-[428px]')
    expect(html).toContain('w-[560px]')
  })

  it('renders a reusable framed card shell', () => {
    const html = renderToStaticMarkup(
      <WindowCard label="C://PROMPT" variant="blue">
        <p>Body</p>
      </WindowCard>,
    )

    expect(html).toContain('C://PROMPT')
    expect(html).toContain('Body')
  })

  it('renders the landing page through App', () => {
    const html = renderToStaticMarkup(<App />)

    expect(html).toContain('AI PORTFOLIO')
    expect(html).toContain('Generated Layout')
  })
})
