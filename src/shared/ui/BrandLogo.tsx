export type BrandLogoProps = { full?: boolean; className?: string }

export function BrandLogo({ full = false, className = '' }: BrandLogoProps) {
  return (
    <svg
      className={`brand-logo ${full ? 'brand-logo-full' : 'brand-logo-mark'} ${className}`.trim()}
      viewBox={full ? '360 400 680 780' : '360 400 680 650'}
      aria-hidden="true"
      focusable="false"
    >
      <image href="/iconos/logo_n5.svg" x="360" y="400" width="680" height="780" preserveAspectRatio="xMidYMid meet" />
    </svg>
  )
}
