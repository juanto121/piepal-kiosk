import raw from './config/pies.json'

export type Lang = 'es' | 'en'
export type Localized = Record<Lang, string>

export interface Pie {
  id: string
  theme: 'berry' | 'lemon'
  name: Localized
  description: Localized
  price: number
  initialStock: number
  /** Path under /public (e.g. "/pies/lemon.jpg"); null shows the illustrated placeholder. */
  image: string | null
  /** Payment link encoded in a generated QR. Used only when `paymentQrImage` is not set. */
  paymentUrl: string
  /** Ready-made payment QR under /public (e.g. a bank QR). Takes precedence over `paymentUrl`. */
  paymentQrImage?: string | null
}

export interface KioskConfig {
  currency: string
  defaultLanguage: Lang
  paymentTimeoutSeconds: number
  paymentNudgeSeconds: number
  chooseIdleSeconds: number
  ownerIdleSeconds: number
  thanksSeconds: number
  lowStockThreshold: number
  ownerPin: string
  pickupNote: Localized
  pies: Pie[]
}

export const config = raw as KioskConfig

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('es-CO')} ${config.currency}`
}
