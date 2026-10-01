import type { ReactNode } from 'react'
import type { Lang } from '../config'

interface TopBarProps {
  lang: Lang
  onLangChange: (lang: Lang) => void
  start?: ReactNode
  title?: string
}

export function TopBar({ lang, onLangChange, start, title }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar__side">{start}</div>
      {title ? <h1 className="topbar__title">{title}</h1> : <span />}
      <div className="topbar__side topbar__side--end">
        <LangToggle lang={lang} onChange={onLangChange} />
      </div>
    </header>
  )
}

function LangToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  const options: { value: Lang; label: string }[] = [
    { value: 'es', label: '🇨🇴 ES' },
    { value: 'en', label: '🇺🇸 EN' },
  ]
  return (
    <div className="lang" role="group" aria-label="Idioma / Language">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={lang === option.value}
          onClick={(event) => {
            event.stopPropagation()
            onChange(option.value)
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export function Wordmark() {
  return (
    <span className="wordmark" aria-label="PiePal">
      Pie<span className="wordmark__pal">Pal</span>
    </span>
  )
}
