import { useMemo } from 'react'
import { config, type Lang, type Pie } from '../config'
import type { Translate } from '../i18n'
import { useTimeout } from '../hooks'
import { Mascot } from '../components/Mascot'
import { TopBar } from '../components/TopBar'

const CRUMB_COLORS = { berry: ['#E8A94B', '#9B2C5A', '#B9772A'], lemon: ['#E8A94B', '#F5D547', '#B9772A'] }

interface ThanksScreenProps {
  lang: Lang
  t: Translate
  pie: Pie
  onLangChange: (lang: Lang) => void
  onDone: () => void
}

export function ThanksScreen({ lang, t, pie, onLangChange, onDone }: ThanksScreenProps) {
  useTimeout(config.thanksSeconds * 1000, onDone)

  const crumbs = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        size: 10 + Math.random() * 16,
        drift: (Math.random() - 0.5) * 120,
        color: CRUMB_COLORS[pie.theme][i % 3],
      })),
    [pie.theme],
  )

  return (
    <div className="screen screen--thanks" onClick={onDone}>
      <TopBar lang={lang} onLangChange={onLangChange} />
      <main className="thanks">
        <Mascot pose="thanks" className="thanks__mascot pop" />
        <h2 className="thanks__title">{t('thanksTitle')}</h2>
        <p className="thanks__pickup">{config.pickupNote[lang]}</p>
      </main>
      <div className="crumbs" aria-hidden="true">
        {crumbs.map((crumb, i) => (
          <span
            key={i}
            style={{
              left: `${crumb.left}%`,
              width: crumb.size,
              height: crumb.size,
              background: crumb.color,
              animationDelay: `${crumb.delay}s`,
              ['--drift' as string]: `${crumb.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
