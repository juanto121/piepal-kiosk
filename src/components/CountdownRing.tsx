interface CountdownRingProps {
  remainingMs: number
  totalMs: number
  late: boolean
  label: string
}

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function formatClock(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function CountdownRing({ remainingMs, totalMs, late, label }: CountdownRingProps) {
  const fraction = Math.max(0, Math.min(1, remainingMs / totalMs))
  return (
    <div className={`countdown ${late ? 'is-late' : ''}`} role="timer" aria-label={label}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="countdown__track" cx="60" cy="60" r={RADIUS} />
        <circle
          className="countdown__bar"
          cx="60"
          cy="60"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <span className="countdown__label">{formatClock(remainingMs)}</span>
    </div>
  )
}
