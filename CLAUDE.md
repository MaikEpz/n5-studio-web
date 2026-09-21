# N5 Studio Web

## Regla de color para secciones (obligatoria)

Se toma como referencia la forma en que usan el color las 3 primeras secciones del Home (Hero, Qué es N5 y Divisiones). Toda sección nueva o modificada debe cumplir esta regla.

- **Base monocromática.** Cada sección usa `section-dark` (fondo negro) o `section-light` (fondo blanco). Nunca se usa un fondo morado; `section-brand` ya no existe.
- **El morado (`--brand`, #670d8c) es solo acento.** Cada sección lleva **de 1 a 3 acentos**, pequeños y puntuales.
- **Acento obligatorio: la etiqueta de sección** (`.eyebrow`).
  - Si está dentro de `.section-intro`, recibe el acento automáticamente.
  - Si la etiqueta va suelta, añade la clase `eyebrow-accent`.
  - Con fondo claro, el texto se vuelve morado. Con fondo oscuro, aparece una barra morada corta debajo, porque el texto morado sobre negro no se lee bien.
  - Las sub-etiquetas internas de una sección quedan neutras.
- **Acentos opcionales (máximo 2 más):**
  - una frase clave resaltada en fondo claro (como el `strong` de "Qué es N5");
  - una línea o anillo decorativo fino;
  - una barra de progreso.
- **Los estados de interacción de los CTA** (hover o activo en morado, como `.cta-button` o `.nav-cta`) están permitidos y no cuentan como acento.
- **Nunca en morado:**
  - elementos repetidos (números, íconos o etiquetas de listas, tarjetas, tags o marquesinas): usar el color del texto con opacidad (`opacity: .45`);
  - el hover de elementos neutros: usar tintes negros o blancos (`rgba(0,0,0,.05)`);
  - bloques sólidos o velos morados sobre imágenes.
- **Efectos de fondo fijos** (`CinematicOverlay`): deben aparecer y desaparecer dentro de su propia sección, sin quedar visibles sobre las siguientes.

## Regla de altura y punto de reposo (obligatoria)

Toda sección debe tener un **punto de reposo**: un tramo de scroll en el que se ve completa y ningún elemento está en su animación de entrada o de salida (opacidad 1, sin desenfoque, sin desplazamiento).

- **Altura:** en escritorio, desde 1366×768, la sección no puede superar la altura de la pantalla.
  - Los espacios y tamaños de título se dimensionan con la altura: `clamp(min, Nvh, max)`, o `min(vw, vh)` en tipografías grandes.
  - Nada de paddings o márgenes fijos grandes (130px, 60px…) ni imágenes con `aspect-ratio` que crezcan con el ancho.
  - Si el contenido no cabe, se divide en varias secciones.
- **Tramo de reposo:** la sección se ve entera desde que su borde inferior llega al fondo de la pantalla hasta que su borde superior llega arriba.
  - Las entradas deben terminar antes de ese tramo y las salidas empezar después.
  - Esto ya lo calcula el bloque "Punto de reposo" de `StudioPage.tsx` para todo elemento con clase `.reveal` dentro de una sección intermedia. No crear animaciones de scroll por sección que ignoren ese cálculo.
- **Excepciones:**
  - el Hero, que es una escena fija de scroll;
  - en móvil, las secciones pueden ser más altas que la pantalla.
- **Verificación:** medir en 1920×1080 y 1366×768 que la sección no supere la altura de la pantalla y que, en su punto de reposo, todos sus `.reveal` estén con opacidad 1 y `blur(0px)`.

## Regla de estilo de páginas (obligatoria)

- **Referencia:** las páginas N5 RRSS y Work. El estilo es editorial y tipográfico, minimalista.
  - Cada sección lleva etiqueta de sección, título y texto breve.
  - Se usan rejillas de líneas finas: columnas (`process-steps`) y listas (`services-list`).
  - Las imágenes solo aparecen en las tarjetas de proyecto (`featured-work`) y en el Case Study, donde la imagen es el propio proyecto.
  - Nada de fotos de fondo, objetos decorativos ni etiquetas en forma de píldora.
- **Variedad sobria:** una sección no repite la estructura de la anterior (portada, columnas, lista, tarjetas) y los fondos se alternan entre claro y oscuro.
- **Páginas de división:** se construyen con los bloques de `src/features/division-pages/DivisionSections.tsx` (`DivisionIntro`, `ColumnsSection`, `WorkShowcase`), que reutilizan los estilos de RRSS.

## Otras convenciones de contenido

- Sin numeración visible en las secciones: nada de "01 —" en etiquetas, "00 / 08" ni contadores "01 / 03".
- Los logos de clientes se muestran en negro, para que sean uniformes. Si el logo es blanco o de color, se usa `darken: true`.
