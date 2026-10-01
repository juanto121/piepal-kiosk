import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { config, formatPrice, type Lang, type Pie } from '../config'
import type { Translate } from '../i18n'
import { useNow } from '../hooks'
import { CountdownRing } from '../components/CountdownRing'
import { Mascot } from '../components/Mascot'
import { PieArt } from '../components/PieArt'
import { TopBar } from '../components/TopBar'

interface PayScreenProps {
  lang: Lang
  t: Translate
  pie: Pie
  startedAt: number
  onLangChange: (lang: Lang) => void
  onBack: () => void
  onPaid: () => void
  onTimeout: () => void
}

export function PayScreen({ lang, t, pie, startedAt, onLangChange, onBack, onPaid, onTimeout }: PayScreenProps) {
  const totalMs = config.paymentTimeoutSeconds * 1000
  // Remaining time is derived from the saved start time, so it survives throttled tabs.
  const now = useNow(250)
  const remainingMs = Math.max(0, totalMs - (now - startedAt))
  const late = remainingMs <= config.paymentNudgeSeconds * 1000

  const timedOut = useRef(false)
  useEffect(() => {
    if (remainingMs === 0 && !timedOut.current) {
      timedOut.current = true
      onTimeout()
    }
  }, [remainingMs, onTimeout])

  const backButton = (
    <button type="button" className="link-button" onClick={onBack}>
      {t('changePie')}
    </button>
  )

  return (
    <div className="screen screen--pay">
      <TopBar lang={lang} onLangChange={onLangChange} start={backButton} title={t('payTitle')} />
      <main className="pay">
        <section className="pay__info">
          <div className="pay__pie">
            <PieArt pie={pie} className="pay__thumb" />
            <span className="pay__name">{pie.name[lang]}</span>
          </div>
          <p className="pay__price">{formatPrice(pie.price)}</p>
          <p className="pay__instruction">{t('payInstruction')}</p>
        </section>
        <PaymentQr url={pie.paymentUrl} missingLabel={t('missingPaymentLink')} />
        <Mascot pose="pay" className={`pay__mascot ${late ? 'is-late' : 'tap-foot'}`} />
      </main>
      <footer className="pay__actions">
        <p className={`pay__nudge ${late ? 'is-visible' : ''}`} aria-live="polite">
          {late ? t('payNudge') : ' '}
        </p>
        <div className="pay__row">
          <CountdownRing remainingMs={remainingMs} totalMs={totalMs} late={late} label={t('timeLeft')} />
          <button type="button" className={`btn-primary ${late ? 'wobble' : ''}`} onClick={onPaid}>
            {t('paidButton')}
          </button>
        </div>
      </footer>
    </div>
  )
}

function PaymentQr({ url, missingLabel }: { url: string; missingLabel: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setDataUrl(null)
    if (!url) return
    QRCode.toDataURL(url, { width: 720, margin: 2, errorCorrectionLevel: 'M' })
      .then((result) => !cancelled && setDataUrl(result))
      .catch(() => !cancelled && setDataUrl(null))
    return () => {
      cancelled = true
    }
  }, [url])

  if (!url) {
    return (
      <div className="qr qr--missing" role="alert">
        {missingLabel}
      </div>
    )
  }

  return <div className="qr">{dataUrl && <img src={dataUrl} alt="QR" draggable={false} />}</div>
}
