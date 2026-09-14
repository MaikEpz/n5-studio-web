import { BrandLogo } from './BrandLogo'

interface LoadingScreenProps {
  fading?: boolean
}

export function LoadingScreen({ fading = false }: LoadingScreenProps) {
  return (
    <div
      className={`app-loading-screen ${fading ? 'app-loading-screen-fade' : ''}`}
      role="status"
      aria-label="Cargando N5 Studio"
    >
      <div className="loading-screen-glow" aria-hidden="true" />
      <div className="loading-screen-content">
        <BrandLogo className="loading-screen-logo" />
        <div className="loading-screen-line">
          <span className="loading-screen-progress" />
        </div>
      </div>
    </div>
  )
}
