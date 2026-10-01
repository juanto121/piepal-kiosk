import type { Pie } from '../config'

const FILLING = {
  berry: { fill: '#9B2C5A', dots: '#5E1736' },
  lemon: { fill: '#F5D547', dots: '#FFF3B8' },
} as const

/** Pie photo when configured, otherwise an illustrated placeholder in the pie's accent color. */
export function PieArt({ pie, className = '' }: { pie: Pie; className?: string }) {
  if (pie.image) {
    return <img className={`pie-art pie-art--photo ${className}`} src={pie.image} alt="" draggable={false} />
  }

  const { fill, dots } = FILLING[pie.theme]
  return (
    <svg className={`pie-art ${className}`} viewBox="0 0 200 200" aria-hidden="true">
      <ellipse cx="100" cy="176" rx="84" ry="14" fill="#3B2416" opacity="0.12" />
      <circle cx="100" cy="100" r="80" fill="#E8A94B" stroke="#3B2416" strokeWidth="5" />
      <circle cx="100" cy="100" r="60" fill={fill} stroke="#3B2416" strokeWidth="4" />
      {pie.theme === 'berry' ? (
        <g fill={dots}>
          <circle cx="78" cy="86" r="7" />
          <circle cx="118" cy="78" r="6" />
          <circle cx="124" cy="118" r="7" />
          <circle cx="86" cy="124" r="6" />
          <circle cx="102" cy="102" r="5" />
        </g>
      ) : (
        <g fill="none" stroke={dots} strokeWidth="6" strokeLinecap="round">
          <path d="M70 92c12-10 48-10 60 0" />
          <path d="M70 116c12 10 48 10 60 0" />
        </g>
      )}
      <g stroke="#3B2416" strokeWidth="4" fill="#E8A94B" strokeLinejoin="round">
        <path d="M58 70 L142 130" strokeWidth="14" stroke="#E8A94B" />
        <path d="M58 130 L142 70" strokeWidth="14" stroke="#E8A94B" />
      </g>
      <g fill="#C47F2C">
        {Array.from({ length: 16 }, (_, i) => {
          const angle = (i / 16) * Math.PI * 2
          return <circle key={i} cx={100 + Math.cos(angle) * 70} cy={100 + Math.sin(angle) * 70} r="5" />
        })}
      </g>
    </svg>
  )
}
