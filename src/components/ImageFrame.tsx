import type { ReactNode } from 'react'

export function ImageFrame({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`image-frame ${className}`.trim()}>{children}<span className="frame-focus" aria-hidden="true" /></div>
}
