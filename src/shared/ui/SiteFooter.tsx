// Pie común de todas las páginas: línea fina y copyright, anclado al fondo de la última sección.
// La sección que lo contiene debe tener position: relative.
export function SiteFooter() {
  return (
    <footer className="page-shell site-footer">
      <p>© {new Date().getFullYear()} N5 Studio</p>
    </footer>
  )
}
