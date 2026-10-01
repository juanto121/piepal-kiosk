import { useEffect, useState } from 'react'
import { config, formatPrice, type Lang } from '../config'
import type { Translate } from '../i18n'
import type { Stock } from '../store'
import { Mascot } from '../components/Mascot'
import { PieArt } from '../components/PieArt'
import { TopBar } from '../components/TopBar'

const GAZE_SWITCH_MS = 3000

interface ChooseScreenProps {
  lang: Lang
  t: Translate
  stock: Stock
  onLangChange: (lang: Lang) => void
  onBack: () => void
  onSelect: (pieId: string) => void
}

export function ChooseScreen({ lang, t, stock, onLangChange, onBack, onSelect }: ChooseScreenProps) {
  const pies = config.pies
  const availableIndexes = pies.map((pie, i) => (stock[pie.id] > 0 ? i : -1)).filter((i) => i >= 0)

  // The dino glances between the available pies; with one left it stares at that one.
  const [gaze, setGaze] = useState(() => availableIndexes[availableIndexes.length - 1] ?? 1)
  const availableKey = availableIndexes.join(',')
  useEffect(() => {
    const indexes = availableKey ? availableKey.split(',').map(Number) : []
    if (indexes.length === 0) return
    setGaze(indexes[indexes.length - 1])
    if (indexes.length < 2) return
    const id = window.setInterval(() => {
      setGaze((current) => indexes[(indexes.indexOf(current) + 1) % indexes.length])
    }, GAZE_SWITCH_MS)
    return () => window.clearInterval(id)
  }, [availableKey])

  const lemonAvailable = stock.lemon > 0
  const backButton = (
    <button type="button" className="link-button" onClick={onBack}>
      {t('back')}
    </button>
  )

  return (
    <div className="screen screen--choose">
      <TopBar lang={lang} onLangChange={onLangChange} start={backButton} title={t('chooseTitle')} />
      <main className="choose">
        {pies.map((pie, index) => {
          const left = stock[pie.id] ?? 0
          const soldOut = left <= 0
          const lowStock = !soldOut && left <= config.lowStockThreshold
          return (
            <button
              key={pie.id}
              type="button"
              className={`pie-card pie-card--${pie.theme} ${soldOut ? 'is-sold-out' : ''}`}
              style={{ order: index === 0 ? 0 : 2 }}
              disabled={soldOut}
              onClick={() => onSelect(pie.id)}
            >
              {lowStock && <span className="badge">{t('lowStock', { n: left })}</span>}
              <PieArt pie={pie} className="pie-card__art" />
              <span className="pie-card__name">{pie.name[lang]}</span>
              <span className="pie-card__desc">{pie.description[lang]}</span>
              <span className="pie-card__price">{formatPrice(pie.price)}</span>
              {soldOut && <span className="pie-card__ribbon">{t('soldOut')}</span>}
            </button>
          )
        })}
        <div className="choose__dino" style={{ order: 1 }}>
          {lemonAvailable && <p className="bubble bubble--down">{t('chooseDino')}</p>}
          <Mascot pose="choose" mirrored={gaze === 0} className="bob" />
        </div>
      </main>
    </div>
  )
}
