export const MASCOT_POSES = {
  idle: '/mascot/idle.webp',
  choose: '/mascot/choose.webp',
  pay: '/mascot/pay.webp',
  thanks: '/mascot/thanks.webp',
  soldOut: '/mascot/sold-out.webp',
} as const

export type MascotPose = keyof typeof MASCOT_POSES

interface MascotProps {
  pose: MascotPose
  /** The choose pose looks right; mirrored it looks at the left-hand card. */
  mirrored?: boolean
  className?: string
}

export function Mascot({ pose, mirrored = false, className = '' }: MascotProps) {
  return (
    <div className={`mascot mascot--${pose} ${className}`}>
      <img
        src={MASCOT_POSES[pose]}
        alt=""
        width={1200}
        height={800}
        draggable={false}
        className={mirrored ? 'is-mirrored' : undefined}
      />
    </div>
  )
}

export function preloadMascots() {
  for (const src of Object.values(MASCOT_POSES)) {
    const img = new Image()
    img.src = src
  }
}
