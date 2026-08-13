# Escenas WebGL inspiradas en Son Daven para N5 Studio

## Objetivo

Construir una experiencia audiovisual controlada por scroll donde una escena permanece fija mientras la cámara se aleja y varias capas —arquitectura, montañas, árboles, aves y texto— se desplazan a profundidades diferentes.

El efecto de Son Daven no es un parallax convencional. Es un compositor WebGL que procesa imágenes y videos mediante shaders, los combina en un canvas y sincroniza sus propiedades con GSAP y ScrollTrigger.

## Arquitectura técnica

La implementación final debe tener estas piezas:

1. **Escena fija:** una sección de `200–300vh` contiene un canvas `position: sticky` de `100vh`.
2. **Compositor WebGL:** renderiza un rectángulo a pantalla completa y combina varias texturas.
3. **Shader de trama:** transforma la luminosidad de las imágenes en líneas verticales de ancho variable.
4. **Capas separadas:** fondo, montaña, vegetación, personajes/objetos, aves y partículas.
5. **Control de cámara:** el progreso normalizado del scroll (`0–1`) modifica escala, posición, opacidad y profundidad.
6. **Tipografía 3D:** cada línea vive en un plano distinto y responde desde el primer píxel de desplazamiento.
7. **Fallback accesible:** imagen estática y contenido normal cuando existe `prefers-reduced-motion`, WebGL no está disponible o el dispositivo tiene poca capacidad.

## Preparación de assets

### Fondo arquitectónico

- Imagen WebP o AVIF de 1920–2880 px.
- Encuadre amplio con espacio negativo para titulares.
- Debe soportar un zoom inicial sin perder resolución.

### Montañas y formas estáticas

- PNG/WebP con transparencia o fondo negro/blanco de alto contraste.
- Cada plano de montaña debe exportarse por separado.
- Recomendación: tres planos —lejano, medio y cercano— para producir profundidad real.

### Árboles y vegetación animada

- Video de cámara fija, duración de 4–8 segundos y bucle limpio.
- Fondo negro, blanco o chroma uniforme; el shader puede eliminarlo por luminancia.
- WebM con alfa cuando sea posible; MP4/H.264 como alternativa.
- Las ramas deben moverse sutilmente. Un movimiento exagerado hace visible el recorte.

### Aves, nubes y partículas

- Videos independientes, sin cámara en movimiento.
- Crear varias bandadas con escalas y velocidades distintas.
- Evitar una sola animación repetida en toda la página.

### Exportación recomendada

| Recurso | Formato principal | Alternativa | Tamaño recomendado |
| --- | --- | --- | --- |
| Fondo | AVIF/WebP | JPG | 1920–2880 px |
| Capa estática | WebP/PNG alfa | fondo negro | 1000–1800 px |
| Árbol/personaje | WebM alfa | MP4 | 720p–1080p |
| Aves/nubes | WebM alfa | MP4 | 720p |
| Audio ambiental | AAC/MP3 | OGG | 96–160 kbps |

## Shader de líneas

El fragment shader divide una textura en celdas, mide su luminancia y convierte el resultado en el ancho de una línea vertical:

```glsl
vec2 cell = floor(uv * grid);
vec2 cellUv = fract(uv * grid);
vec3 color = texture2D(texture, (cell + 0.5) / grid).rgb;
float brightness = dot(color, vec3(0.3333));
float lineWidth = mix(maxWidth, minWidth, brightness);
float line = step(abs(cellUv.x - 0.5), lineWidth * 0.5);
```

Los controles que deben exponerse por capa son:

- `x`, `y`, `width`, `height`.
- `xSquares`, `ySquares`.
- `blackPoint`, `whitePoint`, `threshold`.
- `fillColor`, `backgroundColor` y opacidades.
- Escala, velocidad, dirección y fase de animación.

## Secuencia del hero N5

1. **Scroll 0:** imagen muy cercana, texto completamente visible y todas las letras dentro del viewport.
2. **0–20 %:** las líneas del título retroceden inmediatamente a diferentes velocidades.
3. **0–55 %:** la cámara se aleja; aparecen progresivamente la montaña tramada y el árbol.
4. **20–75 %:** las aves cruzan la escena y el árbol oscila con el viento.
5. **55–100 %:** la imagen queda enmarcada, el texto se disuelve y las capas se dispersan antes de la siguiente sección.

## Rendimiento

- Limitar el `devicePixelRatio` del canvas a `1.5`.
- Detener `requestAnimationFrame` fuera del viewport.
- No decodificar todos los videos al cargar la página.
- Usar `IntersectionObserver` para inicialización diferida.
- Mantener entre 3 y 6 capas activas por escena.
- Comprimir texturas y evitar PNG grandes cuando no haya transparencia.
- Probar en GPU integrada y Safari/iOS, no solo en equipos de escritorio.

## Móvil y accesibilidad

- Reducir la cantidad de celdas y capas en pantallas pequeñas.
- Sustituir videos alfa costosos por imágenes estáticas cuando sea necesario.
- Mantener el texto en HTML, no dentro del canvas.
- Respetar `prefers-reduced-motion` y mostrar una escena estática legible.
- Proporcionar texto alternativo al canvas.
- El sonido debe estar desactivado por defecto y activarse únicamente por interacción explícita.

## Estado de la implementación incluida

La portada usa actualmente una sola imagen estática optimizada en WebP. La profundidad se crea escalando y desplazando la imagen, el texto y los elementos decorativos a ritmos distintos desde el primer píxel de scroll. No se carga una secuencia de imágenes ni se ejecuta un shader WebGL en el hero.

Las escenas WebGL descritas arriba quedan documentadas como una ampliación futura para cuando existan recursos separados —árboles, aves, personas, objetos, nubes o mapas de profundidad— preparados específicamente para composición.
