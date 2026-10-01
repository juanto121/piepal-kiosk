import type { Lang } from '../config'
import es from './es.json'
import en from './en.json'

export type MessageKey = keyof typeof es

// Typing `en` against `es` makes a missing English string a compile error.
const messages: Record<Lang, Record<MessageKey, string>> = { es, en: en satisfies Record<MessageKey, string> }

export function translate(lang: Lang, key: MessageKey, vars?: Record<string, string | number>): string {
  let text = messages[lang][key]
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value))
    }
  }
  return text
}

export type Translate = (key: MessageKey, vars?: Record<string, string | number>) => string
