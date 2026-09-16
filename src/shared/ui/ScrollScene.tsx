export function ScrollScene({ label }: { label: string }) {
  return (
    <div className="scroll-scene" aria-hidden="true">
      <span className="scene-corner top-left" /><span className="scene-corner top-right" />
      <span className="scene-corner bottom-left" /><span className="scene-corner bottom-right" />
      <small>{label}</small>
    </div>
  )
}
