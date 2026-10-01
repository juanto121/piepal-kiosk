import { useCallback, useEffect, useMemo, useState } from 'react'
import { config, type Lang } from './config'
import { translate, type Translate } from './i18n'
import { createStore, getBrowserStorage, type Stock } from './store'
import { useInactivity } from './hooks'
import { IdleScreen } from './screens/IdleScreen'
import { ChooseScreen } from './screens/ChooseScreen'
import { PayScreen } from './screens/PayScreen'
import { ThanksScreen } from './screens/ThanksScreen'
import { OwnerScreen } from './screens/OwnerScreen'

type Screen =
  | { name: 'idle' }
  | { name: 'choose' }
  | { name: 'pay'; pieId: string; startedAt: number }
  | { name: 'thanks'; pieId: string }
  | { name: 'owner' }

const store = createStore(getBrowserStorage(), config.pies)

export function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'idle' })
  const [lang, setLang] = useState<Lang>(config.defaultLanguage)
  const [stock, setStock] = useState<Stock>(() => store.getStock())

  // A pending order left over from a reload or crash counts as a timeout (MVP.md §3.3).
  useEffect(() => {
    if (store.resolvePending('unconfirmed', Date.now())) setStock(store.getStock())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t: Translate = useCallback((key, vars) => translate(lang, key, vars), [lang])

  const goIdle = useCallback(() => {
    store.cancelPending()
    setLang(config.defaultLanguage)
    setScreen({ name: 'idle' })
  }, [])

  const selectPie = (pieId: string) => {
    if ((store.getStock()[pieId] ?? 0) <= 0) return
    const pending = store.startPending(pieId, Date.now())
    setScreen({ name: 'pay', pieId, startedAt: pending.startedAt })
  }

  const handlePaid = () => {
    if (screen.name !== 'pay') return
    store.resolvePending('confirmed', Date.now())
    setStock(store.getStock())
    setScreen({ name: 'thanks', pieId: screen.pieId })
  }

  const handleTimeout = useCallback(() => {
    store.resolvePending('unconfirmed', Date.now())
    setStock(store.getStock())
    goIdle()
  }, [goIdle])

  const handleBackFromPay = () => {
    store.cancelPending()
    setScreen({ name: 'choose' })
  }

  useInactivity(config.chooseIdleSeconds * 1000, goIdle, screen.name === 'choose')
  useInactivity(config.ownerIdleSeconds * 1000, goIdle, screen.name === 'owner')

  const allSoldOut = useMemo(() => config.pies.every((pie) => (stock[pie.id] ?? 0) <= 0), [stock])
  const pieById = (id: string) => config.pies.find((pie) => pie.id === id)!
  const common = { lang, t, onLangChange: setLang }

  let content
  switch (screen.name) {
    case 'idle':
      content = (
        <IdleScreen
          {...common}
          allSoldOut={allSoldOut}
          onStart={() => setScreen({ name: 'choose' })}
          onOwner={() => setScreen({ name: 'owner' })}
        />
      )
      break
    case 'choose':
      content = <ChooseScreen {...common} stock={stock} onBack={goIdle} onSelect={selectPie} />
      break
    case 'pay':
      content = (
        <PayScreen
          {...common}
          pie={pieById(screen.pieId)}
          startedAt={screen.startedAt}
          onBack={handleBackFromPay}
          onPaid={handlePaid}
          onTimeout={handleTimeout}
        />
      )
      break
    case 'thanks':
      content = <ThanksScreen {...common} pie={pieById(screen.pieId)} onDone={goIdle} />
      break
    case 'owner':
      content = (
        <OwnerScreen
          lang={lang}
          t={t}
          stock={stock}
          sales={store.getSales()}
          onSetStock={(pieId, count) => setStock(store.setStock(pieId, count))}
          onReset={() => setStock(store.resetStock())}
          onClose={goIdle}
        />
      )
      break
  }

  return (
    <div className="kiosk" key={screen.name}>
      {content}
    </div>
  )
}
