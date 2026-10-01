import { useRef } from 'react'
import type { Lang } from '../config'
import type { Translate } from '../i18n'
import { Mascot } from '../components/Mascot'
import { TopBar, Wordmark } from '../components/TopBar'

const OWNER_LONG_PRESS_MS = 5000

interface IdleScreenProps {
  lang: Lang
  t: Translate
  allSoldOut: boolean
  onLangChange: (lang: Lang) => void
  onStart: () => void
  onOwner: () => void
}

export function IdleScreen({ lang, t, allSoldOut, onLangChange, onStart, onOwner }: IdleScreenProps) {
  const pressTimer = useRef<number | undefined>(undefined)
  const longPressFired = useRef(false)

  const startPress = () => {
    longPressFired.current = false
    window.clearTimeout(pressTimer.current)
    pressTimer.current = window.setTimeout(() => {
      longPressFired.current = true
      onOwner()
    }, OWNER_LONG_PRESS_MS)
  }
  const endPress = () => window.clearTimeout(pressTimer.current)

  const logo = (
    <div
      className="logo-hit"
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerLeave={endPress}
      onPointerCancel={endPress}
      onClick={(event) => {
        if (longPressFired.current) event.stopPropagation()
      }}
    >
      <Wordmark />
    </div>
  )

  return (
    <div
      className={`screen screen--idle ${allSoldOut ? '' : 'is-tappable'}`}
      onClick={allSoldOut ? undefined : onStart}
    >
      <TopBar lang={lang} onLangChange={onLangChange} start={logo} />
      <div className="crust crust--top" />
      <main className="idle">
        {allSoldOut ? (
          <>
            <Mascot pose="soldOut" className="idle__mascot" />
            <h2 className="idle__headline">{t('allSoldOut')}</h2>
            <p className="bubble bubble--up">{t('allSoldOutDino')}</p>
          </>
        ) : (
          <>
            <Mascot pose="idle" className="idle__mascot bob" />
            <h2 className="idle__headline">{t('idleHeadline')}</h2>
            <p className="idle__cta">{t('idleCta')}</p>
          </>
        )}
      </main>
      <div className="crust crust--bottom" />
    </div>
  )
}
