import { useState } from 'react'
import { config, formatPrice, type Lang } from '../config'
import type { Translate } from '../i18n'
import type { Sale, Stock } from '../store'

interface OwnerScreenProps {
  lang: Lang
  t: Translate
  stock: Stock
  sales: Sale[]
  onSetStock: (pieId: string, count: number) => void
  onReset: () => void
  onClose: () => void
}

/** Hidden restock panel. Deliberately plain (see looknfeel.md §5). */
export function OwnerScreen(props: OwnerScreenProps) {
  const [unlocked, setUnlocked] = useState(false)
  return unlocked ? <OwnerPanel {...props} /> : <PinPad t={props.t} onUnlock={() => setUnlocked(true)} onCancel={props.onClose} />
}

function PinPad({ t, onUnlock, onCancel }: { t: Translate; onUnlock: () => void; onCancel: () => void }) {
  const [pin, setPin] = useState('')
  const [wrong, setWrong] = useState(false)
  const length = config.ownerPin.length

  const press = (digit: string) => {
    const next = (pin + digit).slice(0, length)
    setWrong(false)
    setPin(next)
    if (next.length === length) {
      if (next === config.ownerPin) {
        onUnlock()
      } else {
        setWrong(true)
        setPin('')
      }
    }
  }

  return (
    <div className="screen screen--owner">
      <main className="owner owner--pin">
        <h1 className="owner__title">{t('ownerPinPrompt')}</h1>
        <div className={`pin-dots ${wrong ? 'is-wrong' : ''}`} aria-live="polite">
          {Array.from({ length }, (_, i) => (
            <span key={i} className={i < pin.length ? 'is-filled' : ''} />
          ))}
        </div>
        <p className="owner__error">{wrong ? t('ownerPinWrong') : ' '}</p>
        <div className="pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button key={digit} type="button" onClick={() => press(digit)}>
              {digit}
            </button>
          ))}
          <button type="button" className="pin-pad__secondary" onClick={onCancel}>
            {t('ownerCancel')}
          </button>
          <button type="button" onClick={() => press('0')}>
            0
          </button>
          <button type="button" className="pin-pad__secondary" onClick={() => setPin(pin.slice(0, -1))}>
            {t('ownerDelete')}
          </button>
        </div>
      </main>
    </div>
  )
}

function OwnerPanel({ lang, t, stock, sales, onSetStock, onReset, onClose }: OwnerScreenProps) {
  const today = new Date().toDateString()
  const todaysSales = sales.filter((sale) => new Date(sale.time).toDateString() === today)
  const pieName = (id: string) => config.pies.find((pie) => pie.id === id)?.name[lang] ?? id
  const total = todaysSales.reduce((sum, sale) => sum + sale.price, 0)

  return (
    <div className="screen screen--owner">
      <main className="owner">
        <header className="owner__header">
          <h1 className="owner__title">{t('ownerTitle')}</h1>
          <button type="button" className="owner-button" onClick={onClose}>
            {t('ownerClose')}
          </button>
        </header>

        <section className="owner__stock">
          {config.pies.map((pie) => (
            <div key={pie.id} className="stock-row">
              <span className="stock-row__name">{pie.name[lang]}</span>
              <button type="button" className="owner-button" onClick={() => onSetStock(pie.id, stock[pie.id] - 1)}>
                −
              </button>
              <span className="stock-row__count">
                {stock[pie.id]} <small>{t('ownerLeft')}</small>
              </span>
              <button type="button" className="owner-button" onClick={() => onSetStock(pie.id, stock[pie.id] + 1)}>
                +
              </button>
            </div>
          ))}
          <button type="button" className="owner-button owner-button--wide" onClick={onReset}>
            {t('ownerReset')} ({config.pies.map((pie) => pie.initialStock).join(' / ')})
          </button>
        </section>

        <section className="owner__sales">
          <h2>
            {t('ownerSalesToday')} · {todaysSales.length} · {formatPrice(total)}
          </h2>
          <ul className="sales-summary">
            {config.pies.map((pie) => {
              const forPie = todaysSales.filter((sale) => sale.pieId === pie.id)
              const confirmed = forPie.filter((sale) => sale.status === 'confirmed').length
              return (
                <li key={pie.id}>
                  <strong>{pie.name[lang]}</strong>: {confirmed} {t('ownerConfirmed')} · {forPie.length - confirmed}{' '}
                  {t('ownerUnconfirmed')}
                </li>
              )
            })}
          </ul>
          {todaysSales.length === 0 ? (
            <p>{t('ownerNoSales')}</p>
          ) : (
            <ol className="sales-log">
              {[...todaysSales].reverse().map((sale) => (
                <li key={sale.time} className={sale.status === 'unconfirmed' ? 'is-unconfirmed' : ''}>
                  <time>{new Date(sale.time).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</time>
                  <span>{pieName(sale.pieId)}</span>
                  <span>{sale.status === 'confirmed' ? `✓ ${t('saleConfirmed')}` : `? ${t('saleUnconfirmed')}`}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  )
}
